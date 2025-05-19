/**
 * KEMRI Grant Management Department
 * Search Functionality
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
 * Perform search across site content
 */
function performSearch(query, category = 'all') {
    const resultsContainer = document.getElementById('search-results-container');
    const paginationContainer = document.getElementById('search-pagination');
    
    if (!resultsContainer) return;
    
    // Show loading indicator
    resultsContainer.innerHTML = '<p class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</p>';
    
    // In a real implementation, you would fetch search results from a server-side API
    // For demonstration purposes, we'll simulate search with hardcoded content
    setTimeout(() => {
        // Get simulated search results
        const results = getSimulatedSearchResults(query, category);
        
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
            const resultsCount = `<p class="results-count">Found ${results.length} result${results.length !== 1 ? 's' : ''} for <strong>"${escapeHTML(query)}"</strong> in ${categoryLabel(category)}</p>`;
            
            // Generate results HTML
            const resultsHTML = results.map(result => `
                <article class="search-result-item">
                    <h3><a href="${result.url}">${result.title}</a></h3>
                    <p class="result-category"><span class="tag">${result.category}</span></p>
                    <p class="result-excerpt">${result.excerpt}</p>
                    <a href="${result.url}" class="btn btn-sm btn-secondary">View</a>
                </article>
            `).join('');
            
            resultsContainer.innerHTML = resultsCount + resultsHTML;
            
            // Add simple pagination if we have many results
            if (results.length > 10 && paginationContainer) {
                paginationContainer.innerHTML = `
                    <div class="pagination">
                        <span class="pagination-info">Page 1 of 1</span>
                        <button class="btn btn-sm btn-secondary pagination-prev" disabled>Previous</button>
                        <button class="btn btn-sm btn-secondary pagination-next" disabled>Next</button>
                    </div>
                `;
            } else if (paginationContainer) {
                paginationContainer.innerHTML = '';
            }
        }
    }, 500); // Simulate network delay
}

/**
 * Get simulated search results based on query and category
 */
function getSimulatedSearchResults(query, category) {
    query = query.toLowerCase();
    
    // Sample content for search results
    const allContent = [
        {
            title: 'Grant Management Department',
            url: 'index.html',
            category: 'Pages',
            content: 'The Grant Management Department (GMD) at KEMRI is dedicated to supporting researchers in securing and managing grants for scientific research. Under the leadership of the Director of Scientific Programmes, Partnerships and Grants Management, our team of experienced professionals provides guidance throughout the entire grant lifecycle.'
        },
        {
            title: 'Pre-Award Unit',
            url: 'units.html#pre-award',
            category: 'Pages',
            content: 'The Pre-Award, Contracts & Compliance Unit is responsible for supporting KEMRI researchers in identifying funding opportunities, developing proposals, and submitting grant applications. Our experienced team provides guidance on funder requirements, budget preparation, and compliance with institutional and funder policies.'
        },
        {
            title: 'Grants Management Unit',
            url: 'units.html#grants-management',
            category: 'Pages',
            content: 'The Grants Management Unit oversees the financial administration, procurement, and human resource management of awarded grants. We ensure compliance with funder requirements, proper expenditure of funds, and timely reporting.'
        },
        {
            title: 'Partnerships & Resource Mobilisation Unit',
            url: 'units.html#partnerships',
            category: 'Pages',
            content: 'The Partnerships & Resource Mobilisation Unit facilitates collaborations between KEMRI researchers and other institutions, both locally and internationally. We identify potential funding sources, build relationships with funding agencies, and support strategic partnerships.'
        },
        {
            title: 'Monitoring & Evaluation Unit',
            url: 'units.html#monitoring',
            category: 'Pages',
            content: 'The Monitoring & Evaluation Unit tracks project implementation, reviews progress against objectives, and evaluates research outcomes. We ensure that funded projects meet their deliverables and comply with reporting requirements.'
        },
        {
            title: 'Organizational Structure',
            url: 'organization.html',
            category: 'Pages',
            content: 'The Grant Management Department operates under the leadership of the Director of Scientific Programmes, Partnerships and Grants Management. Our department is structured to provide comprehensive support across the entire grant lifecycle.'
        },
        {
            title: 'Contact Information',
            url: 'contact.html',
            category: 'Pages',
            content: 'Contact the Grant Management Department at KEMRI. P.O. Box 54840-00200, Nairobi, Kenya. Phone: +254 20 2722541. Email: gmd@kemri.org.'
        },
        {
            title: 'Concept Note Template',
            url: 'downloads/concept_note_template.docx',
            category: 'Resources',
            content: 'Download our concept note template for preparing research proposals. This template includes sections for project title, principal investigator, introduction, research question, objectives, methodology, expected outcomes, budget estimate, and timeline.'
        },
        {
            title: 'Full Proposal Template',
            url: 'downloads/full_proposal_template.docx',
            category: 'Resources',
            content: 'Download our comprehensive research proposal template. This template includes detailed sections for all aspects of a full grant application, including literature review, methodology, ethical considerations, budget, and dissemination plan.'
        },
        {
            title: 'Budget Template',
            url: 'downloads/budget_template.xlsx',
            category: 'Resources',
            content: 'Download our budget template for research grant applications. This Excel spreadsheet includes categories for personnel costs, equipment, supplies, travel, patient costs, and other direct and indirect costs.'
        },
        {
            title: 'Progress Report Template',
            url: 'downloads/progress_report_template.docx',
            category: 'Resources',
            content: 'Download our progress report template for ongoing research projects. This template helps researchers document their progress against objectives, research activities completed, preliminary findings, and budget expenditure.'
        },
        {
            title: 'Research Ethics Policy',
            url: 'downloads/research_ethics_policy.pdf',
            category: 'Resources',
            content: 'Download our Research Ethics Policy document. This policy outlines ethical principles, review processes, informed consent requirements, privacy considerations, and reporting procedures for research conducted at KEMRI.'
        },
        {
            title: 'Grant Management Policy',
            url: 'downloads/grant_management_policy.pdf',
            category: 'Resources',
            content: 'Download our Grant Management Policy document. This policy outlines roles and responsibilities, pre-award and post-award procedures, financial management, compliance requirements, and monitoring processes.'
        },
        {
            title: 'Pre-Award Standard Operating Procedure',
            url: 'downloads/pre_award_sop.pdf',
            category: 'Resources',
            content: 'Download our Pre-Award Standard Operating Procedure. This document outlines the processes for identifying funding opportunities, developing concept notes and proposals, internal review, submission, and award acceptance.'
        },
        {
            title: 'Post-Award Standard Operating Procedure',
            url: 'downloads/post_award_sop.pdf',
            category: 'Resources',
            content: 'Download our Post-Award Standard Operating Procedure. This document outlines the processes for award setup, financial management, procurement, human resources management, project monitoring, modifications, and closeout.'
        },
        {
            title: 'Upcoming Grant Opportunity: Health Systems Research',
            url: 'news.html#opportunity1',
            category: 'News & Opportunities',
            content: 'The Global Health Systems Research Initiative has announced a new funding opportunity for research on health systems strengthening in Sub-Saharan Africa. Application deadline: June 30, 2023.'
        },
        {
            title: 'Workshop: Grant Writing for Early Career Researchers',
            url: 'news.html#workshop1',
            category: 'News & Opportunities',
            content: 'The Grant Management Department will host a workshop on grant writing for early career researchers on July 15-16, 2023. Registration is open until July 5.'
        },
        {
            title: 'New Partnership with Oxford University',
            url: 'news.html#partnership1',
            category: 'News & Opportunities',
            content: 'KEMRI has established a new partnership with Oxford University for collaborative research on infectious diseases. This partnership will create new funding opportunities for KEMRI researchers.'
        },
    ];
    
    // Filter results based on query and category
    return allContent
        .filter(item => {
            // Search in title and content
            const matchesQuery = item.title.toLowerCase().includes(query) || 
                               item.content.toLowerCase().includes(query);
            
            // Filter by category if specified
            const matchesCategory = category === 'all' || 
                                 item.category.toLowerCase() === category.toLowerCase();
            
            return matchesQuery && matchesCategory;
        })
        .map(item => {
            // Create excerpt highlighting the search term
            let excerpt = item.content;
            
            // If content is long, try to create an excerpt around the search term
            if (excerpt.length > 200) {
                const index = excerpt.toLowerCase().indexOf(query);
                if (index >= 0) {
                    const start = Math.max(0, index - 80);
                    const end = Math.min(excerpt.length, index + query.length + 80);
                    excerpt = (start > 0 ? '...' : '') + 
                             excerpt.substring(start, end) + 
                             (end < excerpt.length ? '...' : '');
                } else {
                    excerpt = excerpt.substring(0, 200) + '...';
                }
            }
            
            // Highlight the search term
            excerpt = excerpt.replace(new RegExp(query, 'gi'), match => `<mark>${match}</mark>`);
            
            return {
                title: item.title,
                url: item.url,
                category: item.category,
                excerpt: excerpt
            };
        });
}

