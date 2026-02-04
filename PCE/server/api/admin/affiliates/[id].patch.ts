export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const db = useDb();

    await db.query('UPDATE affiliations SET status = ? WHERE id = ?', [body.status, id]);

    return { success: true, message: 'Estado de afiliación actualizado' };
});
