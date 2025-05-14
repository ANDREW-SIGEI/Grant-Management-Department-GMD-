/**
 * KEMRI Grant Management Department
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    initMobileNav();
    
    // FAQ Accordions
    initFaqAccordions();
    
    // Form Submission Handling
    initFormHandlers();
    
    // Filters
    initFilters();

    // Active nav highlighting
    highlightCurrentPage();

    // Smooth scrolling for anchor links
    initSmoothScroll();
});

/**
 * Initialize Mobile Navigation
 */
function initMobileNav() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (
                navMenu.classList.contains('active') && 
                !navMenu.contains(event.target) && 
                !mobileMenuToggle.contains(event.target)
            ) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });

        // Handle submenu toggling on mobile
        const hasSubmenu = document.querySelectorAll('.has-submenu');
        hasSubmenu.forEach(item => {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.submenu');
            
            if (link && submenu) {
                // Add toggle button for mobile
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'submenu-toggle';
                toggleBtn.innerHTML = '<span class="sr-only">Toggle Submenu</span><i class="fas fa-chevron-down"></i>';
                link.parentNode.insertBefore(toggleBtn, link.nextSibling);
                
                toggleBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    item.classList.toggle('submenu-active');
                    submenu.style.display = item.classList.contains('submenu-active') ? 'block' : 'none';
                    toggleBtn.querySelector('i').className = item.classList.contains('submenu-active') ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
                });
            }
        });
    }
}

/**
 * Initialize FAQ Accordions
 */
function initFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            // Initially hide all answers
            answer.style.display = 'none';
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.display = 'none';
                            otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                        }
                    }
                });
                
                // Toggle current FAQ
                if (isActive) {
                    item.classList.remove('active');
                    answer.style.display = 'none';
                    question.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    answer.style.display = 'block';
                    question.setAttribute('aria-expanded', 'true');
                }
            });

            // Accessibility enhancements
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', 'faq-answer-' + Array.from(faqItems).indexOf(item));
            answer.setAttribute('id', 'faq-answer-' + Array.from(faqItems).indexOf(item));
        }
    });
}

/**
 * Initialize Form Handlers
 */
function initFormHandlers() {
    const contactForm = document.getElementById('contact-form');
    const newsletterForm = document.querySelector('.newsletter-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Comprehensive validation
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    highlightField(field, true, 'This field is required');
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    isValid = false;
                    highlightField(field, true, 'Please enter a valid email address');
                } else if (field.id === 'phone' && !isValidPhone(field.value)) {
                    isValid = false;
                    highlightField(field, true, 'Please enter a valid phone number');
                } else {
                    highlightField(field, false);
                }
            });
            
            if (isValid) {
                // Prepare form data for submission
                const formData = new FormData(contactForm);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });
                
                // Simulate API call (in production, replace with actual API endpoint)
                // For demonstration purposes only
                setTimeout(() => {
                    showFormSuccess(contactForm, 'Thank you for your message. We will get back to you within 2 business days.');
                    contactForm.reset();
                }, 1000);
                
                // Show loading indicator
                const submitBtn = contactForm.querySelector('[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    
                    // Reset button after simulated submission
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }, 1000);
                }
            } else {
                showFormError(contactForm, 'Please fix the errors in the form before submitting.');
            }
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Validate email
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const consentCheckbox = newsletterForm.querySelector('input[type="checkbox"]');
            
            let isValid = true;
            
            if (!emailInput || !emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                isValid = false;
                highlightField(emailInput, true, 'Please enter a valid email address');
            } else {
                highlightField(emailInput, false);
            }
            
            if (consentCheckbox && !consentCheckbox.checked) {
                isValid = false;
                highlightField(consentCheckbox, true, 'You must agree to receive the newsletter');
            } else if (consentCheckbox) {
                highlightField(consentCheckbox, false);
            }
            
            if (isValid) {
                // Prepare newsletter subscription data
                const email = emailInput.value.trim();
                
                // Simulate API call for newsletter subscription
                setTimeout(() => {
                    showFormSuccess(newsletterForm, 'Thank you for subscribing to our newsletter!');
                    newsletterForm.reset();
                }, 800);
                
                // Show loading state
                const submitBtn = newsletterForm.querySelector('[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                    }, 800);
                }
            } else {
                showFormError(newsletterForm, 'Please fix the errors before subscribing.');
            }
        });
    }
}

/**
 * Initialize Project and News Filters
 */
