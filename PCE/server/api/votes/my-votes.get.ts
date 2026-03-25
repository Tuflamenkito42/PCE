import { defineEventHandler } from 'h3';
import { useDb } from '../../utils/db';
import { requireAuth } from '../../utils/auth-middleware';

export default defineEventHandler(async (event) => {
    // ✅ SECURITY: Require authentication - cannot access other users' votes
    const user = requireAuth(event);

    const db = useDb();

    try {
        const [rows] = await db.query(
            'SELECT poll_title FROM votes WHERE user_id = ?',
            [user.id]
        );

        return {
            polls: (rows as any[]).map(r => r.poll_title)
        };
    } catch (error) {
        console.error('Fetch my votes error:', error);
        return { polls: [] };
    }
});
