import { verifyAuthToken } from '../../utils/auth-token';
import { usePrisma } from '../../utils/prisma';
import { useDb } from '../../utils/db';

const getAffiliationPhotoUrl = async (email?: string | null, dni?: string | null) => {
    const db = useDb();
    const normalizedEmail = String(email || '').toLowerCase().trim();
    const normalizedDni = String(dni || '').toUpperCase().trim();

    if (!normalizedEmail && !normalizedDni) {
        return null;
    }

    try {
        const [rows]: any = await db.query(
                        `SELECT COALESCE(card_photo_path, photo_url) AS card_photo_path
             FROM affiliations
             WHERE (
               email = ?
               OR (? <> '' AND dni = ?)
             )
                             AND (card_photo_path IS NOT NULL OR photo_url IS NOT NULL)
             ORDER BY created_at DESC
             LIMIT 1`,
            [normalizedEmail, normalizedDni, normalizedDni]
        );

        const latest = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        return latest?.card_photo_path || null;
    } catch {
        return null;
    }
};

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token');

    if (!token) {
        return { user: null };
    }

    try {
        const decoded = verifyAuthToken(token);
        const prisma = usePrisma();
        const user = await prisma.user.findFirst({
            where: decoded.id ? { id: decoded.id } : { email: decoded.email }
        });

        if (!user) {
            return { user: null };
        }

        const photoUrl = await getAffiliationPhotoUrl(user.email, user.dni);

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                full_name: user.fullName,
                dni: user.dni,
                created_at: user.createdAt,
                photoUrl
            }
        };
    } catch (e) {
        console.error('Token decoding error:', e);
        return { user: null };
    }
});
