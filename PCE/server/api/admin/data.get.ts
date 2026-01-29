
export default defineEventHandler(async (event) => {
    // Basic Auth Check
    const token = getCookie(event, 'auth_token');
    if (!token) {
        throw createError({ statusCode: 401, message: 'Unauthorized' });
    }

    // Role Check (Decoding manually for now, should be verified properly in production)
    const buffer = globalThis.Buffer || await import('node:buffer').then(m => m.Buffer);
    const decoded = JSON.parse(buffer.from(token, 'base64').toString('utf-8'));

    if (decoded.role !== 'admin') {
        throw createError({ statusCode: 403, message: 'Forbidden' });
    }

    const db = useDb();

    // Fetch stats
    const [affiliates] = await db.query('SELECT * FROM affiliations ORDER BY created_at DESC');
    const [donations] = await db.query('SELECT * FROM donations ORDER BY created_at DESC');
    const [users] = await db.query('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC');

    // Calculate totals
    const totalDonations = (donations as any[]).reduce((sum, d) => sum + Number(d.amount), 0);
    const totalAffiliates = (affiliates as any[]).length;
    const monthlyIncome = (affiliates as any[]).reduce((sum, a) => {
        const val = Number(a.quota);
        return isNaN(val) ? sum : sum + val;
    }, 0);

    return {
        stats: {
            total_affiliates: totalAffiliates,
            total_donations: totalDonations,
            monthly_income: monthlyIncome
        },
        affiliates,
        donations,
        users
    };
});
