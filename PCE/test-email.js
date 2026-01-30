
import nodemailer from 'nodemailer';

const user = 'pcepartidopolitico@gmail.com';
const pass = 'ffta ahtk bugi vjne'; // Updated to test new credentials

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: user,
        pass: pass,
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function main() {
    try {
        const info = await transporter.sendMail({
            from: `"${user}" <${user}>`,
            to: user, // Send to self
            subject: "🧪 Prueba de Correo PCE (Script Directo)",
            html: "<b>Si lees esto, las credenciales funcionan correctamente.</b>",
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

main();
