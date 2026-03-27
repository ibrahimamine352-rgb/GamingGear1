import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { PCCustom, PackCustom } from "@/hooks/use-cart";
import nodemailer from "nodemailer";
import { Product } from "@/types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

type pcOrderCreateWithoutOrdersInput = {
  motorderItemId: string;
  proorderItemId: string;
  gpuorderItemId: string;
  ramorderItemId: string[];
  disorderItemId: string;
  poworderItemId: string;
  casorderItemId: string;
  scrorderItemId: string;
  cooorderItemId: string;
  Title?: string;
  price?: string;
  reduction?: number | string;
};

// helpers
const isValidEmail = (value?: string) =>
  !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function genratehtml(prod: Product[]) {
  let res = "";

  prod.forEach((e) => {
    res += `
      <tr>
        <td style="border:1px solid #ddd; padding:8px">${e.name}</td>
        <td style="border:1px solid #ddd; padding:8px">${e.price} TND</td>
      </tr>
    `;
  });

  return res;
}

// ADMIN EMAIL TEMPLATE
const adminTemplate = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding:20px">

<h2>Nouvelle Commande</h2>

<p><strong>Nom:</strong> $name</p>
<p><strong>Email:</strong> $email</p>
<p><strong>Téléphone:</strong> $phone</p>
<p><strong>Adresse:</strong> $address</p>

<hr>

<h3>Détails de la commande</h3>

<table style="width:100%; border-collapse: collapse;">
<thead>
<tr>
<th style="border:1px solid #ddd; padding:8px">Produit</th>
<th style="border:1px solid #ddd; padding:8px">Prix</th>
</tr>
</thead>

<tbody>
$prodssss
</tbody>

</table>

<h3>Total: $TotaLPriceTND</h3>

</body>
</html>
`;

// CLIENT EMAIL TEMPLATE
const clientTemplate = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding:20px">

<h2>Commande Confirmée ✅</h2>

<p>Bonjour $name,</p>

<p>Votre commande a été confirmée avec succès.</p>

<p>Voici les détails :</p>

<table style="width:100%; border-collapse: collapse;">
<thead>
<tr>
<th style="border:1px solid #ddd; padding:8px">Produit</th>
<th style="border:1px solid #ddd; padding:8px">Prix</th>
</tr>
</thead>

<tbody>
$prodssss
</tbody>

</table>

<h3>Total: $TotaLPriceTND</h3>

<hr>

<p>Notre équipe vous contactera bientôt.</p>

<p>GamingGear Team</p>

</body>
</html>
`;

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const {
      articlesPanier,
      pcOrder,
      codePostal,
      nom,
      email,
      telephone,
      prenom,
      address,
      totalPrice,
      data,
    } = await req.json();

    const productIdss = articlesPanier as Product[];
    const productIds = productIdss.map((e) => e.id);
    const pc = pcOrder as PCCustom[];
    const dataa: any[] = data;

    const packs: PackCustom[] = dataa.filter((pack) =>
      Object.prototype.hasOwnProperty.call(pack, "packId")
    );

    const products = await prismadb.product.findMany({
      where: { id: { in: productIds } },
      include: { images: true },
    });

    const orderItems = productIds.map((productId: string) => ({
      product: { connect: { id: productId } },
    }));

    const pcOrderItems: pcOrderCreateWithoutOrdersInput[] = pc.map((p) => ({
      Title: p.Title,
      reduction: p.reduction,
      motorderItemId: p.motherboard.id,
      proorderItemId: p.processor.id,
      gpuorderItemId: p.gpu?.id || "",
      ramorderItemId: p.ram.filter((e) => e != null).map((e) => e.id),
      disorderItemId: p.disk.id,
      poworderItemId: p.power.id,
      casorderItemId: p.case.id,
      scrorderItemId: p.screen?.id || "",
      cooorderItemId: p.cooling?.id || "",
      price: p.price.toString(),
    }));

    const safeEmail =
      typeof email === "string" && email.trim().length > 0
        ? email.trim()
        : "";

    const order = await prismadb.order.create({
      data: {
        isPaid: false,
        phone: telephone || "",
        address: `${address || ""}, ${codePostal || ""}`,
        name: nom || "",
        lastName: prenom || "",
        email: safeEmail,
        orderItems: { create: orderItems },
        orderPc: { create: pcOrderItems },
      },
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.email.eu-marseille-1.oci.oraclecloud.com",
      port: 587,
      secure: false,
      auth: {
        user: "YOUR_SMTP_USER",
        pass: "YOUR_SMTP_PASS",
      },
    });

    const prodshtml = genratehtml(products as unknown as Product[]);

    // ADMIN EMAIL
    let adminEmail = adminTemplate;
    adminEmail = adminEmail.replace("$prodssss", prodshtml);
    adminEmail = adminEmail.replace("$TotaLPriceTND", `${totalPrice} TND`);
    adminEmail = adminEmail.replace("$address", address ?? "");
    adminEmail = adminEmail.replace("$name", nom ?? "");
    adminEmail = adminEmail.replace("$email", safeEmail ?? "");
    adminEmail = adminEmail.replace("$phone", telephone ?? "");

    // CLIENT EMAIL
    let clientEmail = clientTemplate;
    clientEmail = clientEmail.replace("$prodssss", prodshtml);
    clientEmail = clientEmail.replace("$TotaLPriceTND", `${totalPrice} TND`);
    clientEmail = clientEmail.replace("$name", nom ?? "");

    if (isValidEmail(safeEmail)) {
      await transporter.sendMail({
        from: "support@gaminggear.tn",
        to: safeEmail,
        subject: "Votre commande GamingGear est confirmée",
        html: clientEmail,
      });
    }

    await transporter.sendMail({
      from: "support@gaminggear.tn",
      to: "GamingGear.tn@gmail.com",
      subject: "Nouvelle commande GamingGear",
      html: adminEmail,
    });

    return NextResponse.json({ order }, { headers: corsHeaders });
  } catch (error) {
    console.error("Failed to create order:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}