import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { PCCustom, PackCustom } from "@/hooks/use-cart";
import { pcOrder } from "@prisma/client";
import nodemailer from 'nodemailer';
import { Product } from "@/types";
import { v4 as uuidv4 } from 'uuid';
const path = require('path');
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
const fs = require('fs');
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
type pcOrderCreateWithoutOrdersInput = {
  motorderItemId:  String,
  proorderItemId:  String,
  gpuorderItemId:  String,
  ramorderItemId:  String,
  disorderItemId:  String,
  poworderItemId:  String,
  casorderItemId:  String,
  scrorderItemId:  String,
  cooorderItemId:  String,

};
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
      rue,
      ville,
      totalPrice,
      data 
    } = await req.json(); 


    const productIdss = articlesPanier as Product[];
    const productIds=productIdss.map((e)=>e.id)
    const pc = pcOrder as PCCustom[];
    const dataa:any[]=data
    const packs: PackCustom[] = dataa.filter((pack) => pack.hasOwnProperty('packId'));

  

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include:{
        images:true
      }
    });

    const orderItems = productIds.map((productId: string) => ({
      product: {
        connect: {
          id: productId,
        },
      },
    }));
    const pcOrderItems= pc.map((productId) => ({
        Title:productId.Title,
        reduction:productId.reduction,
        motorderItemId: productId.motherboard.id,
        proorderItemId: productId.processor.id,
        gpuorderItemId: productId.gpu.id,
        ramorderItemId: productId.ram.filter((e)=>e!=null).map((e)=>e.id), // Assuming ram is an array, adjust as needed
        disorderItemId: productId.disk.id,
        poworderItemId: productId.power.id,
        casorderItemId: productId.case.id,
        scrorderItemId: productId.screen?.id || '', // Assuming screen is optional
        cooorderItemId: productId.cooling?.id || '', // Assuming cooling is optional
        price: productId.price.toString(),

      }));


   
      console.log({
        data: {
       
          isPaid: false,
          phone: telephone || "",
          address: `${rue || ""}, ${ville || ""}, ${codePostal || ""}`,
          name: nom || "",
          lastName: prenom || "",
          email: email || "",
          orderItems: {
            create: [...orderItems],
          },
          orderPc: {
            create: pcOrderItems,
          },
        },
      })
      const order = await prismadb.order.create({
        data: {
          isPaid: false,
          phone: telephone || "",
          address: `${rue || ""}, ${ville || ""}, ${codePostal || ""}`,
          name: nom || "",
          lastName: prenom || "",
          email: email || "",
          orderItems: {
            create: orderItems,
          },
          orderPc: {
            create: pcOrderItems,
          },
          PackOrders: {  // Creating PackOrders along with the order
            create: packs.map(pack => ({
              Title: pack.Title.toString(),
              price:parseInt(pack.price.toString()) ,
              reduction:parseInt(pack.reduction.toString()) ,
              packId: pack.packId.toString(),
              packTitle: pack.packTitle.toString(),
              packImage: pack.packImage.toString(),
              Clavier: {
                connect: pack.defaultKeyboard ? [{ id: pack.defaultKeyboard.id }] : []
              },
              Mouse: {
                connect: pack.defaultMouse ? [{ id: pack.defaultMouse.id }] : []
              },
              MousePad: {
                connect: pack.defaultMousePad ? [{ id: pack.defaultMousePad.id }] : []
              },
              Mic: {
                connect: pack.defaultMics ? [{ id: pack.defaultMics.id }] : []
              },
              Headset: {
                connect: pack.defaultHeadset ? [{ id: pack.defaultHeadset.id }] : []
              },
              Camera: {
                connect: pack.defaultCamera ? [{ id: pack.defaultCamera.id }] : []
              },
              Screen: {
                connect: pack.defaultScreen ? [{ id: pack.defaultScreen.id }] : []
              },
              Speaker: {
                connect: pack.DefaultSpeaker ? [{ id: pack.DefaultSpeaker.id }] : []
              },
              Manette: {
                connect: pack.DefaultManette ? [{ id: pack.DefaultManette.id }] : []
              },
              Chair: {
                connect: pack.DefaultChair ? [{ id: pack.DefaultChair.id }] : []
              },
            }))
          }
        },
      });

      console.log(order)
     // Create a Nodemailer transporter using SMTP configuration from Oracle Cloud Email Delivery
     const transporter = nodemailer.createTransport({
      host: 'smtp.email.eu-marseille-1.oci.oraclecloud.com', // Example SMTP server address
      port: 587, // Example port (could be different based on Oracle Cloud Email Delivery)
      secure: false, // Set to true if using TLS/SSL
      auth: {
        user: 'ocid1.user.oc1..aaaaaaaa7uwytzp4lbhb65r57yyi2p6znjl3rb73vzidzmged7bm7sjsc2gq@ocid1.tenancy.oc1..aaaaaaaacwunturhlf2zdumldp6fycblqedl4uky3gxexc4cxwjosjfua63q.lj.com', // Your Oracle Cloud Email Delivery sender email
        pass: 'IvLq0Fg6(R7}P5}VNh_u', // Your Oracle Cloud Email Delivery sender email password or API key
      },
    });

    let htmlContent =  htmldd
    const prodshtml = genratehtml(productIdss);
    
    htmlContent = htmlContent.replace("$prodssss", prodshtml);
    htmlContent = htmlContent.replace("$itemNumber", productIdss.length.toString());
    htmlContent = htmlContent.replace("$TotaLPrice", totalPrice);
    htmlContent = htmlContent.replace("$ville", ville);
    htmlContent = htmlContent.replace("$rue", rue);
    htmlContent = htmlContent.replace("$codePostal", codePostal);
    const emailBody =htmlContent

      // Email options
      const mailOptions = {
        from: 'support@gaminggear.tn',
        to: email,
        subject: "Votre commande est complète!",
        html: emailBody, // Use HTML for a more structured email body
      };
    // Send the email
    const info = await transporter.sendMail(mailOptions);
 const mailOptions2 = {
        from: 'support@gaminggear.tn',
        to: 'GamingGear.tn@gmail.com',
        subject: "Vous avez une nouvelle Commande!",
        html: emailBody, // Use HTML for a more structured email body
      };
    // Send the email
    const info3 = await transporter.sendMail(mailOptions2);
    console.log('Email sent:', info.response);
    return NextResponse.json({ order }, { headers: corsHeaders });
  } catch (error) {
    console.error("Failed to create order:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Helper function to get an array of productIds from PCCustom
const getProductIds = (pcCustom: PCCustom): string[] => {
  const productIds: string[] = [];
  productIds.push(pcCustom.motherboard.id);
  productIds.push(pcCustom.processor.id);
  productIds.push(pcCustom.gpu.id);
  pcCustom.ram.forEach((ramModule) => productIds.push(ramModule.id));
  productIds.push(pcCustom.disk.id);
  productIds.push(pcCustom.power.id);
  productIds.push(pcCustom.case.id);
  if (pcCustom.screen) productIds.push(pcCustom.screen.id);
  if (pcCustom.cooling) productIds.push(pcCustom.cooling.id);
  return productIds;
};
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Fetch orders
    const orders = await prismadb.order.findMany();

    // Extract order IDs
    const orderIds = orders.map((order) => order.id);

    // Delete related OrderItems
    await prismadb.orderItem.deleteMany({
      where: {
        orderId: {
          in: orderIds,
        },
      },
    });

    // Delete orders
    await prismadb.order.deleteMany({
      where: {
        id: {
          in: orderIds,
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to delete orders:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

function generateHashId() {
  const timestamp = new Date().getTime().toString(16); // Convert timestamp to hexadecimal
  const random = Math.random().toString(16).substring(2); // Generate random hexadecimal string

  return `${timestamp}-${random}`;
}


function genratehtml(prod:Product[]){

let res= ''

prod.map((e)=>{
  console.log(e.images[0])
  res=res+`<tr>
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
                                          <a target="_blank"
                                              href="https://viewstripo.email"
                                              style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#926B4A;font-size:14px">
                                              <img
                                                  class="adapt-img p_image"
                                                  src="${e.images[0].url}"
                                                  alt="Sony WH-1000XM4"
                                                  style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                                  width="125"
                                                  title="Sony WH-1000XM4"
                                                  height="125"></a> </td>
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
                                              <strong class="p_name">${e.name}
                                                  </strong></h3>
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
                                          <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px"
                                              class="p_description">x1</p>
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
</tr>`
})
return res
}

const htmldd=`<!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="fr">

<head>
<meta charset="UTF-8">
<meta content="width=device-width, initial-scale=1" name="viewport">
<meta name="x-apple-disable-message-reformatting">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="telephone=no" name="format-detection">
<title>Nouveau modèle</title>
<!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]-->
<!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSettings> <o:AllowPNG></o:AllowPNG> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml>
<![endif]-->
<style type="text/css">
    #outlook a {
        padding: 0;
    }

    .es-button {
        mso-style-priority: 100 !important;
        text-decoration: none !important;
    }

    a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
    }

    .es-desk-hidden {
        display: none;
        float: left;
        overflow: hidden;
        width: 0;
        max-height: 0;
        line-height: 0;
        mso-hide: all;
    }

    @media only screen and (max-width:600px) {

        p,
        ul li,
        ol li,
        a {
            line-height: 150% !important
        }

        h1,
        h2,
        h3,
        h1 a,
        h2 a,
        h3 a {
            line-height: 120%
        }

        h1 {
            font-size: 30px !important;
            text-align: center
        }

        h2 {
            font-size: 26px !important;
            text-align: center
        }

        h3 {
            font-size: 20px !important;
            text-align: center
        }

        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
            font-size: 30px !important
        }

        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
            font-size: 26px !important
        }

        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
            font-size: 20px !important
        }

        .es-menu td a {
            font-size: 12px !important
        }

        .es-header-body p,
        .es-header-body ul li,
        .es-header-body ol li,
        .es-header-body a {
            font-size: 14px !important
        }

        .es-content-body p,
        .es-content-body ul li,
        .es-content-body ol li,
        .es-content-body a {
            font-size: 14px !important
        }

        .es-footer-body p,
        .es-footer-body ul li,
        .es-footer-body ol li,
        .es-footer-body a {
            font-size: 14px !important
        }

        .es-infoblock p,
        .es-infoblock ul li,
        .es-infoblock ol li,
        .es-infoblock a {
            font-size: 12px !important
        }

        *[class="gmail-fix"] {
            display: none !important
        }

        .es-m-txt-c,
        .es-m-txt-c h1,
        .es-m-txt-c h2,
        .es-m-txt-c h3 {
            text-align: center !important
        }

        .es-m-txt-r,
        .es-m-txt-r h1,
        .es-m-txt-r h2,
        .es-m-txt-r h3 {
            text-align: right !important
        }

        .es-m-txt-l,
        .es-m-txt-l h1,
        .es-m-txt-l h2,
        .es-m-txt-l h3 {
            text-align: left !important
        }

        .es-m-txt-r img,
        .es-m-txt-c img,
        .es-m-txt-l img {
            display: inline !important
        }

        .es-button-border {
            display: block !important
        }

        a.es-button,
        button.es-button {
            font-size: 20px !important;
            display: block !important;
            border-left-width: 0px !important;
            border-right-width: 0px !important
        }

        .es-adaptive table,
        .es-left,
        .es-right {
            width: 100% !important
        }

        .es-content table,
        .es-header table,
        .es-footer table,
        .es-content,
        .es-footer,
        .es-header {
            width: 100% !important;
            max-width: 600px !important
        }

        .es-adapt-td {
            display: block !important;
            width: 100% !important
        }

        .adapt-img {
            width: 100% !important;
            height: auto !important
        }

        .es-m-p0 {
            padding: 0 !important
        }

        .es-m-p0r {
            padding-right: 0 !important
        }

        .es-m-p0l {
            padding-left: 0 !important
        }

        .es-m-p0t {
            padding-top: 0 !important
        }

        .es-m-p0b {
            padding-bottom: 0 !important
        }

        .es-m-p20b {
            padding-bottom: 20px !important
        }

        .es-mobile-hidden,
        .es-hidden {
            display: none !important
        }

        tr.es-desk-hidden,
        td.es-desk-hidden,
        table.es-desk-hidden {
            width: auto !important;
            overflow: visible !important;
            float: none !important;
            max-height: inherit !important;
            line-height: inherit !important
        }

        tr.es-desk-hidden {
            display: table-row !important
        }

        table.es-desk-hidden {
            display: table !important
        }

        td.es-desk-menu-hidden {
            display: table-cell !important
        }

        .es-menu td {
            width: 1% !important
        }

        table.es-table-not-adapt,
        .esd-block-html table {
            width: auto !important
        }

        table.es-social {
            display: inline-block !important
        }

        table.es-social td {
            display: inline-block !important
        }

        .es-m-p5 {
            padding: 5px !important
        }

        .es-m-p5t {
            padding-top: 5px !important
        }

        .es-m-p5b {
            padding-bottom: 5px !important
        }

        .es-m-p5r {
            padding-right: 5px !important
        }

        .es-m-p5l {
            padding-left: 5px !important
        }

        .es-m-p10 {
            padding: 10px !important
        }

        .es-m-p10t {
            padding-top: 10px !important
        }

        .es-m-p10b {
            padding-bottom: 10px !important
        }

        .es-m-p10r {
            padding-right: 10px !important
        }

        .es-m-p10l {
            padding-left: 10px !important
        }

        .es-m-p15 {
            padding: 15px !important
        }

        .es-m-p15t {
            padding-top: 15px !important
        }

        .es-m-p15b {
            padding-bottom: 15px !important
        }

        .es-m-p15r {
            padding-right: 15px !important
        }

        .es-m-p15l {
            padding-left: 15px !important
        }

        .es-m-p20 {
            padding: 20px !important
        }

        .es-m-p20t {
            padding-top: 20px !important
        }

        .es-m-p20r {
            padding-right: 20px !important
        }

        .es-m-p20l {
            padding-left: 20px !important
        }

        .es-m-p25 {
            padding: 25px !important
        }

        .es-m-p25t {
            padding-top: 25px !important
        }

        .es-m-p25b {
            padding-bottom: 25px !important
        }

        .es-m-p25r {
            padding-right: 25px !important
        }

        .es-m-p25l {
            padding-left: 25px !important
        }

        .es-m-p30 {
            padding: 30px !important
        }

        .es-m-p30t {
            padding-top: 30px !important
        }

        .es-m-p30b {
            padding-bottom: 30px !important
        }

        .es-m-p30r {
            padding-right: 30px !important
        }

        .es-m-p30l {
            padding-left: 30px !important
        }

        .es-m-p35 {
            padding: 35px !important
        }

        .es-m-p35t {
            padding-top: 35px !important
        }

        .es-m-p35b {
            padding-bottom: 35px !important
        }

        .es-m-p35r {
            padding-right: 35px !important
        }

        .es-m-p35l {
            padding-left: 35px !important
        }

        .es-m-p40 {
            padding: 40px !important
        }

        .es-m-p40t {
            padding-top: 40px !important
        }

        .es-m-p40b {
            padding-bottom: 40px !important
        }

        .es-m-p40r {
            padding-right: 40px !important
        }

        .es-m-p40l {
            padding-left: 40px !important
        }

        .es-desk-hidden {
            display: table-row !important;
            width: auto !important;
            overflow: visible !important;
            max-height: inherit !important
        }
    }

    @media screen and (max-width:384px) {
        .mail-message-content {
            width: 414px !important
        }
    }
</style>
</head>

<body
style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
<div dir="ltr" class="es-wrapper-color" lang="fr" style="background-color:#FFFFFF">
    <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#ffffff"></v:fill> </v:background><![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none"
        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
        <tr>
            <td valign="top" style="padding:0;Margin:0">
                <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
                    <tr>
                        <td align="center" style="padding:0;Margin:0">
                            <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0"
                                cellspacing="0" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                    <td class="esdev-adapt-off" align="left" style="padding:20px;Margin:0">
                                        <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                                            <tr>
                                                <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                                                    <table cellpadding="0" cellspacing="0" class="es-left"
                                                        align="left" role="none"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                                        <tr>
                                                            <td class="es-m-p0r" valign="top" align="center"
                                                                style="padding:0;Margin:0;width:415px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="left"
                                                                            style="padding:0;Margin:0;font-size:0px">
                                                                            <a target="_blank"
                                                                                href="https://viewstripo.email"
                                                                                style="color: black; font-size: larger;font-weight:700;text-decoration:none;size: 30px;display:flex;justify-items:center;align-items:center;font-size:25px"><img
                                                                                    src="https://gaminggear.tn/_next/image?url=%2Fimages%2Flogo%20(3).png&w=96&q=75"
                                                                                    alt="Logo"
                                                                                    style="border-radius: 100%;border-width: 1px;border-color: #a0937d;padding: 7px; background: rgba(0, 0, 0, 0.856); display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"
                                                                                    width="50" title="Logo"
                                                                                    height="50"><div style="margin-left: 5px;">Gaming Gear TN</div></a> </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="padding:0;Margin:0;width:20px"></td>
                                                <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                                                    
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left"
                                        style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center" valign="top"
                                                    style="padding:0;Margin:0;width:560px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        role="presentation"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="center" style="padding:0;Margin:0">
                                                                <h1
                                                                    style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#333333">
                                                                    Votre commande est sur son chemin!</h1>
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
                    </tr>
                </table>
                <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                    <tr>
                        <td align="center" style="padding:0;Margin:0">
                            <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0"
                                cellspacing="0" role="none"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                               
                                
                                <tr>
                                    <td align="left"
                                        style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center" valign="top"
                                                    style="padding:0;Margin:0;width:560px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        role="presentation"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="center" style="padding:0;Margin:0">
                                                                <h2
                                                                    style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:24px;font-style:normal;font-weight:bold;color:#333333">
                                                                    ORDER # 45326789</h2>
                                                                <p
                                                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">
                                                                    24/05/2021</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" class="es-m-txt-c"
                                                                style="padding:0;Margin:0;padding-top:20px">
                                                                <p
                                                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#a0937d;font-size:14px">
                                                                    ITEMS ORDERED</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center"
                                                                style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                                                <table border="0" width="100%" height="100%"
                                                                    cellpadding="0" cellspacing="0"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td
                                                                            style="padding:0;Margin:0;border-bottom:1px solid #a0937d;background:none;height:1px;width:100%;margin:0px">
                                                                      
                                                                        
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
                                </tr>
                           
                           $prodssss
                                <tr>
                                    <td align="left"
                                        style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center" valign="top"
                                                    style="padding:0;Margin:0;width:560px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        role="presentation"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="center"
                                                                style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                                                <table border="0" width="100%" height="100%"
                                                                    cellpadding="0" cellspacing="0"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td
                                                                            style="padding:0;Margin:0;border-bottom:1px solid #a0937d;background:none;height:1px;width:100%;margin:0px">
                                                                       
                                                                        
                                                                       
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
                                </tr>
                            
                                <tr>
                                    <td class="esdev-adapt-off" align="left"
                                        style="padding:0;Margin:0;padding-left:20px;padding-right:20px">
                                        <table cellpadding="0" cellspacing="0" class="esdev-mso-table" role="none"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:560px">
                                            <tr>
                                                <td class="esdev-mso-td" valign="top" style="padding:0;Margin:0">
                                                    <table cellpadding="0" cellspacing="0" class="es-left"
                                                        align="left" role="none"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left">
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0;width:466px">
                                                                <table cellpadding="0" cellspacing="0" width="100%"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td align="right"
                                                                            style="padding:0;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">
                                                                              <b>Total
                                                                                    ($itemNumber&nbsp;item)</b></p>
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
                                                                        <td align="right"
                                                                            style="padding:0;Margin:0">
                                                                            <p
                                                                                style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">
                                                                               <strong>$TotaLPriceTND</strong>
                                                                            </p>
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
                                </tr>
                          
                                <tr>
                                    <td align="left"
                                        style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center" valign="top"
                                                    style="padding:0;Margin:0;width:560px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        role="presentation"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="left" class="es-m-txt-c"
                                                                style="padding:0;Margin:0;padding-top:20px">
                                                                <p
                                                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#a0937d;font-size:14px">
                                                                     ADDRESS DE LIVRAISON</p>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="center"
                                                                style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;font-size:0">
                                                                <table border="0" width="100%" height="100%"
                                                                    cellpadding="0" cellspacing="0"
                                                                    role="presentation"
                                                                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                    <tr>
                                                                        <td
                                                                            style="padding:0;Margin:0;border-bottom:1px solid #a0937d;background:none;height:1px;width:100%;margin:0px">
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="left" style="padding:0;Margin:0">
                                                                <p
                                                                    style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#666666;font-size:14px">
                                                                    <span>$ville</span><br>$rue
                                                                    <br>$codePostal<br>
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding:20px;Margin:0">
                                        <table cellpadding="0" cellspacing="0" width="100%" role="none"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                            <tr>
                                                <td align="center" valign="top"
                                                    style="padding:0;Margin:0;width:560px">
                                                    <table cellpadding="0" cellspacing="0" width="100%"
                                                        role="presentation"
                                                        style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                        <tr>
                                                            <td align="center" style="padding:0;Margin:0"><span
                                                                    class="es-button-border"
                                                                    style="border-style:solid;border-color:#2CB543;background:#666666;border-width:0px;display:inline-block;border-radius:30px;width:auto"><a
                                                                        href="https://viewstripo.email"
                                                                        class="es-button" target="_blank"
                                                                        style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:18px;padding:10px 20px 10px 20px;display:inline-block;background:#666666;border-radius:30px;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;mso-padding-alt:0;mso-border-alt:10px solid #666666">Track
                                                                        Your Order</a> </span></td>
                                                        </tr>
                                                    </table>
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
        </tr>
    </table>
</div>
</body>

</html>` 