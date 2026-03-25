import { requireAuth } from '../../utils/auth-middleware';
import { useDb } from '../../utils/db';

export default defineEventHandler(async (event) => {
    // ✅ SECURITY: Require authentication
    const user = requireAuth(event);
    
    const body = await readBody(event);
    const { email } = body;

    if (!email) {
        throw createError({ statusCode: 400, message: 'Email requerido' });
    }

    // ✅ SECURITY: Only allow users to cancel their own affiliation, or admin
    if (user.email !== email && user.role !== 'admin') {
        throw createError({
            statusCode: 403,
            message: 'Forbidden: Cannot cancel other users\' affiliations'
        });
    }

    const db = useDb();
    try {
        // Update status to 'cancelled' for the active affiliation
        await db.query(
            'UPDATE affiliations SET status = ? WHERE email = ? AND status IN (?, ?, ?)',
            ['cancelled', email, 'paid', 'active', 'simulated_paid']
        );

        console.log(`✅ Affiliation cancelled for: ${email}`);

        return { success: true, message: 'Suscripción cancelada correctamente' };
    } catch (error: any) {
        console.error(`❌ Error cancelling affiliation for ${email}:`, error);
        throw createError({ statusCode: 500, message: 'Error al cancelar la suscripción: ' + error.message });
    }
});
