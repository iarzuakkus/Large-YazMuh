function handleUserMenuDropdown() {
  const userBtn = document.getElementById("userMenuBtn");
  const dropdown = document.getElementById("userDropdown");

  if (!userBtn || !dropdown) return;

  userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    const isClickInside =
      dropdown.contains(e.target) || userBtn.contains(e.target);
    if (!isClickInside) {
      dropdown.classList.remove("show");
    }
  });
}

function handleLiveSearch() {
  const input = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");
  let timer;

  if (!input || !resultsContainer) return;

  input.addEventListener("focus", async () => {
    resultsContainer.classList.add("show");
    resultsContainer.innerHTML = "<p>Loading top posts...</p>";

    try {
      const res = await fetch("/api/top-commented-posts");
      const topPosts = await res.json();

      resultsContainer.innerHTML = "";

      if (topPosts.length) {
        const topHeader = document.createElement("h4");
        topHeader.textContent = "Top Posts";
        resultsContainer.appendChild(topHeader);

        topPosts.forEach(post => {
          const div = document.createElement("div");
          div.className = "post-card";
          div.style.cursor = "pointer";
          div.innerHTML = `
            <div class="post-content">
              <h3 class="post-title">${post.title}</h3>
              <div class="post-meta">
                <span>${post.comment_count} yorum</span>
              </div>
            </div>
          `;
          div.addEventListener("click", () => {
            window.location.href = `/posts/${post.id}`;
          });
          resultsContainer.appendChild(div);
        });
      } else {
        resultsContainer.innerHTML = "<p>No popular posts found.</p>";
      }
    } catch {
      resultsContainer.innerHTML = "<p>Top posts failed to load.</p>";
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !input.contains(e.target) &&
      !resultsContainer.contains(e.target)
    ) {
      resultsContainer.classList.remove("show");
    }
  });

  input.addEventListener("input", () => {
    clearTimeout(timer);
    const query = input.value.trim();

    if (!query) {
      resultsContainer.innerHTML = "";
      return;
    }

    timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        resultsContainer.innerHTML = "";

        if (
          data.posts.length === 0 &&
          data.users.length === 0 &&
          data.topics.length === 0
        ) {
          resultsContainer.innerHTML = "<p>No results found.</p>";
          return;
        }

        // === Posts ===
        if (data.posts.length) {
          const postHeader = document.createElement("h4");
          postHeader.textContent = "Posts";
          resultsContainer.appendChild(postHeader);

          data.posts.forEach((post) => {
            const div = document.createElement("div");
            div.className = "post-card";
            div.style.cursor = "pointer";
            div.innerHTML = `
              <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}...</p>
                <div class="post-meta">
                  <span>By ${post.author}</span> ·
                  <span>${post.created_at}</span>
                </div>
              </div>
            `;
            div.addEventListener("click", () => {
              window.location.href = `/posts/${post.id}`;
            });
            resultsContainer.appendChild(div);
          });
        }

        // === Users ===
        if (data.users.length) {
          const userHeader = document.createElement("h4");
          userHeader.textContent = "Users";
          resultsContainer.appendChild(userHeader);

          data.users.forEach((user) => {
            const div = document.createElement("div");
            div.className = "user-result";
            div.innerHTML = `<span>@${user.username}</span>`;
            resultsContainer.appendChild(div);
          });
        }

        // === Topics ===
        if (data.topics.length) {
          const topicHeader = document.createElement("h4");
          topicHeader.textContent = "Topics";
          resultsContainer.appendChild(topicHeader);

          data.topics.forEach((topic) => {
            const div = document.createElement("div");
            div.className = "topic-result";
            div.innerHTML = `<span>#${topic.name}</span>`;
            resultsContainer.appendChild(div);
          });
        }
      } catch {
        resultsContainer.innerHTML = "<p>Search failed. Try again.</p>";
      }
    }, 400);
  });
}

function handleNavbar() {
  handleUserMenuDropdown();
  handleLiveSearch();
}

window.addEventListener("DOMContentLoaded", () => {
  handleNavbar();
});
