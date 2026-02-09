import { validateAdmin } from '../../../utils/admin';
import { usePrisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const id = getRouterParam(event, 'id');
    const prisma = usePrisma();

    await prisma.donation.delete({
        where: { id: Number(id) }
    });

    return { success: true, message: 'Donación eliminada correctamente' };
});
