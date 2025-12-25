// contact-form.js
document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("curXk0TItaE1FErJt"); // حط المفتاح العام هنا

  const contactForm = document.getElementById("contact-form");
  const btnText = document.querySelector(".btn-text");
  const btnLoader = document.querySelector(".btn-loader");
  const formStatus = document.querySelector(".form-status");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // مهم جداً منع إعادة تحميل الصفحة

    // اظهار loader
    btnLoader.style.display = "inline-block";
    btnText.textContent = "Sending...";
    formStatus.textContent = "";

    // إرسال الفورم
    emailjs.sendForm("service_59nieyr", "template_ne4096n", this).then(
      () => {
        formStatus.style.color = "limegreen";
        formStatus.textContent = "✅ Message sent successfully!";
        btnLoader.style.display = "none";
        btnText.textContent = "Send Message";
        contactForm.reset();
      },
      (error) => {
        formStatus.style.color = "red";
        formStatus.textContent = "❌ Failed to send. Try again later.";
        btnLoader.style.display = "none";
        btnText.textContent = "Send Message";
        console.error("EmailJS Error:", error);
      }
    );
  });
});
