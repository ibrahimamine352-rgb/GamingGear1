import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url || '');
    const toEmail = searchParams.get('toEmail') || '';

    const subject = searchParams.get('subject') || '';
    const body = searchParams.get('body') || '';

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

    // Email options
    const mailOptions = {
      from: 'support@gaminggear.tn',
      to: "yassinecherni9@gmail.com",
      subject: "subject",
      text: "body",
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('[SEND_EMAIL]', error);
    res.status(500).json({ error: 'Internal error' });
  }
}
