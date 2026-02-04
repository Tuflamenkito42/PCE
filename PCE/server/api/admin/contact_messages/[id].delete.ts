export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const id = getRouterParam(event, 'id');
    const db = useDb();

    try {
        await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
        return { status: 'ok' };
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Error deleting message' });
    }
});
