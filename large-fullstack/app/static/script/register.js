document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const msgBox = document.getElementById("api-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form["confirm-password"].value;
    const button = form.querySelector("button");

    if (!username || !email || !password || !confirmPassword) {
      return showMessage("Tüm alanları doldurun.", false);
    }

    if (password !== confirmPassword) {
      return showMessage("Şifreler uyuşmuyor.", false);
    }

    button.disabled = true;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirm_password: confirmPassword })
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(data.message, true);
        setTimeout(() => {
          window.location.href = "/interests";
        }, 1500);
      } else {
        showMessage(data.error || "Kayıt başarısız.", false);
      }
    } catch {
      showMessage("Sunucu hatası. Lütfen tekrar deneyin.", false);
    } finally {
      button.disabled = false;
    }
  });

  function showMessage(message, success) {
    msgBox.innerText = message;
    msgBox.style.display = "block";
    msgBox.style.backgroundColor = success ? "#d4edda" : "#f8d7da";
    msgBox.style.color = success ? "#155724" : "#721c24";
    setTimeout(() => { msgBox.style.display = "none"; }, 3000);
  }
});
