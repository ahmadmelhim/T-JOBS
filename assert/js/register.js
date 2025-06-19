const registerSubmit = document.getElementById('registerSubmit');

registerSubmit.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userName = document.getElementById('userName').value;
  const email = document.getElementById('email').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const age = document.getElementById('age').value;
  const address = document.getElementById('address').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const userType = document.getElementById('userType').value;
  const ssn = document.getElementById('ssn').value; 

  // تحقق من كلمة المرور
  if (password.length < 6) {
    showToast("error", "يجب ان تتكون كلمة المرور من 6 أحرف على الأقل");
    return;
  }
  if (!/[A-Z]/.test(password)) {
    showToast("error", "يجب ان تحتوي كلمة المرور على حرف كبير واحد على الأقل");
    return;
  }
  if (!/[a-z]/.test(password)) {
    showToast("error", "يجب ان تحتوي كلمة المرور على حرف صغير واحد على الأقل");
    return;
  }
  if (!/[0-9]/.test(password)) {
    showToast("error", "يجب ان تحتوي كلمة المرور على رقم واحد على الأقل");
    return;
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    showToast("error", "يجب أن تحتوي كلمة المرور على رمز خاص مثل * أو @ أو !");
    return;
  }
  if (password !== confirmPassword) {
    showToast("error", "كلمة المرور وتأكيدها غير متطابقين");
    return;
  }

  // تجهيز البيانات بصيغة JSON
  const data = {
    userName: userName,
    email: email,
    firstName: firstName,
    lastName: lastName,
    age: parseInt(age), // تأكد من تحويل العمر إلى رقم صحيح
    address: address,
    password: password,
    confirmPassword: confirmPassword,
    userType: parseInt(userType), // تأكد من تحويل نوع المستخدم إلى رقم صحيح
    ssn: ssn // يمكن أن يكون فارغًا أو رقمًا
  };

  try {
    const response = await fetch('http://tjob.runasp.net/api/Accounts/Register', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json' // تحديد نوع المحتوى كـ JSON
      },
      body: JSON.stringify(data ) // تحويل الكائن إلى سلسلة JSON
    });

    if (response.ok) {
      showToast("success", "تم إنشاء الحساب بنجاح").then(() => {
        window.location.href = 'login.html';
      });
    } else if (response.status === 400) {
      const errors = await response.json();
      // إذا كانت الأخطاء عبارة عن كائن يحتوي على مصفوفات، قم بتسطيحها
      if (typeof errors === 'object' && errors !== null && !Array.isArray(errors)) {
        Object.values(errors).flat().forEach(error => {
          showToast("error", error);
        });
      } else if (Array.isArray(errors)) { // إذا كانت الأخطاء مصفوفة مباشرة
        errors.forEach(error => {
          showToast("error", error);
        });
      } else { // إذا كانت الأخطاء نصًا عاديًا
        showToast("error", errors.toString());
      }
    } else {
      showToast("error", "فشل إنشاء الحساب، حاول مرة أخرى");
    }
  } catch (err) {
    console.error("فشل في إرسال البيانات:", err);
    showToast("error", "حدث خطأ أثناء إرسال البيانات");
  }
});

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
