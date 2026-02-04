export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const email = query.email as string;

    if (!email) {
        return { affiliated: false };
    }

    const db = useDb();
    try {
        const [rows]: any = await db.query(
            'SELECT * FROM affiliations WHERE email = ? AND status IN (?, ?, ?)',
            [email, 'paid', 'active', 'simulated_paid']
        );

        if (rows.length > 0) {
            return {
                affiliated: true,
                data: rows[0]
            };
        }
        return { affiliated: false };
    } catch (error) {
        return { affiliated: false };
    }
});
