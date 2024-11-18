import nodemailer from 'nodemailer';

interface EmailRequestBody {
    email: string;
    name: string;
    orderDetails: string;
}

export default async function handler(req: any, res: any) {
    // Überprüfe die HTTP-Methode
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, name, orderDetails } = req.body as EmailRequestBody;

    // Überprüfe, ob alle erforderlichen Felder vorhanden sind
    if (!email || !name || !orderDetails) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Transporter konfigurieren (SMTP)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // SMTP-Host aus .env
            port: Number(process.env.SMTP_PORT), // SMTP-Port aus .env
            secure: process.env.SMTP_SECURE === 'true', // Boolean: TLS verwenden
            auth: {
                user: process.env.SMTP_USER, // Benutzername
                pass: process.env.SMTP_PASS, // Passwort
            },
        });

        // E-Mail senden
        await transporter.sendMail({
            from: `"Shop Name" <${process.env.SMTP_FROM}>`, // Absender
            to: email, // Empfänger
            subject: 'Bestellbestätigung', // Betreff
            html: `
                <h1>Vielen Dank für Ihre Bestellung, ${name}!</h1>
                <p>Hier sind die Details Ihrer Bestellung:</p>
                <pre>${orderDetails}</pre>
                <p>Wir danken Ihnen für Ihr Vertrauen.</p>
            `,
        });

        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error: error.message });
    }
}
