// index.js - Follow, Like ve Save işlemleri (güncel API destekli)

async function isUserLoggedIn() {
  try {
    const res = await fetch("/api/session-check", {
      credentials: "include"
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Takip butonları
function handleFollowButtons() {
  document.querySelectorAll('.follow-topic-btn, .follow-user-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      const loggedIn = await isUserLoggedIn();
      if (!loggedIn) {
        e.preventDefault();
        window.location.href = '/login';
        return;
      }

      const isTopic = btn.classList.contains('follow-topic-btn');
      const id = btn.dataset.topicid || btn.dataset.userid;
      const endpoint = isTopic ? '/api/follow-topic' : '/api/follow-user';

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(isTopic ? { topic_id: id } : { user_id: id })
        });

        const data = await res.json();

        if (res.ok) {
          btn.textContent = 'Following';
          btn.classList.add('following');
        } else {
          alert(data.error || 'Takip işlemi başarısız.');
        }
      } catch (error) {
        alert('Sunucuya bağlanılamadı.');
      }
    });
  });
}

// Beğeni ve Kayıt
function handleActionButtons() {
  document.querySelectorAll('.action-button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const loggedIn = await isUserLoggedIn();
      if (!loggedIn) {
        window.location.href = '/login';
        return;
      }

      const span = btn.querySelector('span');
      const postId = btn.dataset.postid;
      const isLike = btn.classList.contains('like-btn');
      const endpoint = isLike ? '/api/like-post' : '/api/save-post';

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ post_id: postId })
        });

        const data = await res.json();
        if (res.ok) {
          btn.classList.toggle('active');
          span.textContent = isLike
            ? (data.liked ? 'Liked' : 'Like')
            : (btn.classList.contains('active') ? 'Saved' : 'Save');
        } else {
          alert(data.error || 'İşlem başarısız.');
        }
      } catch (error) {
        alert('Sunucuya bağlanılamadı.');
      }
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  handleFollowButtons();
  handleActionButtons();
});
