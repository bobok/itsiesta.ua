// Set countdown date to October 1, 2025
const countDownDate = new Date('2025-10-01T00:00:00').getTime();

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


// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    initCountdown();
    initMobileMenu();
    initScrollHeader();
    initSmoothScroll();
    
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