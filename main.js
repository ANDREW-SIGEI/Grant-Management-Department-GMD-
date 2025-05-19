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

document.addEventListener('DOMContentLoaded', showCookieConsent);

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
document.addEventListener('DOMContentLoaded', renderBreadcrumbs); 