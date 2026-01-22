document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form-main');
    const stepBiometry = document.getElementById('step-biometry');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const snapDni = document.getElementById('snap-dni');
    const snapSelfie = document.getElementById('snap-selfie');
    const previewDni = document.getElementById('preview-dni');
    const previewSelfie = document.getElementById('preview-selfie');
    const dniInput = document.getElementById('dni-input');
    const btnFinalLogin = document.getElementById('btn-final-login');

    let dniCaptured = false;
    let faceCaptured = false;

    // STEP 1: LOGIN FORM
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('auth-user').value;

        // Save role simulation
        const role = (user.toLowerCase().includes('staff') || user.toLowerCase().includes('pce')) ? 'staff' : 'public';
        localStorage.setItem('pce_user_role', role);
        localStorage.setItem('pce_logged_in', 'pending'); // Need biometry

        // Unlock Biometry
        stepBiometry.classList.remove('locked');
        stepBiometry.querySelector('.lock-overlay').style.display = 'none';
        initCamera();

        // Disable first step
        loginForm.closest('.vote-card').style.opacity = '0.5';
        loginForm.closest('.vote-card').style.pointerEvents = 'none';

        alert("Validación de credenciales correcta. Por favor, realice la verificación biométrica.");
    });

    // CAMERA LOGIC
    async function initCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            console.error("Camera error:", err);
            alert("Acceso a cámara denegado.");
        }
    }

    function capture(targetBox) {
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        targetBox.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; border-radius:8px; object-fit:cover;">`;

        if (targetBox.id === 'preview-dni') dniCaptured = true;
        if (targetBox.id === 'preview-selfie') faceCaptured = true;

        checkStatus();
    }

    snapDni?.addEventListener('click', () => capture(previewDni));
    snapSelfie?.addEventListener('click', () => capture(previewSelfie));
    dniInput?.addEventListener('input', checkStatus);

    function checkStatus() {
        if (dniCaptured && faceCaptured && dniInput.value.length >= 8) {
            btnFinalLogin.disabled = false;
            btnFinalLogin.classList.add('active');
        }
    }

    // FINAL LOGIN
    btnFinalLogin?.addEventListener('click', () => {
        btnFinalLogin.innerHTML = "Verificando Identidad...";
        btnFinalLogin.disabled = true;

        setTimeout(() => {
            localStorage.setItem('pce_logged_in', 'true');
            alert("¡Identidad verificada! Bienvenido al sistema PCE.");
            window.location.href = 'index.html';
        }, 2000);
    });
});
