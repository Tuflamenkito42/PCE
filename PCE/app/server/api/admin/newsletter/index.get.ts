import { validateAdmin } from '../../../utils/admin';
import { useDb } from '../../../utils/db';

export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const db = useDb();

    const [subscribers] = await db.query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC');

    return subscribers;
});
