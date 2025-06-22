document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msgBox = document.getElementById("api-message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      msgBox.style.display = "block";

      if (res.ok) {
        msgBox.innerText = data.message;
        msgBox.style.backgroundColor = "#d4edda";
        msgBox.style.color = "#155724";
        setTimeout(() => window.location.href = "/", 1000);
      } else {
        msgBox.innerText = data.error || "Login failed.";
        msgBox.style.backgroundColor = "#f8d7da";
        msgBox.style.color = "#721c24";
      }

    } catch (err) {
      msgBox.innerText = "Sunucuya bağlanılamadı.";
      msgBox.style.backgroundColor = "#f8d7da";
      msgBox.style.color = "#721c24";
      msgBox.style.display = "block";
    }

    setTimeout(() => { msgBox.style.display = "none"; }, 3000);
  });
});
