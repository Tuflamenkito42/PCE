const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient();
    const email = 'admin@pce-web.com';
    const newPassword = 'admin123';

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: {
                email,
                password: hashedPassword,
                role: 'admin',
                fullName: 'Administrador'
            }
        });
        console.log(`User created/updated successfully: ${email}`);
    } catch (error) {
        console.error('Error during upsert:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
