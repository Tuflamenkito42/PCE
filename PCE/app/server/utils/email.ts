import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
    const config = useRuntimeConfig();

    // Check if critical configuration exists
    if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
        console.warn('SMTP configuration missing. Email not sent.');
        return;
    }

    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: Number(config.smtpPort),
        secure: Number(config.smtpPort) === 465, // true for 465, false for other ports
        auth: {
            user: config.smtpUser,
            pass: config.smtpPass, // App Password if using Gmail
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"${config.smtpFrom}" <${config.smtpUser}>`,
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
