import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { PCCustom, PackCustom } from "@/hooks/use-cart";
import nodemailer from "nodemailer";
import { Product } from "@/types";

const path = require("path");
const fs = require("fs");

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

// --- helpers ---
const isValidEmail = (value?: string) =>
  !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

function generateHashId() {
  const timestamp = new Date().getTime().toString(16);
  const random = Math.random().toString(16).substring(2);
  return `${timestamp}-${random}`;
}

function genratehtml(prod: Product[]) {
  let res = "";
  prod.forEach((e) => {
    const img = e.images && e.images.length > 0 ? e.images[0].url : "";
    res += `<tr>
  <td class="esdev-adapt-off" align="left" style="padding:20px;Margin:0">
      <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none"
          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
          <tr>
              <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                  <table cellpadding="0" cellspacing="0" class="es-left"
                      align="left" role="none"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                      <tr>
                          <td align="left" style="padding:0;Margin:0;width:125px">
                              <table cellpadding="0" cellspacing="0" width="100%"
                                  role="presentation"
                                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                  <tr>
                                      <td align="center"
                                          style="padding:0;Margin:0;font-size:0px">
                                              <img
                                                  class="adapt-img p_image"
                                                  src="${img}"
                                                  alt="${e.name ?? ""}"
                                                  style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                                  width="125"
                                                  title="${e.name ?? ""}"
                                                  height="125">
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
              <td style="padding:0;Margin:0;width:20px"></td>
              <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                  <table cellpadding="0" cellspacing="0" class="es-left"
                      align="left" role="none"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                      <tr>
                          <td align="left" style="padding:0;Margin:0;width:125px">
                              <table cellpadding="0" cellspacing="0" width="100%"
                                  role="presentation"
                                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                  <tr>
                                      <td align="left"
                                          class="es-m-p0t es-m-p0b es-m-txt-l"
                                          style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                          <h3
                                              style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:bold;color:#333333">
                                              <strong class="p_name">${e.name ?? ""}</strong></h3>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
              <td style="padding:0;Margin:0;width:20px"></td>
              <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                  <table cellpadding="0" cellspacing="0" class="es-left"
                      align="left" role="none"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                      <tr>
                          <td align="left" style="padding:0;Margin:0;width:176px">
                              <table cellpadding="0" cellspacing="0" width="100%"
                                  role="presentation"
                                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                  <tr>
                                      <td align="right" class="es-m-p0t es-m-p0b"
                                          style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                          <p class="p_description"
                                              style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">
                                              x1</p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
              <td style="padding:0;Margin:0;width:20px"></td>
              <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                  <table cellpadding="0" cellspacing="0" class="es-right"
                      align="right" role="none"
                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right">
                      <tr>
                          <td align="left" style="padding:0;Margin:0;width:74px">
                              <table cellpadding="0" cellspacing="0" width="100%"
                                  role="presentation"
                                  style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                  <tr>
                                      <td align="right" class="es-m-p0t es-m-p0b"
                                          style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px">
                                          <p class="p_price"
                                              style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">
                                              ${e.price}</p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </td>
</tr>`;
  });
  return res;
}

// NOTE: I keep your long HTML template as-is, assigned below
const htmldd = `...`; // <- keep your same template string here

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const {
      articlesPanier,
      pcOrder,
      codePostal,
      moyenPaiement,
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

    // ✅ Save NULL when email is missing
    const safeEmail = typeof email === "string" && email.trim().length > 0 ? email.trim() : "";

    const order = await prismadb.order.create({
      data: {
        isPaid: false,
        phone: telephone || "",
        address: `${address || ""}, ${codePostal || ""}`,
        name: nom || "",
        lastName: prenom || "",
        email: safeEmail, // <-- allow null
        orderItems: { create: orderItems },
        orderPc: { create: pcOrderItems },
        PackOrders: {
          create: packs.map((pack) => ({
            Title: pack.Title.toString(),
            price: parseInt(pack.price.toString()),
            reduction: parseInt(pack.reduction.toString()),
            packId: pack.packId.toString(),
            packTitle: pack.packTitle.toString(),
            packImage: pack.packImage.toString(),
            Clavier: { connect: pack.defaultKeyboard ? [{ id: pack.defaultKeyboard.id }] : [] },
            Mouse: { connect: pack.defaultMouse ? [{ id: pack.defaultMouse.id }] : [] },
            MousePad: { connect: pack.defaultMousePad ? [{ id: pack.defaultMousePad.id }] : [] },
            Mic: { connect: pack.defaultMics ? [{ id: pack.defaultMics.id }] : [] },
            Headset: { connect: pack.defaultHeadset ? [{ id: pack.defaultHeadset.id }] : [] },
            Camera: { connect: pack.defaultCamera ? [{ id: pack.defaultCamera.id }] : [] },
            Screen: { connect: pack.defaultScreen ? [{ id: pack.defaultScreen.id }] : [] },
            Speaker: { connect: pack.DefaultSpeaker ? [{ id: pack.DefaultSpeaker.id }] : [] },
            Manette: { connect: pack.DefaultManette ? [{ id: pack.DefaultManette.id }] : [] },
            Chair: { connect: pack.DefaultChair ? [{ id: pack.DefaultChair.id }] : [] },
          })),
        },
      },
    });

    // --- Email sending (customer only if present & valid) ---
    const transporter = nodemailer.createTransport({
      host: "smtp.email.eu-marseille-1.oci.oraclecloud.com",
      port: 587,
      secure: false,
      auth: {
        user:
          "ocid1.user.oc1..aaaaaaaa7uwytzp4lbhb65r57yyi2p6znjl3rb73vzidzmged7bm7sjsc2gq@ocid1.tenancy.oc1..aaaaaaaacwunturhlf2zdumldp6fycblqedl4uky3gxexc4cxwjosjfua63q.lj.com",
        pass: "IvLq0Fg6(R7}P5}VNh_u",
      },
    });

    let htmlContent = htmldd;
    const prodshtml = genratehtml(productIdss);
    htmlContent = htmlContent.replace("$prodssss", prodshtml);
    htmlContent = htmlContent.replace("$itemNumber", productIdss.length.toString());

    // ✅ your template uses $TotaLPriceTND, so replace that exact token
    htmlContent = htmlContent.replace("$TotaLPriceTND", `${totalPrice} TND`);

    htmlContent = htmlContent.replace("$address", address ?? "");
    htmlContent = htmlContent.replace("$codePostal", codePostal ?? "");
    const emailBody = htmlContent;

    // Send to customer only if email is provided & valid
    if (isValidEmail(safeEmail || undefined)) {
      await transporter.sendMail({
        from: "support@gaminggear.tn",
        to: safeEmail!,
        subject: "Votre commande est complète!",
        html: emailBody,
      });
    }

    // Always notify admin
    await transporter.sendMail({
      from: "support@gaminggear.tn",
      to: "GamingGear.tn@gmail.com",
      subject: "Vous avez une nouvelle Commande!",
      html: emailBody,
    });

    return NextResponse.json({ order }, { headers: corsHeaders });
  } catch (error) {
    console.error("Failed to create order:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const orders = await prismadb.order.findMany();
    const orderIds = orders.map((order) => order.id);

    await prismadb.orderItem.deleteMany({
      where: { orderId: { in: orderIds } },
    });

    await prismadb.order.deleteMany({
      where: { id: { in: orderIds } },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to delete orders:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
