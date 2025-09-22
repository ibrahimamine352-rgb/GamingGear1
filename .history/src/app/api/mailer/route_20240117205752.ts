
export default async function handler(req, res) {
    try {
      // Create a Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-email@gmail.com',
          pass: 'your-email-password',
        },
      });
  
      // Email options
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'recipient-email@example.com',
        subject: 'Subject of the Email',
        text: 'Body of the Email',
      };
  
      // Send the email
      const info = await transporter.sendMail(mailOptions);
  
      console.log('Email sent: ' + info.response);
      res.status(200).json({ success: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  }