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
    const typingText = document.querySelector('.typing-text');
    const words = [
        'Cybersecurity Intern & Software Developer',
        'Building Secure Digital Solutions',
        'Creating Interactive Experiences'
    ];
    let wordIndex = 0;
    let charIndex = 0;

    // Dynamically set the width of the typing-text element
    function adjustWidth() {
        const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b));
        typingText.style.width = `${longestWord.length + 2}ch`; // Add extra space for the cursor
    }

    function type() {
        if (charIndex < words[wordIndex].length) {
            typingText.textContent += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100); // Typing speed
        } else {
            setTimeout(erase, 2000); // Pause before erasing
        }
    }

    function erase() {
        if (charIndex > 0) {
            typingText.textContent = words[wordIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50); // Erasing speed
        } else {
            wordIndex = (wordIndex + 1) % words.length; // Move to the next word
            setTimeout(type, 500); // Pause before typing the next word
        }
    }

    adjustWidth(); // Adjust the width before starting the animation
    type(); // Start the typing effect
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

// Typing effect for the intro text
const typingIntro = document.querySelector('.typing-intro');
// Removed duplicate declaration of introText
// Removed duplicate declaration of introIndex

function typeIntroEffect() {
    if (introIndex < introText.length) {
        typingIntro.textContent += introText.charAt(introIndex); // Add one character at a time
        introIndex++;
        setTimeout(typeIntroEffect, 100); // Adjust typing speed (100ms per character)
    }
}

function typeNameEffect() {
    if (nameIndex < nameToType.length) {
        typingText.textContent += nameToType.charAt(nameIndex); // Add one character at a time
        nameIndex++;
        setTimeout(typeNameEffect, 150); // Adjust typing speed (150ms per character)
    }
}

// Start both typing effects when the page loads
window.addEventListener('DOMContentLoaded', () => {
    typeIntroEffect(); // Start the intro typing effect
    setTimeout(typeNameEffect, 3000); // Delay the name typing effect to start after the intro
});

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Typing Effects
const typingText = document.querySelector('.typing-text');
const nameText = "Stavin Fernandes";
let introIndex = 0;
let nameIndex = 0;

function typeIntroEffect() {
    if (introIndex < introText.length) {
        typingIntro.textContent += introText.charAt(introIndex);
        introIndex++;
        setTimeout(typeIntroEffect, 100);
    }
}

function typeNameEffect() {
    if (nameIndex < nameText.length) {
        typingText.textContent += nameText.charAt(nameIndex);
        nameIndex++;
        setTimeout(typeNameEffect, 150);
    }
}

// Start typing effects
window.addEventListener('DOMContentLoaded', () => {
    typeIntroEffect();
    setTimeout(typeNameEffect, 2000);
});

// Touch Events
let xDown = null;
let yDown = null;

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
    if (!xDown || !yDown) return;

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
            // Swipe left action
            navLinks.classList.remove('active');
        } else {
            // Swipe right action
            navLinks.classList.add('active');
        }
    }

    xDown = null;
    yDown = null;
}