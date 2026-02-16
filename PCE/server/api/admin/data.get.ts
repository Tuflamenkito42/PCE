import { validateAdmin } from '../../utils/admin';
import { usePrisma } from '../../utils/prisma';

export default defineEventHandler(async (event) => {
    console.log('[AdminData] Request received');
    try {
        validateAdmin(event);
        console.log('[AdminData] Admin validated');
    } catch (e) {
        console.error('[AdminData] Admin validation failed:', e);
        throw e;
    }

    const prisma = usePrisma();
    console.log('[AdminData] Prisma initialized');

    try {
        // Fetch stats using Prisma
        console.log('[AdminData] Fetching statistical data...');
        const [affiliates, donations, users, messages, subscribers] = await Promise.all([
            prisma.affiliation.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.donation.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.user.findMany({
                select: { id: true, fullName: true, email: true, role: true, createdAt: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: 'desc' } })
        ]);
        console.log('[AdminData] Core data fetched successfully');

        // Handle votes separately since it might not be in schema
        let votes: any[] = [];
        try {
            console.log('[AdminData] Fetching votes...');
            votes = await prisma.$queryRawUnsafe(`
                SELECT poll_title, option_selected, COUNT(*) as total 
                FROM votes 
                GROUP BY poll_title, option_selected
                ORDER BY poll_title, total DESC
            `);
            console.log('[AdminData] Votes fetched successfully');
        } catch (e: any) {
            console.warn('[AdminData] Votes table not found or error fetching votes:', e.message);
        }

        // Calculate totals
        console.log('[AdminData] Calculating totals...');
        const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount), 0);
        const totalAffiliates = affiliates.length;
        const totalMessages = messages.length;
        const totalSubscribers = subscribers.length;
        const totalVotes = votes.reduce((sum, v) => sum + Number(v.total), 0);

        const monthlyIncome = affiliates.reduce((sum, a) => {
            const val = Number(a.quota);
            return isNaN(val) ? sum : sum + val;
        }, 0);

        // Return data with mapped field names for frontend compatibility (snake_case)
        // Return data with mapped field names explicitly converted to Numbers
        return {
            stats: {
                total_affiliates: Number(totalAffiliates),
                total_donations: Number(totalDonations),
                total_messages: Number(totalMessages),
                total_subscribers: Number(totalSubscribers),
                total_votes: Number(totalVotes),
                monthly_income: Number(monthlyIncome)
            },
            affiliates: affiliates.map(a => ({
                ...a,
                quota: Number(a.quota),
                created_at: a.createdAt
            })),
            donations: donations.map(d => ({
                ...d,
                amount: Number(d.amount),
                created_at: d.createdAt
            })),
            users: users.map(u => ({
                id: u.id,
                email: u.email,
                role: u.role,
                full_name: u.fullName,
                created_at: u.createdAt
            })),
            messages: messages.map(m => ({
                ...m,
                created_at: m.createdAt
            })),
            subscribers: subscribers.map(s => ({
                ...s,
                subscribed_at: s.subscribedAt
            })),
            votes: votes.map(v => ({
                poll_title: v.poll_title,
                option_selected: v.option_selected,
                total: Number(v.total)
            }))
        };
    } catch (error: any) {
        console.error('[AdminData] Error during data fetch:', error);
        throw createError({
            statusCode: 500,
            message: 'Error al obtener datos: ' + error.message
        });
    }
});
