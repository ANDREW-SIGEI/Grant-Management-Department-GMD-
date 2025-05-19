/**
 * Image optimization and lazy loading for KEMRI GMD website
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize lazy loading for images
  initLazyLoading();
  
  // Make sure images have proper dimensions
  ensureImageDimensions();
  
  /**
   * Initialize lazy loading for images
   */
  function initLazyLoading() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach(img => {
        // Skip small images or logo
        if (img.classList.contains('logo') || img.classList.contains('icon')) {
          return;
        }
        
        img.setAttribute('loading', 'lazy');
      });
    } else {
      // Native lazy loading not supported, implement custom solution
      const lazyImages = document.querySelectorAll('img:not(.logo):not(.icon)');
      
      // Create IntersectionObserver if supported
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              const src = img.getAttribute('data-src');
              
              if (src) {
                img.src = src;
                img.removeAttribute('data-src');
              }
              
              imageObserver.unobserve(img);
            }
          });
        });
        
        lazyImages.forEach(function(img) {
          // Save original src to data-src and set placeholder
          if (!img.hasAttribute('data-src') && img.src) {
            img.setAttribute('data-src', img.src);
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
            img.classList.add('lazy-loading');
            
            imageObserver.observe(img);
          }
        });
      } else {
        // Fallback for browsers without IntersectionObserver
        // Simply load all images
        lazyImages.forEach(function(img) {
          if (img.hasAttribute('data-src')) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
          }
        });
      }
    }
  }
  
  /**
   * Ensure all images have width and height attributes to avoid layout shifts
   */
  function ensureImageDimensions() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    
    images.forEach(img => {
      // Skip images that are already loaded with dimensions
      if (img.complete && img.naturalWidth > 0) {
        if (!img.hasAttribute('width')) {
          img.setAttribute('width', img.naturalWidth);
        }
        
        if (!img.hasAttribute('height')) {
          img.setAttribute('height', img.naturalHeight);
        }
      } else {
        // For images not yet loaded, add event listener
        img.addEventListener('load', function() {
          if (!img.hasAttribute('width')) {
            img.setAttribute('width', img.naturalWidth);
          }
          
          if (!img.hasAttribute('height')) {
            img.setAttribute('height', img.naturalHeight);
          }
        });
      }
    });
  }
}); 