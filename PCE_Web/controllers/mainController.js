document.addEventListener('DOMContentLoaded', () => {
    console.log('PCE Website Loaded');

    // Theme Toggle Logic (Placeholder)
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });
    }

    // Form Wizard Logic (Simple Demo)
    const nextBtn = document.querySelector('.btn-next');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const steps = document.querySelectorAll('.step');
            // Find current active step
            let activeIndex = 0;
            steps.forEach((step, index) => {
                if (step.classList.contains('active')) {
                    activeIndex = index;
                }
            });

            // Move to next step if available
            if (activeIndex < steps.length - 1) {
                steps[activeIndex].classList.remove('active');
                steps[activeIndex + 1].classList.add('active');
                
                // You would also show/hide form parts here
                alert('Paso ' + (activeIndex + 2) + ': Demo');
            }
        });
    }
});
