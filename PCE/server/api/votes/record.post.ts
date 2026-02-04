import { defineEventHandler, readBody } from 'h3';
import { useDb } from '../../utils/db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { pollTitle, option, userId } = body;

    if (!pollTitle || !option) {
        throw createError({
            statusCode: 400,
            message: 'Datos de votación incompletos'
        });
    }

    const db = useDb();

    try {
        // 1. Check if user already voted for this poll
        if (userId) {
            const [existing] = await db.query(
                'SELECT id FROM votes WHERE poll_title = ? AND user_id = ?',
                [pollTitle, userId]
            );

            if ((existing as any[]).length > 0) {
                throw createError({
                    statusCode: 403,
                    message: 'Ya has participado en esta consulta.'
                });
            }
        }

        // 2. Record the vote
        await db.query(
            'INSERT INTO votes (poll_title, option_selected, user_id) VALUES (?, ?, ?)',
            [pollTitle, option, userId || null]
        );

        return { status: 'ok', message: 'Voto registrado correctamente' };
    } catch (error: any) {
        if (error.statusCode === 403) throw error;
        console.error('Vote recording error:', error);
        throw createError({
            statusCode: 500,
            message: 'Error al registrar el voto'
        });
    }
});
