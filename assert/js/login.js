document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailOrUserName = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://tjob.runasp.net/api/Accounts/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailOrUserName,
                password,
                rememberMe: true
            })
        });

        if (response.ok) {
            showToast("success", "تم تسجيل الدخول بنجاح");

            const data = await response.json();
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } else {
            const result = await response.json();
            if (Array.isArray(result)) {
                result.forEach(err => {
                    showToast("error", err.description || "خطأ في البيانات");
                });
            } else if (result.message) {
                showToast("error", result.message);
            } else {
                showToast("error", "فشل تسجيل الدخول. تأكد من صحة البريد وكلمة المرور.");
            }
        }
    } catch (error) {
        console.error("Login error:", error);
        showToast("error", "فشل الاتصال بالخادم.");
    }
});

function showToast(icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    return Toast.fire({ icon, title });
}