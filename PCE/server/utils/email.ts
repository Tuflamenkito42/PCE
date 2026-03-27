import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const config = useRuntimeConfig();
    const smtpHost = String(config.smtpHost || '').trim();
    const smtpUser = String(config.smtpUser || '').trim();
    // Gmail app passwords are sometimes pasted with spaces; normalize before auth.
    const smtpPass = String(config.smtpPass || '').replace(/\s+/g, '').trim();
    const smtpPort = Number(config.smtpPort);

    // Check if critical configuration exists
    if (!smtpHost || !smtpUser || !smtpPass) {
        console.warn('SMTP configuration missing. Email not sent.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
            user: smtpUser,
            pass: smtpPass, // App Password if using Gmail
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"${config.smtpFrom}" <${smtpUser}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // We log but allow the flow to continue
    }
};
