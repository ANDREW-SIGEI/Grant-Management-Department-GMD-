/**
 * Resource and news listing filter functionality
 * Enables filtering elements by category, type, and search terms
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize filtering on resources page
  if (document.querySelector('.resource-section')) {
    initializeResourceFilters();
  }
  
  // Initialize filtering on news page
  if (document.querySelector('.news-section')) {
    initializeNewsFilters();
  }
  
  /**
   * Initialize filter functionality for resources page
   */
  function initializeResourceFilters() {
    // Add filter UI if it doesn't exist
    addResourceFilterUI();
    
    // Get all resource cards
    const resources = document.querySelectorAll('.resource-card');
    
    // Set up event listeners for filter inputs
    const categoryFilter = document.getElementById('resource-category');
    const typeFilter = document.getElementById('resource-type');
    const searchInput = document.getElementById('resource-search');
    const resetButton = document.getElementById('reset-filters');
    
    // Apply filters on change
    if (categoryFilter) categoryFilter.addEventListener('change', applyResourceFilters);
    if (typeFilter) typeFilter.addEventListener('change', applyResourceFilters);
    if (searchInput) {
      // Add debouncing for search input to improve performance
      let debounceTimer;
      searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(applyResourceFilters, 300);
      });
    }
    
    // Reset filters on button click
    if (resetButton) {
      resetButton.addEventListener('click', function() {
        if (categoryFilter) categoryFilter.value = 'all';
        if (typeFilter) typeFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        applyResourceFilters();
      });
    }
    
    /**
     * Apply filters to resource cards
     */
    function applyResourceFilters() {
      // Get filter values
      const category = categoryFilter ? categoryFilter.value.toLowerCase() : 'all';
      const type = typeFilter ? typeFilter.value.toLowerCase() : 'all';
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      
      let visibleCount = 0;
      
      // Loop through all resources
      resources.forEach(resource => {
        // Get resource data attributes
        const resourceCategory = resource.dataset.category ? resource.dataset.category.toLowerCase() : '';
        const resourceType = resource.dataset.type ? resource.dataset.type.toLowerCase() : '';
        const resourceTitle = resource.querySelector('h3') ? resource.querySelector('h3').textContent.toLowerCase() : '';
        const resourceDescription = resource.querySelector('p') ? resource.querySelector('p').textContent.toLowerCase() : '';
        
        // Check if matches category filter
        const categoryMatch = category === 'all' || resourceCategory.includes(category);
        
        // Check if matches type filter
        const typeMatch = type === 'all' || resourceType.includes(type);
        
        // Check if matches search term
        const searchMatch = searchTerm === '' || 
                           resourceTitle.includes(searchTerm) || 
                           resourceDescription.includes(searchTerm);
        
        // Show or hide based on filter matches
        if (categoryMatch && typeMatch && searchMatch) {
          resource.style.display = '';
          visibleCount++;
        } else {
          resource.style.display = 'none';
        }
      });
      
      // Update results count
      updateFilterResults(visibleCount, resources.length);
    }
    
    /**
     * Add filter UI to resource page
     */
    function addResourceFilterUI() {
      // Check if filter panel already exists
      if (document.querySelector('.resource-filters')) {
        return;
      }
      
      // Create filter panel
      const filterPanel = document.createElement('div');
      filterPanel.className = 'resource-filters';
      filterPanel.innerHTML = `
        <div class="filter-container">
          <div class="filter-row">
            <div class="filter-group">
              <label for="resource-category">Category:</label>
              <select id="resource-category">
                <option value="all">All Categories</option>
                <option value="forms">Forms & Templates</option>
                <option value="policies">Policies & Guidelines</option>
                <option value="procedures">Standard Operating Procedures</option>
                <option value="tools">Tools & Resources</option>
                <option value="partner">Partner Resources</option>
              </select>
            </div>
            <div class="filter-group">
              <label for="resource-type">Type:</label>
              <select id="resource-type">
                <option value="all">All Types</option>
                <option value="template">Template</option>
                <option value="guide">Guide</option>
                <option value="policy">Policy</option>
                <option value="sop">SOP</option>
                <option value="form">Form</option>
                <option value="tool">Tool</option>
              </select>
            </div>
            <div class="filter-group search-group">
              <label for="resource-search">Search:</label>
              <input type="text" id="resource-search" placeholder="Search resources...">
            </div>
          </div>
          <div class="filter-actions">
            <button id="reset-filters" class="btn btn-outline">Reset Filters</button>
          </div>
        </div>
        <div class="filter-results" id="filter-results"></div>
      `;
      
      // Add data attributes to resource cards for filtering
      const resources = document.querySelectorAll('.resource-card');
      resources.forEach(resource => {
        // Extract category from section ID
        const section = resource.closest('.resource-section');
        const sectionId = section ? section.id : '';
        
        // Set data attributes if not already present
        if (!resource.dataset.category) {
          resource.dataset.category = sectionId;
        }
        
        // Determine type from icon or class
        let type = 'resource';
        if (resource.querySelector('.fas.fa-file-word')) {
          type = 'template';
        } else if (resource.querySelector('.fas.fa-file-pdf')) {
          type = resource.textContent.toLowerCase().includes('policy') ? 'policy' : 
                 resource.textContent.toLowerCase().includes('sop') ? 'sop' : 'guide';
        } else if (resource.querySelector('.fas.fa-file-excel')) {
          type = 'tool';
        }
        
        if (!resource.dataset.type) {
          resource.dataset.type = type;
        }
      });
      
      // Insert filter panel before the first resource section
      const firstSection = document.querySelector('.resource-section');
      if (firstSection && firstSection.parentNode) {
        firstSection.parentNode.insertBefore(filterPanel, firstSection);
        
        // Add styles if needed
        if (!document.querySelector('style#resource-filter-styles')) {
          const style = document.createElement('style');
          style.id = 'resource-filter-styles';
          style.textContent = `
            .resource-filters {
              background: #f5f5f5;
              padding: 1.5rem;
              border-radius: 8px;
              margin-bottom: 2rem;
            }
            
            .filter-container {
              display: flex;
              flex-direction: column;
              gap: 1rem;
            }
            
            .filter-row {
              display: flex;
              flex-wrap: wrap;
              gap: 1rem;
            }
            
            .filter-group {
              flex: 1;
              min-width: 200px;
            }
            
            .filter-group label {
              display: block;
              margin-bottom: 0.5rem;
              font-weight: 500;
            }
            
            .filter-group select,
            .filter-group input {
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            
            .filter-actions {
              display: flex;
              justify-content: flex-end;
            }
            
            .filter-results {
              margin-top: 1rem;
              font-style: italic;
              color: #666;
            }
            
            @media (max-width: 768px) {
              .filter-row {
                flex-direction: column;
              }
            }
          `;
          document.head.appendChild(style);
        }
      }
    }
  }
  
  /**
   * Initialize filter functionality for news page
   */
  function initializeNewsFilters() {
    // Get filter elements
    const categoryFilter = document.getElementById('news-category');
    const yearFilter = document.getElementById('news-year');
    const searchInput = document.querySelector('.news-filters .search-input');
    const filterButton = document.querySelector('.news-filters .filter-btn');
    const resetButton = document.querySelector('.news-filters .reset-btn');
    
    // Get all news cards
    const newsItems = document.querySelectorAll('.news-card');
    
    // Apply filters when filter button is clicked
    if (filterButton) {
      filterButton.addEventListener('click', applyNewsFilters);
    }
    
    // Reset filters when reset button is clicked
    if (resetButton) {
      resetButton.addEventListener('click', function() {
        if (categoryFilter) categoryFilter.value = 'all';
        if (yearFilter) yearFilter.value = 'all';
        if (searchInput) searchInput.value = '';
        applyNewsFilters();
      });
    }
    
    /**
     * Apply filters to news items
     */
    function applyNewsFilters() {
      // Get filter values
      const category = categoryFilter ? categoryFilter.value.toLowerCase() : 'all';
      const year = yearFilter ? yearFilter.value : 'all';
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      
      let visibleCount = 0;
      
      // Loop through all news items
      newsItems.forEach(item => {
        // Get item data
        const itemCategory = item.classList.contains('opportunity') ? 'funding-opportunities' :
                            item.classList.contains('event') ? 'events' :
                            item.classList.contains('announcement') ? 'announcements' :
                            item.classList.contains('success-story') ? 'success-stories' : '';
        
        const itemYear = item.querySelector('.news-date .year') ? 
                        item.querySelector('.news-date .year').textContent : '';
                        
        const itemTitle = item.querySelector('h3') ? 
                         item.querySelector('h3').textContent.toLowerCase() : '';
                         
        const itemContent = item.querySelector('p') ? 
                           item.querySelector('p').textContent.toLowerCase() : '';
        
        // Check if matches filters
        const categoryMatch = category === 'all' || itemCategory === category;
        const yearMatch = year === 'all' || itemYear === year;
        const searchMatch = searchTerm === '' || 
                           itemTitle.includes(searchTerm) || 
                           itemContent.includes(searchTerm);
        
        // Show or hide based on filter matches
        if (categoryMatch && yearMatch && searchMatch) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Update filter results message
      let resultsInfo = document.querySelector('.search-results-info');
      if (!resultsInfo) {
        resultsInfo = document.createElement('div');
        resultsInfo.className = 'search-results-info';
        const newsGrid = document.querySelector('.news-grid');
        if (newsGrid && newsGrid.parentNode) {
          newsGrid.parentNode.insertBefore(resultsInfo, newsGrid);
        }
      }
      
      if (visibleCount === 0) {
        resultsInfo.textContent = 'No items found matching your criteria. Try changing your filters.';
      } else {
        resultsInfo.textContent = `Showing ${visibleCount} item${visibleCount !== 1 ? 's' : ''} matching your criteria.`;
      }
    }
  }
  
  /**
   * Update filter results message
   * @param {number} visibleCount - Number of visible items
   * @param {number} totalCount - Total number of items
   */
  function updateFilterResults(visibleCount, totalCount) {
    const resultsContainer = document.getElementById('filter-results');
    if (!resultsContainer) return;
    
    if (visibleCount === 0) {
      resultsContainer.textContent = 'No resources found matching your criteria. Try changing your filters.';
    } else if (visibleCount === totalCount) {
      resultsContainer.textContent = `Showing all ${totalCount} resources.`;
    } else {
      resultsContainer.textContent = `Showing ${visibleCount} of ${totalCount} resources.`;
    }
  }
}); 