
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');

        userMenuBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('show');
        });

        window.addEventListener('click', (e) => {
            if (!e.target.matches('.user-avatar')) {
                if (userDropdown.classList.contains('show')) {
                    userDropdown.classList.remove('show');
                }
            }
        });

        
        const coverImageBtn = document.getElementById('coverImageBtn');
        const coverImage = document.getElementById('coverImage');

        coverImageBtn.addEventListener('click', () => {
            coverImage.src = 'https://picsum.photos/800/400';
            coverImage.style.display = 'block';
            coverImageBtn.style.display = 'none';
        });

        
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
            });
        });