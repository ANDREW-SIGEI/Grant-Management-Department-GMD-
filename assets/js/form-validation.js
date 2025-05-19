/**
 * Form validation for KEMRI GMD website
 * Handles validation for contact forms and other input fields
 */
document.addEventListener('DOMContentLoaded', function() {
  // Get all forms with validation class
  const forms = document.querySelectorAll('.needs-validation');
  
  // Add validation handling to each form
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      // Prevent default form submission
      event.preventDefault();
      
      // Check if form is valid according to HTML5 validation
      if (!form.checkValidity()) {
        event.stopPropagation();
        highlightInvalidFields(form);
      } else {
        // Form is valid, proceed with submission
        submitFormData(form);
      }
      
      form.classList.add('was-validated');
    });
    
    // Add input event listeners for real-time validation feedback
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        validateField(input);
      });
      
      input.addEventListener('blur', function() {
        validateField(input);
      });
    });
  });
  
  /**
   * Validate a single form field
   * @param {HTMLElement} field - The input field to validate
   */
  function validateField(field) {
    // Remove existing validation messages
    const existingMessage = field.parentNode.querySelector('.validation-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Check field validity
    if (!field.checkValidity()) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      
      // Add custom validation message
      const message = document.createElement('div');
      message.className = 'validation-message text-danger';
      message.textContent = getValidationMessage(field);
      field.parentNode.appendChild(message);
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
    }
  }
  
  /**
   * Get appropriate validation message based on field type and error
   * @param {HTMLElement} field - The field that failed validation
   * @returns {string} Validation error message
   */
  function getValidationMessage(field) {
    if (field.validity.valueMissing) {
      return 'This field is required';
    }
    
    if (field.validity.typeMismatch) {
      if (field.type === 'email') {
        return 'Please enter a valid email address';
      }
      if (field.type === 'url') {
        return 'Please enter a valid URL';
      }
      return 'Please enter a valid value';
    }
    
    if (field.validity.tooShort) {
      return `Please enter at least ${field.minLength} characters`;
    }
    
    if (field.validity.tooLong) {
      return `Please enter no more than ${field.maxLength} characters`;
    }
    
    if (field.validity.patternMismatch) {
      if (field.id === 'phone') {
        return 'Please enter a valid phone number';
      }
      return 'Please match the requested format';
    }
    
    return field.validationMessage || 'Invalid value';
  }
  
  /**
   * Highlight all invalid fields in a form
   * @param {HTMLFormElement} form - The form to validate
   */
  function highlightInvalidFields(form) {
    const invalidFields = form.querySelectorAll(':invalid');
    invalidFields.forEach(field => {
      validateField(field);
    });
    
    // Scroll to first invalid field
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
      invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  /**
   * Submit form data via AJAX
   * @param {HTMLFormElement} form - The form to submit
   */
  function submitFormData(form) {
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    
    // Get the form's action, defaulting to /api/contact if not specified
    const action = form.getAttribute('action') || '/api/contact';
    
    // Submit data
    fetch(action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Show success message
      form.reset();
      form.classList.remove('was-validated');
      
      // Reset all inputs to default state
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
      });
      
      // Show success message
      showFormMessage(form, 'success', 'Your message has been sent successfully!');
    })
    .catch(error => {
      console.error('Error:', error);
      showFormMessage(form, 'danger', 'There was an error submitting the form. Please try again.');
    })
    .finally(() => {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    });
  }
  
  /**
   * Display form submission message
   * @param {HTMLFormElement} form - The form element
   * @param {string} type - Message type (success/danger/warning)
   * @param {string} message - Message text to display
   */
  function showFormMessage(form, type, message) {
    // Remove any existing messages
    const existingAlert = form.parentNode.querySelector('.form-message');
    if (existingAlert) {
      existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} form-message mt-3`;
    alert.role = 'alert';
    alert.innerHTML = message;
    
    // Insert after form
    form.parentNode.insertBefore(alert, form.nextSibling);
    
    // Scroll to message
    alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
      }, 5000);
    }
  }
}); 