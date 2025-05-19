/**
 * Enhanced navigation and scrolling features for KEMRI GMD website
 * Implements smooth scrolling, active link highlighting, and back-to-top button
 */
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for all internal links
  implementSmoothScrolling();
  
  // Highlight active links based on current URL
  highlightActiveLinks();
  
  // Add back-to-top button
  addBackToTopButton();
  
  // Mobile menu toggle functionality
  setupMobileMenu();
  
  /**
   * Implement smooth scrolling for all internal links
   */
  function implementSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Smooth scroll to target
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without reloading page
          history.pushState(null, null, targetId);
        }
      });
    });
  }
  
  /**
   * Highlight active links in navigation based on current URL
   */
  function highlightActiveLinks() {
    const currentPath = window.location.pathname;
    
    // Handle root path
    const isRoot = currentPath === '/' || currentPath === '/index.html';
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
      const linkPath = link.getAttribute('href');
      
      // Remove active class from all links
      link.parentElement.classList.remove('active');
      
      // Check for exact match
      if (linkPath === currentPath) {
        link.parentElement.classList.add('active');
      }
      // Check for root path
      else if (isRoot && linkPath === 'index.html') {
        link.parentElement.classList.add('active');
      }
      // Check if current path starts with link path (for section pages)
      else if (linkPath !== 'index.html' && linkPath !== '/' && currentPath.includes(linkPath)) {
        link.parentElement.classList.add('active');
      }
    });
    
    // Also check for section links within the page
    if (window.location.hash) {
      const currentHash = window.location.hash;
      
      document.querySelectorAll('a[href="' + currentHash + '"]').forEach(link => {
        link.classList.add('active');
      });
    }
  }
  
  /**
   * Add a back-to-top button that appears when scrolled down
   */
  function addBackToTopButton() {
    // Create the button element
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    backToTopBtn.setAttribute('title', 'Back to top');
    
    // Add button to document
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Add styles if not already in CSS
    if (!document.querySelector('style#back-to-top-styles')) {
      const style = document.createElement('style');
      style.id = 'back-to-top-styles';
      style.textContent = `
        .back-to-top {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background-color: #0056b3;
          color: white;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        
        .back-to-top.show {
          opacity: 1;
          visibility: visible;
        }
        
        .back-to-top:hover {
          background-color: #003d7a;
          transform: translateY(-3px);
        }
        
        .back-to-top:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0,86,179,0.3);
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  /**
   * Set up mobile menu toggle functionality
   */
  function setupMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle menu visibility
        navMenu.classList.toggle('show');
        
        // Update ARIA attributes
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle button appearance
        menuToggle.classList.toggle('active');
      });
      
      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        const navMenu = document.querySelector('.nav-menu');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (navMenu.classList.contains('show') && 
            !navMenu.contains(event.target) && 
            !menuToggle.contains(event.target)) {
          navMenu.classList.remove('show');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }
}); 