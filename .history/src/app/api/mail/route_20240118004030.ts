import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url || '');
    const toEmail = searchParams.get('toEmail') || '';

    const subject = searchParams.get('subject') || '';
    const body = searchParams.get('body') || '';

    // Create a Nodemailer transporter using SMTP configuration from Oracle Cloud Email Delivery
    const transporter = nodemailer.createTransport({
      host: 'smtp.email.us-phoenix-1.oraclecloud.com', // Example SMTP server address
      port: 587, // Example port (could be different based on Oracle Cloud Email Delivery)
      secure: false, // Set to true if using TLS/SSL
      auth: {
        user: 'your-email@example.com', // Your Oracle Cloud Email Delivery sender email
        pass: 'your-email-password', // Your Oracle Cloud Email Delivery sender email password or API key
      },
    });

    // Email options
    const mailOptions = {
      from: 'your-email@example.com',
      to: toEmail,
      subject: subject,
      text: body,
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