function initFilters() {
    // Project Filters
    const projectFilters = document.querySelector('.project-filters');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (projectFilters && projectItems.length > 0) {
        const filterBtn = projectFilters.querySelector('.filter-btn');
        const resetBtn = projectFilters.querySelector('.reset-btn');
        const searchInput = projectFilters.querySelector('.search-input');
        const searchBtn = projectFilters.querySelector('.search-btn');
        
        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                // Get filter values
                const researchArea = document.getElementById('research-area').value;
                const funder = document.getElementById('funder').value;
                const year = document.getElementById('year').value;
                
                // Apply filters to project items
                projectItems.forEach(item => {
                    const itemResearchArea = item.getAttribute('data-research-area');
                    const itemFunder = item.getAttribute('data-funder');
                    const itemYear = item.getAttribute('data-year');
                    
                    const matchesResearchArea = researchArea === 'all' || itemResearchArea === researchArea;
                    const matchesFunder = funder === 'all' || itemFunder === funder;
                    const matchesYear = year === 'all' || itemYear === year;
                    
                    if (matchesResearchArea && matchesFunder && matchesYear) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                updateFilterResults(projectItems);
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                // Reset all select elements to their first option
                const selects = projectFilters.querySelectorAll('select');
                selects.forEach(select => {
                    select.selectedIndex = 0;
                });
                
                // Clear search input
                if (searchInput) {
                    searchInput.value = '';
                }
                
                // Show all projects
                projectItems.forEach(item => {
                    item.style.display = '';
                });
                
                updateFilterResults(projectItems);
            });
        }
        
        if (searchBtn && searchInput) {
            const performSearch = function() {
                const searchTerm = searchInput.value.trim().toLowerCase();
                
                if (searchTerm) {
                    projectItems.forEach(item => {
                        const title = item.querySelector('h3').textContent.toLowerCase();
                        const description = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : '';
                        
                        if (title.includes(searchTerm) || description.includes(searchTerm)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    updateFilterResults(projectItems);
                }
            };
            
            searchBtn.addEventListener('click', performSearch);
            
            // Allow search on Enter key
            searchInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }
    
    // News Filters
    const newsFilters = document.querySelector('.news-filters');
    const newsItems = document.querySelectorAll('.news-item');
    
    if (newsFilters && newsItems.length > 0) {
        const filterBtn = newsFilters.querySelector('.filter-btn');
        const resetBtn = newsFilters.querySelector('.reset-btn');
        const searchInput = newsFilters.querySelector('.search-input');
        const searchBtn = newsFilters.querySelector('.search-btn');
        
        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                const category = document.getElementById('news-category').value;
                const year = document.getElementById('news-year').value;
                
                // Apply filters to news items
                newsItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    const itemYear = item.getAttribute('data-year');
                    
                    const matchesCategory = category === 'all' || itemCategory === category;
                    const matchesYear = year === 'all' || itemYear === year;
                    
                    if (matchesCategory && matchesYear) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                updateFilterResults(newsItems);
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                const selects = newsFilters.querySelectorAll('select');
                selects.forEach(select => {
                    select.selectedIndex = 0;
                });
                
                if (searchInput) {
                    searchInput.value = '';
                }
                
                // Show all news items
                newsItems.forEach(item => {
                    item.style.display = '';
                });
                
                updateFilterResults(newsItems);
            });
        }
        
        if (searchBtn && searchInput) {
            const performSearch = function() {
                const searchTerm = searchInput.value.trim().toLowerCase();
                
                if (searchTerm) {
                    newsItems.forEach(item => {
                        const title = item.querySelector('h3').textContent.toLowerCase();
                        const description = item.querySelector('p') ? item.querySelector('p').textContent.toLowerCase() : '';
                        
                        if (title.includes(searchTerm) || description.includes(searchTerm)) {
                            item.style.display = '';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                    
                    updateFilterResults(newsItems);
                }
            };
            
            searchBtn.addEventListener('click', performSearch);
            
            searchInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }
}

/**
 * Update results count after filtering
 */
function updateFilterResults(items) {
    const visibleCount = Array.from(items).filter(item => item.style.display !== 'none').length;
    const container = items[0].parentElement;
    let resultsCounter = container.querySelector('.results-counter');
    
    if (!resultsCounter) {
        resultsCounter = document.createElement('p');
        resultsCounter.className = 'results-counter';
        container.insertBefore(resultsCounter, container.firstChild);
    }
    
    resultsCounter.textContent = `Showing ${visibleCount} of ${items.length} results`;
}

/**
 * Highlight the current page in navigation
 */
function highlightCurrentPage() {
    const currentUrl = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkUrl = link.getAttribute('href');
        if (currentUrl === linkUrl || 
            (currentUrl === '/' && linkUrl === 'index.html') || 
            (currentUrl.endsWith('/') && linkUrl === 'index.html')) {
            link.classList.add('active');
            
            // If this link is in a submenu, also highlight parent
            const parentLi = link.closest('.has-submenu');
            if (parentLi) {
                parentLi.classList.add('active-parent');
            }
        }
    });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Validate email address format
 */
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function isValidPhone(phone) {
    // Basic phone validation - adjust as needed for specific country formats
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    return phoneRegex.test(phone);
}

/**
 * Highlight form field with error or success state
 */
function highlightField(field, isError, errorMessage) {
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    // Remove existing feedback messages
    const existingFeedback = formGroup.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    if (isError) {
        field.classList.add('error');
        field.classList.remove('success');
        
        if (errorMessage) {
            const feedbackElement = document.createElement('div');
            feedbackElement.className = 'form-feedback error-message';
            feedbackElement.textContent = errorMessage;
            formGroup.appendChild(feedbackElement);
        }
    } else {
        field.classList.remove('error');
        field.classList.add('success');
    }
}

/**
 * Show form success message
 */
function showFormSuccess(form, message) {
    removeFormMessages(form);
    
    const formMessages = document.createElement('div');
    formMessages.className = 'form-messages success';
    formMessages.textContent = message;
    
    form.prepend(formMessages);
    
    // Scroll to see the message
    formMessages.scrollIntoView({behavior: 'smooth', block: 'center'});
    
    // Clear success state after some time
    setTimeout(() => {
        form.querySelectorAll('.success').forEach(el => el.classList.remove('success'));
        formMessages.style.opacity = '0';
        setTimeout(() => formMessages.remove(), 300);
    }, 5000);
}

/**
 * Show form error message
 */
function showFormError(form, message) {
    removeFormMessages(form);
    
    const formMessages = document.createElement('div');
    formMessages.className = 'form-messages error';
    formMessages.textContent = message;
    
    form.prepend(formMessages);
    
    // Scroll to see the message
    formMessages.scrollIntoView({behavior: 'smooth', block: 'center'});
}

/**
 * Remove all form messages
 */
function removeFormMessages(form) {
    const existingMessages = form.querySelector('.form-messages');
    if (existingMessages) {
        existingMessages.remove();
    }
} 