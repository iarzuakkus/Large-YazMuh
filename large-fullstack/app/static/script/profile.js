document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".post-card").forEach(card => {
    card.addEventListener("click", () => {
      const postId = card.dataset.postid;
      if (postId) {
        window.location.href = `/post/${postId}`;
      }
    });
  });
});
