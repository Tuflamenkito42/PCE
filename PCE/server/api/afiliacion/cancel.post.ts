export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email } = body;

    if (!email) {
        throw createError({ statusCode: 400, message: 'Email requerido' });
    }

    const db = useDb();
    try {
        // Update status to 'cancelled' for the active affiliation
        await db.query(
            'UPDATE affiliations SET status = ? WHERE email = ? AND status IN (?, ?, ?)',
            ['cancelled', email, 'paid', 'active', 'simulated_paid']
        );

        // Send cancellation email (optional/future)

        return { success: true, message: 'Suscripción cancelada correctamente' };
    } catch (error: any) {
        throw createError({ statusCode: 500, message: 'Error al cancelar la suscripción: ' + error.message });
    }
});
