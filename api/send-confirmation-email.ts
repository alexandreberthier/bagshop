import nodemailer from 'nodemailer';

interface EmailRequestBody {
    email: string;
    name: string;
    orderDetails: string;
}

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, name, orderDetails } = req.body as EmailRequestBody;

    if (!email || !name || !orderDetails) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Wenn nötig
            },
        });

        await transporter.sendMail({
            from: `"Shop Name" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: 'Bestellbestätigung',
            html: `
        <h1>Vielen Dank für Ihre Bestellung, ${name}!</h1>
        <p>Hier sind die Details Ihrer Bestellung:</p>
        <pre>${orderDetails}</pre>
        <p>Vielen Dank für Ihr Vertrauen.</p>
      `,
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error: any) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}
