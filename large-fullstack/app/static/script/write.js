document.addEventListener("DOMContentLoaded", () => {
  const publishBtn = document.querySelector(".publish-btn");
  const titleInput = document.querySelector(".title-input");
  const tagInput = document.querySelector(".tag-input");
  const contentEditor = document.querySelector(".content-editor");
  const coverImage = document.querySelector("#coverImage");

  if (!publishBtn || !titleInput || !tagInput || !contentEditor) return;

  publishBtn.addEventListener("click", async () => {
    const title = titleInput.value.trim();
    const content = contentEditor.value.trim();
    const tagsRaw = tagInput.value.trim();

    if (!title || !content) {
      alert("Please fill in both the title and content.");
      return;
    }

    const tags = tagsRaw
      ? tagsRaw.split(",").map(t => t.trim()).filter(t => t.length > 0)
      : [];

    const image_url = (coverImage && coverImage.src && !coverImage.src.includes("base64"))
      ? coverImage.src
      : null;

    const postData = {
      title,
      content,
      tag_names: tags,
      image_url
    };

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Your story has been published!");
        window.location.href = "/";
      } else {
        alert(data.error || "An error occurred while publishing.");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  });

  // Cover image yükleme
  const coverBtn = document.getElementById("coverImageBtn");
  if (coverBtn && coverImage) {
    coverBtn.addEventListener("click", () => {
      const url = prompt("Enter cover image URL:");
      if (url && url.startsWith("http")) {
        coverImage.src = url;
        coverImage.style.display = "block";
      } else {
        alert("Please enter a valid URL.");
      }
    });
  }
});
