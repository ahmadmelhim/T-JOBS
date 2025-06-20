// دالة لعرض رسائل Toast
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

        // جمع البيانات من النموذج
        const formData = new FormData();
        
        // إضافة الحقول النصية
        formData.append("Title", document.getElementById("title").value.trim());
        formData.append("Description", document.getElementById("description").value.trim());
        formData.append("State", document.getElementById("state").value.trim());
        formData.append("City", document.getElementById("city").value.trim());
        formData.append("Street", document.getElementById("street").value.trim());
        formData.append("Home", document.getElementById("home").value.trim());
        formData.append("Type", document.getElementById("category").value);
        
        // تحويل السعر إلى رقم
        const price = parseFloat(document.getElementById("payment").value);
        formData.append("Price", price);
        
        // تحويل التاريخ إلى تنسيق ISO
        const dateValue = document.getElementById("date").value;
        const dateTime = new Date(dateValue).toISOString();
        formData.append("DateTime", dateTime);
        
        // إضافة الصورة إذا تم اختيارها
        const mainImgFile = document.getElementById("mainImg").files[0];
        if (mainImgFile) {
            formData.append("MainImg", mainImgFile);
        }

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
            }
        } catch (error) {
            console.error("فشل الاتصال بالخادم:", error);
            showToast("error", "فشل الاتصال بالخادم");
        }
    });
});
