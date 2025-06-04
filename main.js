// Cookie Consent Banner
function showCookieConsent() {
  if (!localStorage.getItem('cookieConsent')) {
    const consent = document.createElement('div');
    consent.id = 'cookie-consent';
    consent.innerHTML = `
      <div class="cookie-message" role="dialog" aria-live="polite">
        This site uses cookies for basic functionality only. <a href="privacy.html">Learn more</a>.
        <button id="accept-cookies">Accept</button>
      </div>
    `;
    document.body.appendChild(consent);
    document.getElementById('accept-cookies').onclick = function() {
      localStorage.setItem('cookieConsent', 'true');
      consent.remove();
    };
  }
}

// Breadcrumbs
function renderBreadcrumbs() {
  const breadcrumbMap = {
    'index.html': 'Home',
    'news.html': 'News',
    'resources.html': 'Resources',
    'contact.html': 'Contact',
    'units.html': 'Units',
    'search.html': 'Search',
    'privacy.html': 'Privacy Policy',
    // Add more as needed
  };
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const container = document.getElementById('breadcrumbs');
  if (container && breadcrumbMap[path]) {
    container.innerHTML = `<nav aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li>${path !== 'index.html' ? `<li aria-current="page">${breadcrumbMap[path]}</li>` : ''}</ol></nav>`;
  }
}

// Function to toggle template content visibility with animation
function toggleContent(contentId) {
    const content = document.getElementById(contentId);
    const allContents = document.querySelectorAll('.template-content');
    const button = document.querySelector(`[onclick="toggleContent('${contentId}')"]`);
    
    if (content) {
        // Close all other open content sections
        allContents.forEach(item => {
            if (item.id !== contentId && item.classList.contains('active')) {
                item.classList.remove('active');
                item.style.maxHeight = null;
                const otherButton = document.querySelector(`[onclick="toggleContent('${item.id}')"]`);
                if (otherButton) {
                    otherButton.classList.remove('active');
                    otherButton.querySelector('i').classList.remove('fa-eye-slash');
                    otherButton.querySelector('i').classList.add('fa-eye');
                }
            }
        });

        // Toggle the clicked content
        content.classList.toggle('active');
        if (content.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + "px";
            if (button) {
                button.classList.add('active');
                button.querySelector('i').classList.remove('fa-eye');
                button.querySelector('i').classList.add('fa-eye-slash');
            }
        } else {
            content.style.maxHeight = null;
            if (button) {
                button.classList.remove('active');
                button.querySelector('i').classList.remove('fa-eye-slash');
                button.querySelector('i').classList.add('fa-eye');
            }
        }
    }
}

// Initialize all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Show cookie consent
    showCookieConsent();
    
    // Render breadcrumbs
    renderBreadcrumbs();
    
    // Initialize content sections
    const contents = document.querySelectorAll('.template-content');
    contents.forEach(content => {
        content.style.maxHeight = null;
    });

    // Add click event listeners to FAQ questions
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other questions
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current question
            this.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
}); 