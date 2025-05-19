# Frontend Integration Guide

This folder contains examples of how to integrate the KEMRI GMD backend API with the existing frontend.

## Files

- `search.js` - Updated search functionality that uses the actual API instead of simulated data

## Integration Steps

### 1. Replace Static JavaScript Files

Replace the following files with their API-integrated versions:

- Replace `/assets/js/search.js` with the version in this folder
- Update `/assets/js/main.js` to use API endpoints for contact form submission

### 2. Modify Contact Form Submission

Update the contact form in `contact.html` to submit to the API endpoint:

```javascript
// Change this in main.js
contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Form validation code...
    
    if (isValid) {
        // Prepare form data for submission
        const formData = new FormData(contactForm);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Submit to API instead of simulating
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showFormSuccess(contactForm, 'Thank you for your message. We will get back to you within 2 business days.');
            contactForm.reset();
        })
        .catch(error => {
            showFormError(contactForm, 'An error occurred. Please try again later.');
            console.error('Error:', error);
        });
        
        // Update button UI during submission
        const submitBtn = contactForm.querySelector('[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Reset button after submission
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1000);
        }
    } else {
        showFormError(contactForm, 'Please fix the errors in the form before submitting.');
    }
});
```

### 3. Add Authentication for Admin Access

Create a new admin login page and dashboard:

1. Create `admin-login.html` for admin authentication
2. Create `admin-dashboard.html` for content management
3. Add token-based authentication using JWT

Example admin login code:

```javascript
document.getElementById('admin-login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store token in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect to admin dashboard
            window.location.href = '/admin-dashboard.html';
        } else {
            // Show error message
            document.getElementById('login-error').textContent = data.message || 'Login failed';
        }
    })
    .catch(error => {
        document.getElementById('login-error').textContent = 'An error occurred. Please try again.';
    });
});
```

### 4. Update News, Resources and Other Dynamic Content

Modify the news listing page to fetch data from the API:

```javascript
// In a new file assets/js/news.js
document.addEventListener('DOMContentLoaded', function() {
    // Fetch news from API
    fetch('/api/news')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayNews(data.data);
            } else {
                displayError('Failed to load news');
            }
        })
        .catch(error => {
            displayError('An error occurred while loading news');
        });
});

function displayNews(newsItems) {
    const newsContainer = document.getElementById('news-container');
    
    if (!newsContainer) return;
    
    if (newsItems.length === 0) {
        newsContainer.innerHTML = '<p>No news items available at this time.</p>';
        return;
    }
    
    const newsHTML = newsItems.map(item => `
        <article class="news-item" id="${item.slug || item._id}">
            <header>
                <h3>${item.title}</h3>
                <p class="news-meta">
                    <span class="category">${item.category}</span> | 
                    <span class="date">${new Date(item.publishDate).toLocaleDateString()}</span>
                </p>
            </header>
            <div class="news-content">
                ${item.content}
            </div>
        </article>
    `).join('');
    
    newsContainer.innerHTML = newsHTML;
}

function displayError(message) {
    const newsContainer = document.getElementById('news-container');
    if (newsContainer) {
        newsContainer.innerHTML = `<div class="error-message">${message}</div>`;
    }
}
```

## Integration Testing

1. Start the backend server with `npm run dev`
2. Test contact form submission
3. Test search functionality
4. Test admin login and dashboard
5. Verify that all API endpoints are working properly with the frontend 