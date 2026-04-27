/**
 * ============================================
 * FRYS & GUYS - DIGITAL MENU JAVASCRIPT
 * Premium Mobile-First Restaurant Menu
 * WhatsApp Ordering Integration
 * ============================================
 */

// Configuration - Replace with your actual WhatsApp number
const WHATSAPP_NUMBER = '923001230377';

// Categories for navigation
const categories = [
    { id: 'burgers', name: 'Burgers', emoji: '🍔' },
    { id: 'broast', name: 'Broast', emoji: '🍗' },
    { id: 'wings-wraps', name: 'Wings & Wraps', emoji: '🍗' },
    { id: 'fries-sides', name: 'Fries & Sides', emoji: '🍟' },
    { id: 'drinks', name: 'Drinks', emoji: '🥤' },
    { id: 'deals', name: 'Deals', emoji: '🎉' }
];

/**
 * Generate WhatsApp order link with pre-filled message
 * @param {string} itemName - Name of the menu item
 * @param {number} price - Price of the item in Rs.
 */
function orderOnWhatsApp(itemName, price) {
    const message = encodeURIComponent(
        `Hi! I'd like to order:\n\n` +
        `🍽️ *${itemName}*\n` +
        `💰 Price: Rs. ${price}\n\n` +
        `Please confirm availability and delivery details. Thank you!`
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Handle category button click - smooth scroll to section
 * @param {string} categoryId - ID of the category section
 */
function scrollToCategory(categoryId) {
    const element = document.getElementById(categoryId);
    if (element) {
        const offset = 140; // Account for sticky header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Update active category based on scroll position
 */
function updateActiveCategory() {
    const scrollPosition = window.scrollY + 200;
    const categoryButtons = document.querySelectorAll('.category-btn');

    for (const category of categories) {
        const element = document.getElementById(category.id);
        if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to current category button
                const activeBtn = document.querySelector(`[data-category="${category.id}"]`);
                if (activeBtn) {
                    activeBtn.classList.add('active');
                    // Scroll the nav to show active button
                    activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
                break;
            }
        }
    }
}

/**
 * Intersection Observer for scroll reveal animations
 */
function setupScrollReveal() {
    const sections = document.querySelectorAll('.menu-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Setup category navigation click handlers
 */
function setupCategoryNav() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const categoryId = button.getAttribute('data-category');
            scrollToCategory(categoryId);
            
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

/**
 * Add staggered animation delays to menu cards
 */
function setupCardAnimations() {
    const menuGrids = document.querySelectorAll('.menu-grid');
    
    menuGrids.forEach(grid => {
        const cards = grid.querySelectorAll('.menu-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
        });
    });
}

/**
 * Handle touch events for better mobile experience
 */
function setupTouchHandlers() {
    const orderButtons = document.querySelectorAll('.order-btn');
    
    orderButtons.forEach(button => {
        // Add touch feedback
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        button.addEventListener('touchend', () => {
            button.style.transform = 'scale(1)';
        }, { passive: true });
    });
}

/**
 * Lazy load images for better performance
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('.card-image img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px'
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Initialize the application
 */
function init() {
    // Setup all functionality
    setupCategoryNav();
    setupScrollReveal();
    setupCardAnimations();
    setupTouchHandlers();
    setupLazyLoading();

    // Add scroll listener for active category tracking
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveCategory, 50);
    }, { passive: true });

    // Initial check for visible sections
    setTimeout(() => {
        document.querySelectorAll('.menu-section').forEach(section => {
            section.classList.add('visible');
        });
    }, 100);

    console.log('🍔 Frys & Guys Digital Menu Initialized!');
    console.log('📱 WhatsApp ordering ready!');
}

// Run when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { orderOnWhatsApp, scrollToCategory, WHATSAPP_NUMBER };
}
