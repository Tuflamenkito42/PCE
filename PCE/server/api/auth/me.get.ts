import { verifyAuthToken } from '../../utils/auth-token';
import { usePrisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');

    if (!token) {
        return { user: null };
    }

    try {
        const decoded = verifyAuthToken(token);
        const prisma = usePrisma();
        const user = await prisma.user.findFirst({
            where: decoded.id ? { id: decoded.id } : { email: decoded.email }
        });

        if (!user) {
            return { user: null };
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                full_name: user.fullName,
                dni: user.dni,
                created_at: user.createdAt
            }
        };
    } catch (e) {
        console.error('Token decoding error:', e);
        return { user: null };
    }
});
