document.addEventListener("DOMContentLoaded", async function () {
  const topicsContainer = document.querySelector(".interests-grid");
  const usersContainer = document.querySelector(".suggested-profiles");
  const form = document.getElementById("topics-form");

  let selectedTopics = [];

  // API'den konuları çek
  const topicsRes = await fetch("/api/topics");
  const topics = await topicsRes.json();

  topics.forEach(topic => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "interest-item";
    btn.setAttribute("data-id", topic.id);
    btn.textContent = topic.name;

    btn.addEventListener("click", () => {
      btn.classList.toggle("selected");
      if (selectedTopics.includes(topic.id)) {
        selectedTopics = selectedTopics.filter(id => id !== topic.id);
      } else {
        selectedTopics.push(topic.id);
      }
    });

    topicsContainer.appendChild(btn);
  });

  // API'den kullanıcıları çek
  const usersRes = await fetch("/api/users");
  const users = await usersRes.json();

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "profile-suggestion";

    div.innerHTML = `
      <img src="https://picsum.photos/48" alt="${user.username}">
      <div class="profile-info">
        <h3>${user.username}</h3>
        <button class="follow-btn" data-userid="${user.id}">Follow</button>
      </div>
    `;

    const followBtn = div.querySelector(".follow-btn");
    followBtn.addEventListener("click", () => {
      if (followBtn.textContent === "Follow") {
        followBtn.textContent = "Following";
        followBtn.style.backgroundColor = "#1a8917";
        followBtn.style.color = "white";
      } else {
        followBtn.textContent = "Follow";
        followBtn.style.backgroundColor = "";
        followBtn.style.color = "";
      }
    });

    usersContainer.appendChild(div);
  });

  // Form gönderme
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (selectedTopics.length < 3) {
      alert("Lütfen en az 3 ilgi alanı seçin!");
      return;
    }

    const followedUsers = Array.from(document.querySelectorAll(".follow-btn"))
      .filter(btn => btn.textContent === "Following")
      .map(btn => btn.getAttribute("data-userid"));

    try {
      // her topic için ayrı fetch
      const topicRequests = selectedTopics.map(topicId =>
        fetch("/api/follow-topic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic_id: topicId }),
        })
      );

      // her kullanıcı için ayrı fetch
      const userRequests = followedUsers.map(userId =>
        fetch("/api/follow-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        })
      );

      const allRequests = [...topicRequests, ...userRequests];
      const results = await Promise.all(allRequests);

      const allOk = results.every(res => res.ok);

      if (allOk) {
        alert("Tüm takipler başarıyla kaydedildi!");
        window.location.href = "/";
      } else {
        alert("Bazı takipler başarısız oldu.");
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
    }
  });
});
