/**
 * KEMRI Grant Management Department
 * Search Functionality - API Integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initSearch();
    
    // Initialize cookie consent
    initCookieConsent();
    
    // Initialize language switcher
    initLanguageSwitcher();
});

/**
 * Initialize search functionality
 */
function initSearch() {
    // Get search params from URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    const searchCategory = urlParams.get('category') || 'all';
    
    // Set form values based on URL parameters
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('search-category');
    
    if (searchInput && searchQuery) {
        searchInput.value = searchQuery;
    }
    
    if (categorySelect && searchCategory) {
        categorySelect.value = searchCategory;
    }
    
    // If we have a search query, perform search
    if (searchQuery) {
        performSearch(searchQuery, searchCategory);
    }
    
    // Set up event listeners for search form
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            const category = categorySelect.value;
            
            if (query) {
                // Update URL with search parameters
                const url = new URL(window.location);
                url.searchParams.set('q', query);
                url.searchParams.set('category', category);
                window.history.pushState({}, '', url);
                
                performSearch(query, category);
            }
        });
    }
    
    // Set up event listener for category filter change
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            if (searchQuery) {
                performSearch(searchQuery, this.value);
                
                // Update URL with new category
                const url = new URL(window.location);
                url.searchParams.set('category', this.value);
                window.history.pushState({}, '', url);
            }
        });
    }
}

/**
 * Perform search across site content using the API
 */
function performSearch(query, category = 'all') {
    const resultsContainer = document.getElementById('search-results-container');
    const paginationContainer = document.getElementById('search-pagination');
    
    if (!resultsContainer) return;
    
    // Show loading indicator
    resultsContainer.innerHTML = '<p class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</p>';
    
    // Call the API to get search results
    fetch(`/api/search?q=${encodeURIComponent(query)}&category=${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const results = data.data || [];
            
            if (results.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="search-no-results">
                        <p>No results found for <strong>"${escapeHTML(query)}"</strong> in ${categoryLabel(category)}.</p>
                        <div class="search-suggestions">
                            <h3>Suggestions:</h3>
                            <ul>
                                <li>Check your spelling</li>
                                <li>Try more general keywords</li>
                                <li>Try different keywords</li>
                                <li>Try searching in all categories</li>
                            </ul>
                        </div>
                    </div>
                `;
                
                if (paginationContainer) {
                    paginationContainer.innerHTML = '';
                }
            } else {
                // Display search results count
                const resultsCount = `<p class="results-count">Found ${data.count} result${data.count !== 1 ? 's' : ''} for <strong>"${escapeHTML(query)}"</strong> in ${categoryLabel(category)}</p>`;
                
                // Generate results HTML
                const resultsHTML = results.map(result => {
                    // Determine URL based on result type
                    let url = '#';
                    let resultTitle = result.title || 'Untitled';
                    let resultExcerpt = '';
                    let resultCategory = result.category || 'Uncategorized';
                    
                    if (result.type === 'news') {
                        url = `/news.html#${result.slug || result._id}`;
                        resultExcerpt = truncateText(result.content, 150);
                    } else if (result.type === 'resource') {
                        url = `/resources.html#${result._id}`;
                        resultExcerpt = result.description || '';
                    }
                    
                    return `
                        <article class="search-result-item">
                            <h3><a href="${url}">${resultTitle}</a></h3>
                            <p class="result-category"><span class="tag">${resultCategory}</span> <span class="result-type">${result.type}</span></p>
                            <p class="result-excerpt">${resultExcerpt}</p>
                            <a href="${url}" class="btn btn-sm btn-secondary">View</a>
                        </article>
                    `;
                }).join('');
                
                resultsContainer.innerHTML = resultsCount + resultsHTML;
                
                // Add pagination if we have it
                if (data.pagination && data.pagination.pages > 1 && paginationContainer) {
                    const currentPage = data.pagination.page;
                    const totalPages = data.pagination.pages;
                    
                    let paginationHTML = `
                        <div class="pagination">
                            <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>
                            <button class="btn btn-sm btn-secondary pagination-prev" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                    `;
                    
                    // Add page numbers
                    paginationHTML += '<div class="pagination-numbers">';
                    for (let i = 1; i <= totalPages; i++) {
                        if (i === currentPage) {
                            paginationHTML += `<span class="current-page">${i}</span>`;
                        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                            paginationHTML += `<a href="#" data-page="${i}">${i}</a>`;
                        } else if (i === currentPage - 2 || i === currentPage + 2) {
                            paginationHTML += '<span class="ellipsis">...</span>';
                        }
                    }
                    paginationHTML += '</div>';
                    
                    paginationHTML += `
                            <button class="btn btn-sm btn-secondary pagination-next" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
                        </div>
                    `;
                    
                    paginationContainer.innerHTML = paginationHTML;
                    
                    // Add event listeners for pagination
                    const prevButton = paginationContainer.querySelector('.pagination-prev');
                    const nextButton = paginationContainer.querySelector('.pagination-next');
                    const pageLinks = paginationContainer.querySelectorAll('.pagination-numbers a');
                    
                    if (prevButton) {
                        prevButton.addEventListener('click', () => {
                            if (currentPage > 1) {
                                changePage(currentPage - 1);
                            }
                        });
                    }
                    
                    if (nextButton) {
                        nextButton.addEventListener('click', () => {
                            if (currentPage < totalPages) {
                                changePage(currentPage + 1);
                            }
                        });
                    }
                    
                    pageLinks.forEach(link => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            const page = parseInt(e.target.dataset.page);
                            changePage(page);
                        });
                    });
                } else if (paginationContainer) {
                    paginationContainer.innerHTML = '';
                }
            }
        })
        .catch(error => {
            console.error('Error performing search:', error);
            resultsContainer.innerHTML = `
                <div class="search-error">
                    <p>An error occurred while searching. Please try again later.</p>
                </div>
            `;
            
            if (paginationContainer) {
                paginationContainer.innerHTML = '';
            }
        });
}

