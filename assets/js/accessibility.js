/**
 * Accessibility enhancements for KEMRI GMD website
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add keyboard navigation support
  enhanceKeyboardNavigation();
  
  // Add ARIA labels where needed
  enhanceARIASupport();
  
  /**
   * Improve keyboard navigation
   */
  function enhanceKeyboardNavigation() {
    // Enhance skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('keydown', function(e) {
        // Handle Enter key
        if (e.key === 'Enter') {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus();
          }
        }
      });
    }
    
    // Add focus indicators to navigation items
    const navItems = document.querySelectorAll('nav a');
    navItems.forEach(item => {
      // Add focus class on key navigation
      item.addEventListener('keyup', function() {
        this.classList.add('keyboard-focus');
      });
      
      // Remove focus class when using mouse
      item.addEventListener('mousedown', function() {
        this.classList.remove('keyboard-focus');
      });
    });
    
    // Ensure all interactive elements are focusable
    ensureFocusableElements();
  }
  
  /**
   * Add missing ARIA attributes and improve screen reader support
   */
  function enhanceARIASupport() {
    // Add appropriate roles to landmarks
    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    
    const main = document.querySelector('main');
    if (main && !main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
    
    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
    
    const nav = document.querySelector('nav');
    if (nav && !nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
      
      // Add aria-label if missing
      if (!nav.hasAttribute('aria-label')) {
        nav.setAttribute('aria-label', 'Main Navigation');
      }
    }
    
    // Add aria-current to indicate current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || 
          (currentPath.endsWith('/') && href === 'index.html') ||
          (currentPath === '/' && href === 'index.html')) {
        link.setAttribute('aria-current', 'page');
      }
    });
    
    // Ensure form elements have labels
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
      // Skip elements with existing labels
      if (element.id && document.querySelector(`label[for="${element.id}"]`)) {
        return;
      }
      
      // Skip elements with aria-label
      if (element.hasAttribute('aria-label')) {
        return;
      }
      
      // Add aria-label based on placeholder
      if (element.hasAttribute('placeholder')) {
        element.setAttribute('aria-label', element.getAttribute('placeholder'));
      }
    });
  }
  
  /**
   * Ensure all interactive elements can be focused
   */
  function ensureFocusableElements() {
    // Find buttons without type
    const buttons = document.querySelectorAll('button:not([type])');
    buttons.forEach(button => {
      button.setAttribute('type', 'button');
    });
    
    // Make sure buttons with icons have accessible text
    const iconButtons = document.querySelectorAll('button i[class*="fa-"], a i[class*="fa-"]');
    iconButtons.forEach(iconEl => {
      const button = iconEl.parentElement;
      if (!button.textContent.trim() && !button.hasAttribute('aria-label')) {
        // Try to infer a label from title or class
        let label = button.getAttribute('title');
        
        if (!label) {
          // Try to guess from icon class
          const iconClass = iconEl.className;
          if (iconClass.includes('search')) {
            label = 'Search';
          } else if (iconClass.includes('menu')) {
            label = 'Menu';
          } else if (iconClass.includes('arrow-up')) {
            label = 'Back to top';
          }
        }
        
        if (label) {
          button.setAttribute('aria-label', label);
        }
      }
    });
  }
}); 