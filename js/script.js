// Main JavaScript for Engineering College website

// Form Validation for Registration
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        // Clear previous error
        this.clearError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showError(field, `${field.getAttribute('data-label')} is required`);
            return false;
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }

        // Phone validation
        if (field.name === 'phone' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                this.showError(field, 'Please enter a valid phone number');
                return false;
            }
        }

        // Password validation
        if (field.name === 'password' && value) {
            if (value.length < 8) {
                this.showError(field, 'Password must be at least 8 characters long');
                return false;
            }
        }

        // Password confirmation
        if (field.name === 'confirmPassword' && value) {
            const password = this.form.querySelector('[name="password"]').value;
            if (value !== password) {
                this.showError(field, 'Passwords do not match');
                return false;
            }
        }

        return true;
    }

    showError(field, message) {
        field.classList.add('is-invalid');
        
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    clearError(field) {
        field.classList.remove('is-invalid');
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.showSuccess();
        }
    }

    showSuccess() {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show';
        successDiv.innerHTML = `
            <h4 class="alert-heading">Application Submitted Successfully!</h4>
            <p>Thank you for your interest in Engineering College. We'll contact you soon.</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        this.form.parentNode.insertBefore(successDiv, this.form);
        this.form.reset();
        
        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Interactive Features
class InteractiveFeatures {
    constructor() {
        this.initFAQAccordion();
        this.initBackToTop();
    }

    // FAQ Accordion
    initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const answer = item.querySelector('.faq-answer');
                    const isVisible = answer.style.display === 'block';
                    
                    // Close all answers
                    document.querySelectorAll('.faq-answer').forEach(ans => {
                        ans.style.display = 'none';
                    });
                    document.querySelectorAll('.faq-question').forEach(q => {
                        q.classList.remove('active');
                    });
                    
                    // Toggle current answer
                    if (!isVisible) {
                        answer.style.display = 'block';
                        question.classList.add('active');
                    }
                });
            }
        });
    }

    // Back to Top Button
    initBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'btn btn-primary back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: none;
            z-index: 1000;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 1.2rem;
        `;
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.body.appendChild(backToTop);
        
        window.addEventListener('scroll', () => {
            backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation if registration form exists
    if (document.getElementById('registrationForm')) {
        new FormValidator('registrationForm');
    }
    
    if (document.getElementById('contactForm')) {
        new FormValidator('contactForm');
    }
    
    // Initialize interactive features
    new InteractiveFeatures();
    
    // Add active state to current page in navigation
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});