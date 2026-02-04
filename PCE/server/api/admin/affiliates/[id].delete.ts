export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const id = getRouterParam(event, 'id');
    const db = useDb();

    await db.query('DELETE FROM affiliations WHERE id = ?', [id]);

    return { success: true, message: 'Afiliación eliminada correctamente' };
});
