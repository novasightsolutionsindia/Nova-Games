// Main JavaScript file for Nova Gaming Hub

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const gameCards = document.querySelectorAll('.game-card');

// Mobile Menu Toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Game card hover effects
gameCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Game analytics tracking
function trackGamePlay(gameName) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'game_play', {
            'game_name': gameName
        });
    }
    
    // Store in local storage for analytics
    let gamePlays = JSON.parse(localStorage.getItem('gamePlays') || '{}');
    gamePlays[gameName] = (gamePlays[gameName] || 0) + 1;
    localStorage.setItem('gamePlays', JSON.stringify(gamePlays));
}

// High score management
class HighScoreManager {
    constructor(gameName) {
        this.gameName = gameName;
        this.storageKey = `highscore_${gameName}`;
    }
    
    getHighScore() {
        return parseInt(localStorage.getItem(this.storageKey)) || 0;
    }
    
    setHighScore(score) {
        const currentHigh = this.getHighScore();
        if (score > currentHigh) {
            localStorage.setItem(this.storageKey, score);
            return true;
        }
        return false;
    }
}

// Theme toggler (optional)
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '🌓';
themeToggle.setAttribute('aria-label', 'Toggle theme');
document.body.appendChild(themeToggle);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// Initialize tooltips
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = e.target.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
        
        e.target.addEventListener('mouseleave', () => {
            tooltip.remove();
        }, { once: true });
    });
});

// Error tracking
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // You could send this to an analytics service
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// Page load performance tracking
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

// Export functions for use in game pages
window.NovaGaming = {
    trackGamePlay,
    HighScoreManager
};