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
        // Transporter konfigurieren (SMTP für Outlook)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.office365.com', // Standard-Host für Outlook
            port: Number(process.env.SMTP_PORT) || 587, // Standard-Port für TLS
            secure: false, // TLS benötigt `secure` auf `false`
            auth: {
                user: process.env.SMTP_USER, // Benutzername (Outlook E-Mail-Adresse)
                pass: process.env.SMTP_PASS, // Passwort oder App-Passwort
            },
            tls: {
                ciphers: 'SSLv3', // Optional: TLS-Einstellungen für ältere Konfigurationen
            },
        });

        // E-Mail senden
        await transporter.sendMail({
            from: `"Shop Name" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`, // Absender
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
