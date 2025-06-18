document.addEventListener("DOMContentLoaded", () => {
    const resetForm = document.getElementById("resetPasswordForm");

    const getQueryParam = (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    };

    const userId = decodeURIComponent(getQueryParam("userId"));
    const token = decodeURIComponent(getQueryParam("token"));
    const email = decodeURIComponent(getQueryParam("email"));

    resetForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const password = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        console.log({
            userId,
            token,
            email,
            password,
            confirmPassword
        });
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });

        if (password.length < 6) {
            Toast.fire({ icon: "error", title: "يجب أن تكون كلمة المرور 6 أحرف على الأقل" });
            return;
        }

        if (!/[A-Z]/.test(password)) {
            Toast.fire({ icon: "error", title: "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل" });
            return;
        }

        if (!/[a-z]/.test(password)) {
            Toast.fire({ icon: "error", title: "يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل" });
            return;
        }

        if (!/[0-9]/.test(password)) {
            Toast.fire({ icon: "error", title: "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل" });
            return;
        }

        if (password !== confirmPassword) {
            Toast.fire({ icon: "error", title: "كلمة المرور وتأكيدها غير متطابقين" });
            return;
        }

        try {
            const response = await fetch("http://tjob.runasp.net/api/Accounts/ConfirmResetPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    token,
                    email,
                    password,
                    confirmPassword
                })
            });

            if (response.ok) {
                Toast.fire({ icon: "success", title: "تم إعادة تعيين كلمة المرور بنجاح" }).then(() => {
                    window.location.href = "login.html";
                });
            } else {
                const text = await response.text();
                console.log("Server response text:", text);
                Toast.fire({ icon: "error", title: "الطلب فشل، راجع الكونسول" });
            }

        } catch (error) {
            console.error(error);
            Toast.fire({ icon: "error", title: "فشل الاتصال بالخادم" });
        }
    });
});
