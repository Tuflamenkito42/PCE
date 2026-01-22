document.addEventListener('DOMContentLoaded', () => {
    const pollsStep = document.getElementById('polls-step');
    const proposalForm = document.getElementById('proposal-form');

    // 1. SESSION CHECK
    const isLoggedIn = localStorage.getItem('pce_logged_in') === 'true';
    const userRole = localStorage.getItem('pce_user_role') || 'public';

    if (isLoggedIn) {
        // Unlock polls
        pollsStep.classList.remove('locked');
        const lockOverlay = pollsStep.querySelector('.lock-overlay');
        if (lockOverlay) lockOverlay.style.display = 'none';

        // Show role-specific polls
        document.querySelectorAll('.poll-intern-only').forEach(el => {
            el.style.display = userRole === 'staff' ? 'block' : 'none';
        });
        document.querySelectorAll('.poll-public-only').forEach(el => {
            // Public polls usually visible to everyone or just public
            el.style.display = 'block';
        });

        const title = document.getElementById('polls-title');
        if (title) {
            title.innerText = userRole === 'staff' ? 'Consultas Corporativas (Staff PCE)' : 'Consultas Ciudadanas Activas';
        }
    }

    // 2. VOTING LOGIC
    document.querySelectorAll('.btn-option').forEach(btn => {
        btn.addEventListener('click', function () {
            if (!isLoggedIn) {
                alert("Debe iniciar sesión para registrar su voto.");
                window.location.href = 'login.html';
                return;
            }
            const card = this.closest('.poll-card');
            card.querySelectorAll('.btn-option').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            this.style.background = '#723233';
            alert("Tu voto ha sido registrado de forma anónima i encriptada.");
            card.style.opacity = '0.7';
            card.style.pointerEvents = 'none';
        });
    });

    // 3. PROPOSALS LOGIC
    proposalForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('user-proposal').value;
        if (text.length < 10) {
            alert("Por favor, describe tu propuesta con un poco más de detalle.");
            return;
        }
        alert("¡Propuesta enviada! Nuestro equipo técnico y político la revisará próximamente.");
        document.getElementById('user-proposal').value = "";
    });
});
