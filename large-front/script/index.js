
      document.querySelectorAll('.follow-topic-btn').forEach(btn => {
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

      
      document.querySelectorAll('.action-button').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('active');
          
         
          const span = btn.querySelector('span');
          if (span.textContent !== 'Save') {
            let count = parseInt(span.textContent);
            if (btn.classList.contains('active')) {
              count++;
            } else {
              count--;
            }
            span.textContent = count;
          } else {
            
            span.textContent = btn.classList.contains('active') ? 'Saved' : 'Save';
          }
        });
      });