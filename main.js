// DOM Elements
const header = document.querySelector('nav');
const preloader = document.querySelector('.preloader');
const projectCards = document.querySelectorAll('.work-card');
const carouselTrack = document.querySelector('.carousel-track');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
const dotsContainer = document.querySelector('.carousel-dots');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

// Add mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Adjust typing speed for mobile
const mobileTypingSpeed = 150;
const desktopTypingSpeed = 100;
const typingSpeed = isMobile ? mobileTypingSpeed : desktopTypingSpeed;

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Preloader
window.addEventListener('load', () => {
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Scroll Management
const scrollManager = {
    lastScroll: 0,

    handleHeaderScroll() {
        const currentScroll = window.pageYOffset;
        header.classList.toggle('hide', currentScroll > this.lastScroll && currentScroll > 100);
        this.lastScroll = currentScroll;
    },

    handleNavLinkActivation() {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href').substring(1) === currentSection);
        });
    },

    handleReveal() {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            element.classList.toggle('active', elementTop < windowHeight - elementVisible);
        });
    }
};

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Project Cards Hover Effect
projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.work-card, .expertise, .about-text, .contact-content')
    .forEach(el => observer.observe(el));

// Carousel Functionality
let currentIndex = 0;
const cardsPerView = window.innerWidth < 768 ? 1 : window.innerWidth < 1200 ? 2 : 3;

function updateCarousel() {
    const offset = -currentIndex * (100 / cardsPerView);
    carouselTrack.style.transform = `translateX(${offset}%)`;

    // Update dots
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

function createDots() {
    const numberOfDots = Math.ceil(projectCards.length / cardsPerView);
    dotsContainer.innerHTML = '';
    for (let i = 0; i < numberOfDots; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    }
}

prevButton.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
});

nextButton.addEventListener('click', () => {
    currentIndex = Math.min(currentIndex + 1, Math.ceil(projectCards.length / cardsPerView) - 1);
    updateCarousel();
});

// Auto-Move Carousel
let autoMoveInterval;

function startAutoMoveCarousel() {
    autoMoveInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % Math.ceil(projectCards.length / cardsPerView);
        updateCarousel();
    }, 3000); // Change slides every 3 seconds
}

function stopAutoMoveCarousel() {
    clearInterval(autoMoveInterval);
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    createDots();
    updateCarousel();
    startAutoMoveCarousel();

    // Optional: Pause auto-move on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoMoveCarousel);
    carouselContainer.addEventListener('mouseleave', startAutoMoveCarousel);

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Add initial visibility classes
    document.querySelectorAll('.work-card').forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.toggle('dark-mode', savedTheme === 'dark');
        themeToggle.checked = savedTheme === 'dark';
    }

    // Toggle theme on switch change
    themeToggle.addEventListener('change', () => {
        const isDarkMode = themeToggle.checked;
        body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
});

// Typing Effect Configuration
const typingConfig = {
    intro: {
        text: "Welcome to My Portfolio",
        element: document.querySelector('.typing-intro'),
        speed: isMobile ? 150 : 100
    },
    name: {
        text: "Stavin Fernandes",
        element: document.querySelector('.typing-text'),
        speed: isMobile ? 150 : 100
    }
};

// Remove any existing typing effect related code/functions
// and replace with this unified implementation
function typeEffect(config, index, callback) {
    if (!config.element) return; // Guard clause for missing elements
    
    const { text, element, speed } = config;
    
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeEffect(config, index + 1, callback), speed);
    } else if (callback) {
        callback();
    }
}

// Initialize Typing Effects
document.addEventListener('DOMContentLoaded', () => {
    // Remove any existing content
    if (typingConfig.intro.element) typingConfig.intro.element.textContent = '';
    if (typingConfig.name.element) typingConfig.name.element.textContent = '';

    // Start intro typing
    typeEffect(typingConfig.intro, 0, () => {
        // Start name typing after intro completes
        setTimeout(() => {
            typeEffect(typingConfig.name, 0);
        }, 1000);
    });
});

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Touch Events
let xDown = null;
let yDown = null;

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

// Optimize touch events for mobile
let touchStartTime;
const SWIPE_THRESHOLD = 50;
const SWIPE_TIMEOUT = 300;

function handleTouchStart(evt) {
    touchStartTime = Date.now();
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) return;
    
    // Check if swipe is within timeout
    if (Date.now() - touchStartTime > SWIPE_TIMEOUT) {
        xDown = null;
        yDown = null;
        return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > SWIPE_THRESHOLD) {
        if (xDiff > 0) {
            navLinks.classList.remove('active');
        } else {
            navLinks.classList.add('active');
        }
    }

    xDown = null;
    yDown = null;
}

// Carousel Configuration
const carouselDots = document.querySelector('.carousel-dots');
const slides = document.querySelectorAll('.work-card');
const slideCount = slides.length;

// Create dots based on actual number of work cards
function createCarouselDots() {
    carouselDots.innerHTML = ''; // Clear existing dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        carouselDots.appendChild(dot);
    }
}

// Update active dot
function updateDots(currentIndex) {
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
}

// Go to specific slide
function goToSlide(index) {
    const slideWidth = slides[0].offsetWidth;
    carouselTrack.style.transform = `translateX(-${slideWidth * index}px)`;
    updateDots(index);
}

// Initialize carousel
createCarouselDots();