/**
 * Initialize cookie consent banner
 */
function initCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('cookieConsent');
    
    if (cookieConsent) {
        if (consentChoice) {
            // Hide banner if choice already made
            cookieConsent.style.display = 'none';
        } else {
            // Show banner with animation
            setTimeout(() => {
                cookieConsent.classList.add('active');
            }, 1000);
            
            // Set up event listeners for buttons
            if (acceptBtn) {
                acceptBtn.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'accepted');
                    cookieConsent.classList.remove('active');
                    setTimeout(() => {
                        cookieConsent.style.display = 'none';
                    }, 300);
                    
                    // Here you would initialize analytics, etc.
                });
            }
            
            if (declineBtn) {
                declineBtn.addEventListener('click', function() {
                    localStorage.setItem('cookieConsent', 'declined');
                    cookieConsent.classList.remove('active');
                    setTimeout(() => {
                        cookieConsent.style.display = 'none';
                    }, 300);
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
        // Get stored language preference
        const currentLang = localStorage.getItem('language') || 'en';
        languageSelect.value = currentLang;
        
        // Set up event listener for language change
        languageSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            localStorage.setItem('language', selectedLang);
            
            // In a real implementation, you would reload the page or
            // dynamically translate content. For now, we'll just simulate.
            alert(`Language preference saved as ${selectedLang === 'en' ? 'English' : 'Swahili'}. In a production environment, the site would reload with translated content.`);
        });
    }
}

/**
 * Helper function to escape HTML for safe insertion
 */
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, match => {
        const escape = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escape[match];
    });
}

/**
 * Get category label for display
 */
function categoryLabel(category) {
    switch (category) {
        case 'pages':
            return 'Pages';
        case 'resources':
            return 'Resources';
        case 'news':
            return 'News & Opportunities';
        case 'all':
        default:
            return 'All Categories';
    }
}

/**
 * Simple search functionality for KEMRI GMD website
 */
document.addEventListener("DOMContentLoaded", function() {
  // Initialize search forms
  const searchForms = document.querySelectorAll("form[role=search]");
  searchForms.forEach(form => {
    form.addEventListener("submit", function(e) {
      const searchInput = this.querySelector("input[type=search]");
      if (!searchInput.value.trim()) {
        e.preventDefault();
      }
    });
  });
}); 