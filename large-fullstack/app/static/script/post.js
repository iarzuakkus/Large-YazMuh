document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('commentForm');
  const textarea = form.querySelector('textarea');
  const button = form.querySelector('button');

  // Giriş yapılmamışsa login'e yönlendir
  if (button.classList.contains('login-redirect')) {
    button.addEventListener('click', () => {
      window.location.href = '/login';
    });
    return; // fetch gönderme!
  }

  // Giriş yapılmışsa yorum gönder
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const content = textarea.value.trim();
    if (!content) return;

    const postId = window.location.pathname.split('/').pop();

    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Yorum eklenemedi');
        return;
      }

      const data = await res.json();
      alert(data.message); // istersen buraya yorum DOM’a eklenecek

      textarea.value = ''; // temizle
    } catch (err) {
      alert('Sunucu hatası!');
    }
  });
});
