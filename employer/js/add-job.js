<<<<<<< HEAD
=======
// دالة لعرض رسائل Toast
>>>>>>> d7cd93a50f6746f8c8e50b799bec5c4abaf70f42
function showToast(icon, title) {
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
    return Toast.fire({ icon, title });
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("postJobForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

<<<<<<< HEAD
        const formData = new FormData();

=======
        // جمع البيانات من النموذج
        const formData = new FormData();
        
        // إضافة الحقول النصية
>>>>>>> d7cd93a50f6746f8c8e50b799bec5c4abaf70f42
        formData.append("Title", document.getElementById("title").value.trim());
        formData.append("Description", document.getElementById("description").value.trim());
        formData.append("State", document.getElementById("state").value.trim());
        formData.append("City", document.getElementById("city").value.trim());
        formData.append("Street", document.getElementById("street").value.trim());
        formData.append("Home", document.getElementById("home").value.trim());
        formData.append("Type", document.getElementById("category").value);
<<<<<<< HEAD

        const price = parseFloat(document.getElementById("payment").value);
        formData.append("Price", price.toString());

        const dateValue = document.getElementById("date").value;
        const dateTime = new Date(dateValue).toISOString();
        formData.append("DateTime", dateTime);

        // أضف RequestTypeId - عدّل الرقم حسب نوع الطلب المناسب لك
        formData.append("RequestTypeId", "1");

=======
        
        // تحويل السعر إلى رقم
        const price = parseFloat(document.getElementById("payment").value);
        formData.append("Price", price);
        
        // تحويل التاريخ إلى تنسيق ISO
        const dateValue = document.getElementById("date").value;
        const dateTime = new Date(dateValue).toISOString();
        formData.append("DateTime", dateTime);
        
        // إضافة الصورة إذا تم اختيارها
>>>>>>> d7cd93a50f6746f8c8e50b799bec5c4abaf70f42
        const mainImgFile = document.getElementById("mainImg").files[0];
        if (mainImgFile) {
            formData.append("MainImg", mainImgFile);
        }

<<<<<<< HEAD
        // قراءة التوكن من localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            showToast("error", "الرجاء تسجيل الدخول أولاً");
            return;
        }

        try {
            const response = await fetch("http://tjob.tryasp.net/api/Employer/Requests", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                    // لا تضف Content-Type لأن FormData يحددها تلقائياً
                },
                body: formData
            });

            if (response.ok) {
                showToast("success", "تم نشر العمل بنجاح!");
                form.reset();

                setTimeout(() => {
                    window.location.href = "./employer-jobs.html";
                }, 2000);
            } else {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                showToast("error", `فشل في نشر العمل: ${errorText || response.statusText}`);
=======
        // طباعة البيانات للتشخيص (يمكن حذفها لاحقًا)
        console.log("Title:", document.getElementById("title").value);
        console.log("Description:", document.getElementById("description").value);
        console.log("State:", document.getElementById("state").value);
        console.log("City:", document.getElementById("city").value);
        console.log("Street:", document.getElementById("street").value);
        console.log("Home:", document.getElementById("home").value);
        console.log("Type:", document.getElementById("category").value);
        console.log("Price:", price);
        console.log("DateTime:", dateTime);
        console.log("MainImg:", mainImgFile);

        try {
            const response = await fetch("http://tjob.runasp.net/api/Requests", {
                method: "POST",
                body: formData // إرسال FormData مباشرة بدون تحديد Content-Type
            } );

            if (response.ok) {
                showToast("success", "تم نشر العمل بنجاح!");
                
                // إعادة تعيين النموذج
                form.reset();
                
                // التوجيه إلى صفحة إدارة الوظائف المنشورة بعد ثانيتين
                setTimeout(() => {
                    window.location.href = "./employer-jobs.html";
                }, 2000);
                
            } else {
                // محاولة قراءة رسالة الخطأ من الخادم
                let errorMessage = "فشل في نشر العمل";
                
                try {
                    const errorData = await response.json();
                    console.log("Server error response:", errorData);
                    
                    if (Array.isArray(errorData)) {
                        // إذا كانت الاستجابة مصفوفة من الأخطاء
                        errorMessage = errorData.map(error => {
                            if (typeof error === "object" && error.description) {
                                return error.description;
                            } else if (typeof error === "string") {
                                return error;
                            } else {
                                return JSON.stringify(error);
                            }
                        }).join(", ");
                    } else if (typeof errorData === "object") {
                        // إذا كانت الاستجابة كائن
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.errors) {
                            // إذا كان هناك كائن errors
                            const errors = Object.values(errorData.errors).flat();
                            errorMessage = errors.join(", ");
                        } else {
                            errorMessage = JSON.stringify(errorData);
                        }
                    } else {
                        errorMessage = errorData.toString();
                    }
                } catch (parseError) {
                    // إذا فشل تحليل JSON، استخدم النص الخام
                    try {
                        const errorText = await response.text();
                        errorMessage = errorText || `خطأ HTTP ${response.status}`;
                    } catch (textError) {
                        errorMessage = `خطأ HTTP ${response.status}`;
                    }
                }
                
                showToast("error", errorMessage);
>>>>>>> d7cd93a50f6746f8c8e50b799bec5c4abaf70f42
            }
        } catch (error) {
            console.error("فشل الاتصال بالخادم:", error);
            showToast("error", "فشل الاتصال بالخادم");
        }
    });
});
