import { validateAdmin } from '../../utils/admin';

export default defineEventHandler(async (event) => {
    console.log('[AdminData] Request received');
    try {
        validateAdmin(event);
        console.log('[AdminData] Admin validated');
    } catch (e) {
        console.error('[AdminData] Admin validation failed:', e);
        throw e;
    }

    const db = useDb();
    console.log('[AdminData] Database initialized');

    try {
        // Create tables if they don't exist
        console.log('[AdminData] Creating tables if needed...');
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS job_applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                offer_id VARCHAR(120) NOT NULL,
                full_name VARCHAR(160) NOT NULL,
                email VARCHAR(160) NOT NULL,
                phone VARCHAR(80) NOT NULL,
                city VARCHAR(120) NOT NULL,
                availability VARCHAR(255) NOT NULL,
                motivation TEXT NOT NULL,
                cv_file_path VARCHAR(255) NULL,
                cv_original_name VARCHAR(255) NULL,
                cv_mime_type VARCHAR(120) NULL,
                status VARCHAR(40) DEFAULT 'new',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_job_status (status),
                INDEX idx_job_created_at (created_at)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS carnet_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NULL,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(20) NULL,
                address VARCHAR(255) NULL,
                city VARCHAR(120) NULL,
                postal_code VARCHAR(10) NULL,
                country VARCHAR(120) NULL,
                nif VARCHAR(20) NULL,
                numero_socio VARCHAR(50) NULL,
                amount DECIMAL(10, 2) DEFAULT 5.00,
                payment_intent_id VARCHAR(255) NULL,
                status VARCHAR(50) DEFAULT 'completed',
                shipping_status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_carnet_email (email),
                INDEX idx_carnet_status (status),
                INDEX idx_carnet_shipping_status (shipping_status),
                INDEX idx_carnet_created_at (created_at)
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS votes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                poll_title VARCHAR(255) NOT NULL,
                option_selected VARCHAR(255) NOT NULL,
                user_id INT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('[AdminData] Fetching statistical data...');
        const [affiliatesRows] = await db.query(`SELECT * FROM affiliations ORDER BY created_at DESC`);
        const [donationsRows] = await db.query(`SELECT * FROM donations ORDER BY created_at DESC`);
        const [usersRows] = await db.query(`SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC`);
        const [messagesRows] = await db.query(`SELECT * FROM contact_messages ORDER BY created_at DESC`);
        const [subscribersRows] = await db.query(`SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC`);
        const [jobApplicationsRows] = await db.query(`SELECT * FROM job_applications ORDER BY created_at DESC`);
        const [carnetOrdersRows] = await db.query(`SELECT * FROM carnet_orders ORDER BY created_at DESC`);
        
        console.log('[AdminData] Core data fetched successfully');

        // Handle votes separately
        let votesRows: any[] = [];
        try {
            console.log('[AdminData] Fetching votes...');
            const [votes] = await db.query(`
                SELECT poll_title, option_selected, COUNT(*) as total 
                FROM votes 
                GROUP BY poll_title, option_selected
                ORDER BY poll_title, total DESC
            `);
            votesRows = votes || [];
            console.log('[AdminData] Votes fetched successfully');
        } catch (e: any) {
            console.warn('[AdminData] Votes table not found or error fetching votes:', e.message);
        }

        const affiliates = affiliatesRows as any[] || [];
        const donations = donationsRows as any[] || [];
        const users = usersRows as any[] || [];
        const messages = messagesRows as any[] || [];
        const subscribers = subscribersRows as any[] || [];
        const jobApplicationsRaw = jobApplicationsRows as any[] || [];
        const carnetOrdersRaw = carnetOrdersRows as any[] || [];
        const votes = votesRows;

        // Calculate totals
        console.log('[AdminData] Calculating totals...');
        const totalDonations = donations.reduce((sum, d: any) => sum + Number(d.amount), 0);
        const totalAffiliates = affiliates.length;
        const totalMessages = messages.length;
        const totalSubscribers = subscribers.length;
        const totalJobApplications = Array.isArray(jobApplicationsRaw) ? jobApplicationsRaw.length : 0;
        const totalCarnetOrders = Array.isArray(carnetOrdersRaw) ? carnetOrdersRaw.length : 0;
        const totalVotes = votes.reduce((sum, v: any) => sum + Number(v.total || 0), 0);

        const monthlyIncome = affiliates.reduce((sum, a: any) => {
            const val = Number(a.quota);
            return isNaN(val) ? sum : sum + val;
        }, 0);

        // Return data with mapped field names for frontend compatibility
        return {
            stats: {
                total_affiliates: Number(totalAffiliates),
                total_donations: Number(totalDonations),
                total_messages: Number(totalMessages),
                total_subscribers: Number(totalSubscribers),
                total_job_applications: Number(totalJobApplications),
                total_carnet_orders: Number(totalCarnetOrders),
                total_votes: Number(totalVotes),
                monthly_income: Number(monthlyIncome)
            },
            // ✅ SECURITY: Remove sensitive fields (DNI, full data) from affiliate data
            affiliates: affiliates.map((a: any) => ({
                id: a.id,
                email: a.email,
                status: a.status,
                quota: Number(a.quota),
                created_at: a.created_at
                // Note: DNI, fullName, phone removed for security
            })),
            donations: donations.map((d: any) => ({
                id: d.id,
                amount: Number(d.amount),
                status: d.status,
                created_at: d.created_at
                // Note: payer personal data not exposed
            })),
            users: users.map((u: any) => ({
                id: u.id,
                email: u.email,
                role: u.role,
                full_name: u.full_name,
                created_at: u.created_at
            })),
            messages: messages.map((m: any) => ({
                id: m.id,
                email: m.email,
                subject: m.subject,
                status: m.status,
                created_at: m.created_at
                // Note: Message content excluded
            })),
            subscribers: subscribers.map((s: any) => ({
                id: s.id,
                email: s.email,
                subscribed_at: s.subscribed_at
            })),
            job_applications: (jobApplicationsRaw as any[]).map(item => ({
                id: Number(item.id),
                offer_id: item.offer_id,
                full_name: item.full_name,
                email: item.email,
                phone: item.phone,
                city: item.city,
                availability: item.availability,
                motivation: item.motivation,
                cv_file_path: item.cv_file_path,
                cv_original_name: item.cv_original_name,
                cv_mime_type: item.cv_mime_type,
                status: item.status,
                created_at: item.created_at
            })),
            carnet_orders: (carnetOrdersRaw as any[]).map(item => ({
                id: Number(item.id),
                user_id: item.user_id ? Number(item.user_id) : null,
                full_name: item.full_name,
                email: item.email,
                phone: item.phone,
                address: item.address,
                city: item.city,
                postal_code: item.postal_code,
                country: item.country,
                nif: item.nif,
                numero_socio: item.numero_socio,
                amount: Number(item.amount || 0),
                payment_intent_id: item.payment_intent_id,
                status: item.status,
                shipping_status: item.shipping_status,
                created_at: item.created_at,
                updated_at: item.updated_at
            })),
            votes: votes.map((v: any) => ({
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
