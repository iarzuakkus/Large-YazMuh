        
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