/**
 * Change to a different page of search results
 */
function changePage(page) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', page);
    
    const url = new URL(window.location);
    url.search = urlParams.toString();
    window.history.pushState({}, '', url);
    
    performSearch(urlParams.get('q'), urlParams.get('category') || 'all');
    
    // Scroll back to top of results
    document.getElementById('search-results-container').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Truncate text to a certain length
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.substr(0, maxLength) + '...';
}

/**
 * Initialize cookie consent functionality
 */
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    
    if (cookieConsent) {
        const hasConsent = localStorage.getItem('cookieConsent');
        
        if (!hasConsent) {
            cookieConsent.classList.add('active');
            
            const acceptButton = document.getElementById('cookie-accept');
            const declineButton = document.getElementById('cookie-decline');
            
            if (acceptButton) {
                acceptButton.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'accepted');
                    cookieConsent.classList.remove('active');
                });
            }
            
            if (declineButton) {
                declineButton.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'declined');
                    cookieConsent.classList.remove('active');
                });
            }
        }
    }
}

/**
 * Initialize language switcher
 */
function initLanguageSwitcher() {
    const languageSelect = document.getElementById('language-select');
    
    if (languageSelect) {
        // Set initial value based on saved preference or default
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            languageSelect.value = savedLanguage;
        }
        
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            localStorage.setItem('preferredLanguage', selectedLanguage);
            
            // In a real implementation, you would update the page content based on selected language
            // For now, we'll just reload the page (in a real implementation, you'd use a translation system)
            window.location.reload();
        });
    }
}

/**
 * Sanitize HTML to prevent XSS
 */
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Get category label for display
 */
function categoryLabel(category) {
    switch(category) {
        case 'all': return 'All Categories';
        case 'news': return 'News';
        case 'resources': return 'Resources';
        default: return category;
    }
} 