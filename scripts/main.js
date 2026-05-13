/**
 * EduLearn Platform - Main JavaScript
 * WCAG 2.2 AA Compliant
 * Handles all interactive functionality
 */

(function() {
    'use strict';

    // ===================================
    // DOM Elements
    // ===================================
    const elements = {
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        mobileMenu: document.getElementById('mobile-menu'),
        authModal: document.getElementById('auth-modal'),
        modalClose: document.querySelector('.modal-close'),
        tabBtns: document.querySelectorAll('.tab-btn'),
        loginForm: document.getElementById('login-form'),
        registerForm: document.getElementById('register-form'),
        cookieBanner: document.getElementById('cookie-banner'),
        cookieAccept: document.getElementById('cookie-accept'),
        cookieReject: document.getElementById('cookie-reject'),
        cookieCustomize: document.getElementById('cookie-customize'),
        statNumbers: document.querySelectorAll('.stat-number'),
        testimonialTrack: document.querySelector('.testimonial-track'),
        sliderPrev: document.querySelector('.slider-prev'),
        sliderNext: document.querySelector('.slider-next'),
        courseSearch: document.getElementById('course-search'),
        categoryFilter: document.getElementById('category-filter'),
        levelFilter: document.getElementById('level-filter'),
        courseCards: document.querySelectorAll('.course-card')
    };

    // ===================================
    // Mobile Menu Toggle
    // ===================================
    function initMobileMenu() {
        if (!elements.mobileMenuToggle || !elements.mobileMenu) return;

        elements.mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = elements.mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            elements.mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            elements.mobileMenu.hidden = isExpanded;
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.mobileMenu.contains(e.target) && !elements.mobileMenuToggle.contains(e.target)) {
                elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
                elements.mobileMenu.hidden = true;
            }
        });
    }

    // ===================================
    // Authentication Modal
    // ===================================
    function initAuthModal() {
        if (!elements.authModal) return;

        const openModal = () => {
            elements.authModal.hidden = false;
            document.body.style.overflow = 'hidden';
            
            // Focus trap
            const focusableElements = elements.authModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];

            elements.authModal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
                if (e.key === 'Escape') {
                    closeModal();
                }
            });

            firstFocusable.focus();
        };

        const closeModal = () => {
            elements.authModal.hidden = true;
            document.body.style.overflow = '';
        };

        // Open modal from auth buttons
        document.querySelectorAll('.auth-buttons a[href="#login"], .auth-buttons a[href="#register"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
                
                // Set appropriate tab
                const tab = btn.getAttribute('href') === '#register' ? 'register' : 'login';
                switchTab(tab);
            });
        });

        // Close modal
        if (elements.modalClose) {
            elements.modalClose.addEventListener('click', closeModal);
        }

        // Close on overlay click
        elements.authModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });

        // Tab switching
        elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchTab(btn.dataset.tab);
            });
        });
    }

    function switchTab(tab) {
        elements.tabBtns.forEach(btn => {
            const isActive = btn.dataset.tab === tab;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        if (elements.loginForm && elements.registerForm) {
            if (tab === 'login') {
                elements.loginForm.classList.add('active');
                elements.loginForm.hidden = false;
                elements.registerForm.classList.remove('active');
                elements.registerForm.hidden = true;
            } else {
                elements.registerForm.classList.add('active');
                elements.registerForm.hidden = false;
                elements.loginForm.classList.remove('active');
                elements.loginForm.hidden = true;
            }
        }
    }

    // ===================================
    // Form Validation
    // ===================================
    function initFormValidation() {
        // Login form
        if (elements.loginForm) {
            elements.loginForm.addEventListener('submit', handleLoginSubmit);
        }

        // Register form
        if (elements.registerForm) {
            elements.registerForm.addEventListener('submit', handleRegisterSubmit);
            
            // Password strength indicator
            const passwordInput = document.getElementById('register-password');
            if (passwordInput) {
                passwordInput.addEventListener('input', checkPasswordStrength);
            }
        }
    }

    function handleLoginSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const email = form.querySelector('#login-email');
        const password = form.querySelector('#login-password');
        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Validate email
        if (!email.value || !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!password.value) {
            showError(password, 'Password is required');
            isValid = false;
        }

        if (isValid) {
            // Simulate login (replace with actual API call)
            console.log('Login submitted:', email.value);
            alert('Login functionality would connect to backend authentication service.');
        }
    }

    function handleRegisterSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const name = form.querySelector('#register-name');
        const email = form.querySelector('#register-email');
        const password = form.querySelector('#register-password');
        const confirm = form.querySelector('#register-confirm');
        const terms = form.querySelector('[name="terms"]');
        let isValid = true;

        // Clear previous errors
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');

        // Validate name
        if (!name.value || name.value.trim().length < 2) {
            showError(name, 'Please enter your full name');
            isValid = false;
        }

        // Validate email
        if (!email.value || !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!password.value || password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters');
            isValid = false;
        }

        // Validate password confirmation
        if (password.value !== confirm.value) {
            showError(confirm, 'Passwords do not match');
            isValid = false;
        }

        // Validate terms
        if (!terms || !terms.checked) {
            alert('You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }

        if (isValid) {
            // Simulate registration (replace with actual API call)
            console.log('Registration submitted:', email.value);
            alert('Registration functionality would connect to backend authentication service.');
        }
    }

    function showError(input, message) {
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
        input.setAttribute('aria-invalid', 'true');
        input.focus();
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function checkPasswordStrength(e) {
        const password = e.target.value;
        const strengthIndicator = e.target.parentElement.querySelector('.password-strength');
        
        if (!strengthIndicator) return;

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const levels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];

        strengthIndicator.textContent = `Password Strength: ${levels[strength]}`;
        strengthIndicator.style.color = colors[strength];
    }

    // ===================================
    // Cookie Consent
    // ===================================
    function initCookieConsent() {
        if (!elements.cookieBanner) return;

        const hasConsent = localStorage.getItem('cookieConsent');
        
        if (!hasConsent) {
            setTimeout(() => {
                elements.cookieBanner.hidden = false;
            }, 2000);
        }

        if (elements.cookieAccept) {
            elements.cookieAccept.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                elements.cookieBanner.hidden = true;
            });
        }

        if (elements.cookieReject) {
            elements.cookieReject.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'rejected');
                elements.cookieBanner.hidden = true;
            });
        }

        if (elements.cookieCustomize) {
            elements.cookieCustomize.addEventListener('click', () => {
                alert('Cookie customization modal would open here with granular preferences.');
            });
        }
    }

    // ===================================
    // Animated Statistics
    // ===================================
    function initStatsAnimation() {
        if (elements.statNumbers.length === 0) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStat(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.statNumbers.forEach(stat => observer.observe(stat));
    }

    function animateStat(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // ===================================
    // Testimonial Slider
    // ===================================
    function initTestimonialSlider() {
        if (!elements.testimonialTrack || !elements.sliderPrev || !elements.sliderNext) return;

        let currentIndex = 0;
        const cards = elements.testimonialTrack.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;

        function updateSlider() {
            elements.testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update aria-live for accessibility
            elements.testimonialTrack.setAttribute('aria-label', `Testimonial ${currentIndex + 1} of ${totalCards}`);
        }

        elements.sliderNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateSlider();
        });

        elements.sliderPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateSlider();
        });

        // Auto-advance every 8 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateSlider();
        }, 8000);

        // Keyboard navigation
        elements.testimonialTrack.setAttribute('tabindex', '0');
        elements.testimonialTrack.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % totalCards;
                updateSlider();
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateSlider();
            }
        });
    }

    // ===================================
    // Course Filtering
    // ===================================
    function initCourseFiltering() {
        if (!elements.courseSearch || !elements.categoryFilter || !elements.levelFilter) return;

        function filterCourses() {
            const searchTerm = elements.courseSearch.value.toLowerCase();
            const category = elements.categoryFilter.value;
            const level = elements.levelFilter.value;

            elements.courseCards.forEach(card => {
                const title = card.querySelector('.course-title').textContent.toLowerCase();
                const description = card.querySelector('.course-description').textContent.toLowerCase();
                const cardCategory = card.dataset.category;
                const cardLevel = card.dataset.level;

                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesCategory = category === 'all' || cardCategory === category;
                const matchesLevel = level === 'all' || cardLevel === level;

                if (matchesSearch && matchesCategory && matchesLevel) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        elements.courseSearch.addEventListener('input', filterCourses);
        elements.categoryFilter.addEventListener('change', filterCourses);
        elements.levelFilter.addEventListener('change', filterCourses);
    }

    // ===================================
    // Smooth Scroll for Anchor Links
    // ===================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href.length > 1) {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update URL without triggering scroll
                        history.pushState(null, '', href);
                    }
                }
            });
        });
    }

    // ===================================
    // Lazy Loading Images
    // ===================================
    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            return;
        }

        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===================================
    // Language Selector (Placeholder)
    // ===================================
    function initLanguageSelector() {
        const languageSelector = document.querySelector('.language-selector');
        if (!languageSelector) return;

        languageSelector.addEventListener('click', () => {
            const languages = ['English', 'Español', 'Français', 'Deutsch', '中文', '日本語', 'Português'];
            const currentLang = languageSelector.querySelector('span').textContent;
            const currentIndex = languages.indexOf(currentLang);
            const nextIndex = (currentIndex + 1) % languages.length;
            
            languageSelector.querySelector('span').textContent = languages[nextIndex];
            
            // In production, this would trigger actual language switching
            console.log(`Language switched to: ${languages[nextIndex]}`);
        });
    }

    // ===================================
    // Performance Monitoring
    // ===================================
    function initPerformanceMonitoring() {
        // Log page load performance
        window.addEventListener('load', () => {
            if (window.performance) {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                // Send to analytics in production
                // analytics.track('page_load', { loadTime });
            }
        });
    }

    // ===================================
    // Initialize All Modules
    // ===================================
    function init() {
        initMobileMenu();
        initAuthModal();
        initFormValidation();
        initCookieConsent();
        initStatsAnimation();
        initTestimonialSlider();
        initCourseFiltering();
        initSmoothScroll();
        initLazyLoading();
        initLanguageSelector();
        initPerformanceMonitoring();

        console.log('EduLearn Platform initialized successfully');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
