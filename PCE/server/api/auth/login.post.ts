import bcrypt from 'bcryptjs';
import { usePrisma } from '../../utils/prisma';
import { createAuthToken } from '../../utils/auth-token';
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
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
        throw createError({ statusCode: 400, message: 'Email y contraseña requeridos' });
    }

    const prisma = usePrisma();
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw createError({ statusCode: 401, message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        throw createError({ statusCode: 401, message: 'Credenciales inválidas' });
    }

    const photoUrl = await getAffiliationPhotoUrl(user.email, user.dni);

    // Set signed auth cookie for session
    const token = createAuthToken({
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.fullName || undefined,
        dni: user.dni || undefined,
        created_at: user.createdAt ? user.createdAt.toISOString() : undefined
    });

    const forwardedProto = String(getHeader(event, 'x-forwarded-proto') || '').toLowerCase();
    const isHttpsRequest = forwardedProto === 'https' || Boolean((event.node.req.socket as any)?.encrypted);

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        // Only mark secure when request is actually HTTPS, otherwise cookie is dropped on HTTP.
        secure: isHttpsRequest,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 semana exacta 
        path: '/'
    });

    return {
        status: 'success',
        user: {
            id: user.id,
            email: user.email,
            full_name: user.fullName,
            role: user.role,
            dni: user.dni,
            created_at: user.createdAt,
            photoUrl
        }
    };
});
