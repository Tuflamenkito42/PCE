import { validateAdmin } from '../../../utils/admin';
import { usePrisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const id = getRouterParam(event, 'id');
    const prisma = usePrisma();

    try {
        await prisma.contactMessage.delete({
            where: { id: Number(id) }
        });

        return { success: true, message: 'Mensaje eliminado correctamente' };
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Error deleting message' });
    }
});
