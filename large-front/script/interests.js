
        
        document.querySelectorAll('.interest-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
            });
        });

        
        document.querySelectorAll('.follow-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.textContent === 'Follow') {
                    btn.textContent = 'Following';
                    btn.style.background = '#1a8917';
                    btn.style.color = 'white';
                } else {
                    btn.textContent = 'Follow';
                    btn.style.background = 'none';
                    btn.style.color = '#1a8917';
                }
            });
        });