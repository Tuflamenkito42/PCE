import { requireAuth } from '../../utils/auth-middleware';
import { useDb } from '../../utils/db';

export default defineEventHandler(async (event) => {
    // ✅ SECURITY: Require authentication to check affiliation status
    // Only authenticated users can check their own or authorized affiliations
    const user = requireAuth(event);
    
    const query = getQuery(event);
    const email = query.email as string;

    if (!email) {
        return { affiliated: false };
    }

    // ✅ SECURITY: Only allow users to check their own email or admins
    if (user.email !== email && user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            message: 'Forbidden: Cannot check other users\' affiliation status'
        });
    }

    const db = useDb();
    try {
        const [rows]: any = await db.query(
            'SELECT id, status FROM affiliations WHERE email = ? AND status IN (?, ?, ?)',
            [email, 'paid', 'active', 'simulated_paid']
        );

        // ✅ SECURITY: Only return boolean status, never personal data
        if (rows.length > 0) {
            return {
                affiliated: true,
                status: rows[0].status
            };
        }
        return { affiliated: false };
    } catch (error) {
        return { affiliated: false };
    }
});
