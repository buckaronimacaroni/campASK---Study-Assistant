// Pomodoro Timer Popup logic
document.addEventListener('DOMContentLoaded', function() {
    const pomodoroPopup = document.getElementById('pomodoro-popup');
    const pomodoroClose = document.getElementById('pomodoro-close');
    if (pomodoroPopup && pomodoroClose) {
        pomodoroClose.addEventListener('click', function() {
            pomodoroPopup.style.display = 'none';
        });
        // Optional: Reopen with a keyboard shortcut (Ctrl+P)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                pomodoroPopup.style.display = 'flex';
                pomodoroPopup.focus();
            }
        });
    }
});
// DOM Elements
const queryInput = document.getElementById('query-input');
const askButton = document.getElementById('ask-button');
const navLinks = document.querySelectorAll('.nav-links a');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });

        // Update active link
        updateActiveLink(link);
    });
});

// Handle form submission
askButton.addEventListener('click', handleQuestion);
queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleQuestion();
    }
});

// Functions
function initializeApp() {
    // Load user preferences from localStorage
    loadUserPreferences();
    
    // Add scroll event listener for navbar
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(45, 62, 80, 0.95)';
        } else {
            navbar.style.backgroundColor = 'var(--primary-color)';
        }
    });
}

function handleQuestion() {
    const query = queryInput.value.trim();
    
    if (!query) {
        showFeedback('Please enter your question', 'error');
        return;
    }

    // Show loading state
    askButton.disabled = true;
    askButton.textContent = 'Processing...';

    // Simulate API call (replace with actual API integration)
    setTimeout(() => {
        // Reset button state
        askButton.disabled = false;
        askButton.textContent = 'Ask Now';
        
        // Clear input
        queryInput.value = '';
        
        // Show success message
        showFeedback('Your question has been received!', 'success');
    }, 1500);
}

function showFeedback(message, type) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = `feedback ${type}`;
    feedback.textContent = message;
    
    // Add to DOM
    document.body.appendChild(feedback);
    
    // Remove after animation
    setTimeout(() => {
        feedback.remove();
    }, 3000);
}

function updateActiveLink(clickedLink) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    clickedLink.classList.add('active');
}

function loadUserPreferences() {
    const preferences = JSON.parse(localStorage.getItem('campask-preferences')) || {};
    // Apply preferences (theme, font size, etc.)
    return preferences;
}

// Animation utility
function animateElement(element, animation) {
    element.style.animation = animation;
    element.addEventListener('animationend', () => {
        element.style.animation = '';
    }, { once: true });
}
