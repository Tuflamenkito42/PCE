import { validateAdmin } from '../../../utils/admin';
import { usePrisma } from '../../../utils/prisma';

export default defineEventHandler(async (event) => {
    validateAdmin(event);
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const prisma = usePrisma();

    await prisma.affiliation.update({
        where: { id: Number(id) },
        data: { status: body.status }
    });

    return { success: true, message: 'Estado de afiliación actualizado' };
});
