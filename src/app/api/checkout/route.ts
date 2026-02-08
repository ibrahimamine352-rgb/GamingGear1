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

// ---------------- helpers ----------------

const isValidEmail = (value?: string) =>
  !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function genratehtml(prod: Product[]) {
  let res = "";
  prod.forEach((e) => {
    const img = e.images?.[0]?.url ?? "";
    res += `<tr><td>${e.name} - ${e.price}</td></tr>`;
  });
  return res;
}

// keep your original template
const htmldd = `...`;

type pcOrderCreateWithoutOrdersInput = {
  motorderItemId: string;
  proorderItemId: string;
  gpuorderItemId?: string;
  ramorderItemId: string[];
  disorderItemId: string;
  poworderItemId: string;
  casorderItemId: string;
  scrorderItemId?: string;
  cooorderItemId?: string;
  Title?: string;
  price?: string;
  reduction?: number | string;
};

// ---------------- POST ----------------

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
    } = body;

    const safeEmail =
      typeof email === "string" && email.trim().length > 0
        ? email.trim()
        : "no-reply@gaminggear.tn";

    const productIds = articlesPanier.map((p: Product) => p.id);

    const orderItems = productIds.map((id: string) => ({
      product: { connect: { id } },
    }));

    const pcOrderItems = pcOrder.map((p: PCCustom) => ({
      Title: p.Title,
      reduction: p.reduction,
      motorderItemId: p.motherboard.id,
      proorderItemId: p.processor.id,
      ramorderItemId: p.ram.filter(Boolean).map(r => r!.id),
      disorderItemId: p.disk.id,
      poworderItemId: p.power.id,
      casorderItemId: p.case.id,
      price: p.price.toString(),
      ...(p.gpu && { gpuorderItemId: p.gpu.id }),
      ...(p.screen && { scrorderItemId: p.screen.id }),
      ...(p.cooling && { cooorderItemId: p.cooling.id }),
    }));

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

    // 🔐 EMAILS ARE SIDE EFFECTS
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      });

      await transporter.sendMail({
        from: '"GamingGear TN" <gaminggeartn.orders@gmail.com>',     
        to: "gaminggear.tn@gmail.com",
        subject: "Nouvelle commande",
        html: `<p>Nouvelle commande: ${order.id}</p>`,
      });
  
      if (isValidEmail(safeEmail)) {
        await transporter.sendMail({
         from: '"GamingGear TN" <gaminggeartn.orders@gmail.com>',
          to: safeEmail,
          subject: "Votre commande est confirmée",
          html: `<p>Merci pour votre commande</p>`,
        });
      }
    } catch (mailError) {
      console.error("Email failed, order OK:", mailError);
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Checkout failed:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
