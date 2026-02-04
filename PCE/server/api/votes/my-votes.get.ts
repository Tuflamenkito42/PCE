import { defineEventHandler, getQuery } from 'h3';
import { useDb } from '../../utils/db';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const userId = query.userId;

    if (!userId) {
        return { polls: [] };
    }

    const db = useDb();

    try {
        const [rows] = await db.query(
            'SELECT poll_title FROM votes WHERE user_id = ?',
            [userId]
        );

        return {
            polls: (rows as any[]).map(r => r.poll_title)
        };
    } catch (error) {
        console.error('Fetch my votes error:', error);
        return { polls: [] };
    }
});
