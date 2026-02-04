export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const id = getRouterParam(event, 'id');
    const db = useDb();

    await db.query('DELETE FROM donations WHERE id = ?', [id]);

    return { success: true, message: 'Donación eliminada correctamente' };
});
