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

// --- YouTube Data API Integration for Recommended Videos ---
const YOUTUBE_API_KEY = "AIzaSyCtCSDRGHN710uzX6t9faF35pWO8rhpLLY";
// Simulate user search history (replace with real logic if available)
let recentSearches = JSON.parse(localStorage.getItem('campask-recent-searches')) || ["Python", "CSS", "HTML"];
const defaultStudyTips = [
    "How to study effectively",
    "Active recall study method",
    "Pomodoro technique",
    "SQ3R method",
    "Exam revision tips"
];
const videoCache = {};

function renderRecommendedVideosSection() {
    let section = document.getElementById('recommended-videos-section');
    if (!section) {
        section = document.createElement('section');
        section.id = 'recommended-videos-section';
        section.className = 'dashboard-section';
        section.innerHTML = `
            <div class=\"container\">\n                <h2>Based on Your Searches</h2>\n                <div id=\"recommended-videos-list\"></div>\n            </div>\n        `;
        // Insert after Study Tools section
        const toolsSection = document.getElementById('tools');
        if (toolsSection && toolsSection.parentNode) {
            toolsSection.parentNode.insertBefore(section, toolsSection.nextSibling);
        } else {
            document.body.appendChild(section);
        }
    }
}

async function fetchYouTubeVideosForTerm(term) {
    if (videoCache[term]) return videoCache[term];
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=4&q=${encodeURIComponent(term)}&key=${YOUTUBE_API_KEY}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        videoCache[term] = data.items;
        return data.items;
    } catch (err) {
        videoCache[term] = { error: err.message };
        return { error: err.message };
    }
}

async function renderRecommendedVideos() {
    renderRecommendedVideosSection();
    const list = document.getElementById('recommended-videos-list');
    if (!list) return;
    list.innerHTML = '<div class="video-loading">Loading recommended videos...</div>';
    let html = '';
    // Use study tips if no recent searches
    const topics = (recentSearches && recentSearches.length > 0) ? recentSearches : defaultStudyTips;
    for (const term of topics) {
        html += `<div class="video-topic-block"><h3>${term}</h3>`;
        const videos = await fetchYouTubeVideosForTerm(term);
        if (videos && Array.isArray(videos)) {
            html += '<div class="video-list">';
            for (const v of videos) {
                html += `
                    <div class="video-card">
                        <a href="https://www.youtube.com/watch?v=${v.id.videoId}" target="_blank" rel="noopener" class="video-thumb-link">
                            <img src="${v.snippet.thumbnails.medium.url}" alt="${v.snippet.title}" class="video-thumb" />
                        </a>
                        <div class="video-info">
                            <a href="https://www.youtube.com/watch?v=${v.id.videoId}" target="_blank" rel="noopener" class="video-title">${v.snippet.title}</a>
                            <div class="video-channel">${v.snippet.channelTitle}</div>
                        </div>
                    </div>
                `;
            }
            html += '</div>';
        } else if (videos && videos.error) {
            html += `<div class="video-error">Error: ${videos.error}</div>`;
        } else {
            html += '<div class="video-error">No videos found.</div>';
        }
        html += '</div>';
    }
    list.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    renderRecommendedVideos();
});

// --- End YouTube Data API Integration ---
