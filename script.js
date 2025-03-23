// Set countdown date (1 month from now)
const countDownDate = new Date().getTime() + 90 * 24 * 60 * 60 * 1000;

// Initialize countdown
function initCountdown() {
    const countdownTimer = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update countdown elements
        document.getElementById("days").textContent = String(days).padStart(2, '0');
        document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');

        // If countdown is finished
        if (distance < 0) {
            clearInterval(countdownTimer);
            document.querySelector(".countdown-container").innerHTML = "<div class='open-message'>МИ ВІДКРИЛИСЬ!</div>";
        }
    }, 1000);
}

// Mobile menu toggle
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-toggle');
    
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            const nav = document.querySelector('.main-nav');
            
            this.classList.toggle('active');
            nav.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                // Make menu visible and apply styles when active
                nav.style.display = 'block';
                this.querySelector('.bar:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 6px)';
                this.querySelector('.bar:nth-child(2)').style.opacity = '0';
                this.querySelector('.bar:nth-child(3)').style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                // Hide menu when not active
                nav.style.display = '';
                this.querySelector('.bar:nth-child(1)').style.transform = '';
                this.querySelector('.bar:nth-child(2)').style.opacity = '';
                this.querySelector('.bar:nth-child(3)').style.transform = '';
            }
        });
    }
}

// Header scroll effect
function initScrollHeader() {
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.main-header');
        
        if (window.scrollY > 50) {
            header.style.padding = '0.75rem 0';
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.padding = '';
            header.style.boxShadow = '';
        }
    });
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // If it's a real section (not just "#")
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition - headerHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const nav = document.querySelector('.main-nav');
                    const menuButton = document.querySelector('.mobile-menu-toggle');
                    
                    if (nav.classList.contains('active')) {
                        nav.classList.remove('active');
                        nav.style.display = '';
                        
                        menuButton.classList.remove('active');
                        menuButton.querySelector('.bar:nth-child(1)').style.transform = '';
                        menuButton.querySelector('.bar:nth-child(2)').style.opacity = '';
                        menuButton.querySelector('.bar:nth-child(3)').style.transform = '';
                    }
                }
            }
        });
    });
}

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
    const interest = document.getElementById('interest').value;
    const messageElement = document.querySelector('.subscription-message');
    const submitButton = document.querySelector('.btn-submit');
    
    // Validate email
    if (!isValidEmail(email)) {
        messageElement.textContent = 'Будь ласка, введіть коректну email адресу';
        messageElement.className = 'subscription-message error-message';
        shakeElement(document.getElementById('email'));
        return false;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="btn-text">Обробка...</span> <span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
    
    // Save to local storage
    saveEmailToStorage(email, interest);
    
    // Simulate server request
    setTimeout(() => {
        // Success message
        messageElement.textContent = 'Дякуємо! Ми повідомимо вас про відкриття.';
        messageElement.className = 'subscription-message success-message';
        
        // Reset form
        document.getElementById('email').value = '';
        
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = '<span class="btn-text">Підписатися</span> <span class="btn-icon"><i class="fas fa-paper-plane"></i></span>';
        
        // Show success animation
        showSuccessAnimation();
    }, 1500);
    
    return false;
}

// Email validation
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Animation for form error
function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// Success checkmark animation
function showSuccessAnimation() {
    const container = document.createElement('div');
    container.className = 'success-animation';
    
    const checkmark = document.createElement('div');
    checkmark.className = 'checkmark';
    checkmark.innerHTML = '<i class="fas fa-check"></i>';
    
    container.appendChild(checkmark);
    document.body.appendChild(container);
    
    setTimeout(() => {
        container.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        container.classList.remove('show');
        setTimeout(() => {
            container.remove();
        }, 300);
    }, 2000);
}

// Admin functions - Save email to localStorage
function saveEmailToStorage(email, interest) {
    // Create a timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    
    // Prepare the data to save
    const data = `${email},${interest},${timestamp}\n`;
    
    // Check for existing emails
    let existingEmails = localStorage.getItem('subscribedEmails') || '';
    
    // Check if this email already exists
    if (existingEmails.includes(email + ',')) {
        console.log(`Email ${email} already exists in the list`);
        return;
    }
    
    // Add new email
    existingEmails += data;
    
    // Save to storage
    localStorage.setItem('subscribedEmails', existingEmails);
    
    // Update the counter in the admin panel
    updateEmailsCount();
    
    console.log(`Email saved: ${email} (Interest: ${interest})`);
}

// Download emails as file
function downloadEmailsFile() {
    // Get all emails from localStorage
    const existingEmails = localStorage.getItem('subscribedEmails') || '';
    
    if (!existingEmails.trim()) {
        alert('Немає збережених email адрес');
        return;
    }
    
    // Add header row for CSV
    const csvContent = 'Email,Interest,Timestamp\n' + existingEmails;
    
    // Create a downloadable file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'itsiesta-subscribers.csv';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Clear emails list
function clearEmailsList() {
    if (confirm('Ви впевнені, що хочете видалити всі збережені email адреси?')) {
        localStorage.removeItem('subscribedEmails');
        updateEmailsCount();
        alert('Список email адрес очищено');
    }
}

// Update emails count
function updateEmailsCount() {
    const emailsData = localStorage.getItem('subscribedEmails') || '';
    const count = emailsData.trim() ? emailsData.trim().split('\n').length : 0;
    
    const countElement = document.getElementById('emails-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Toggle admin panel visibility
function toggleAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    if (adminPanel) {
        adminPanel.classList.toggle('visible');
        
        if (adminPanel.classList.contains('visible')) {
            updateEmailsCount();
        }
    }
}

// Init admin panel triple-click
function initAdminPanel() {
    const logo = document.querySelector('.logo');
    if (logo) {
        let clickCount = 0;
        let clickTimer = null;
        
        logo.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 800);
            } else if (clickCount === 3) {
                clearTimeout(clickTimer);
                clickCount = 0;
                toggleAdminPanel();
            }
        });
    }
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initMobileMenu();
    initScrollHeader();
    initSmoothScroll();
    initAdminPanel();
    updateEmailsCount();
    
    // Make form available globally
    window.handleSubmit = handleSubmit;
    
    // Add subtle parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        if (heroContent && heroImage) {
            heroContent.style.transform = `translateY(${scrollY * 0.1}px)`;
            heroImage.style.transform = `translateY(-${scrollY * 0.05}px)`;
        }
    });
    
    // Add reveal animations on scroll
    const elementsToAnimate = document.querySelectorAll('.section-header, .about-card, .feature-item, .pricing-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});