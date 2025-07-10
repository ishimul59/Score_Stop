// Score Stop - Content Script for Score Protection
console.log('Score Stop Extension loaded on:', window.location.hostname);

// Configuration
const CONFIG = {
  TARGET_SCORE: 0.9,
  MIN_SCORE: 0.85,
  MONITOR_INTERVAL: 2000, // 2 seconds
  PROTECTION_ENABLED: true
};

// Score monitoring variables
let currentScore = 0;
let protectedScore = 0.9;
let isProtectionActive = false;
let scoreElement = null;
let originalScore = 0;
let scoreObserver = null;

// Common score selectors for different sites
const SCORE_SELECTORS = [
  // Kolotibablo
  '.score', '#score', '.rating', '#rating',
  '[class*="score"]', '[id*="score"]',
  '[class*="rating"]', '[id*="rating"]',
  
  // 2captcha
  '.balance', '#balance', '.rate', '#rate',
  
  // Generic selectors
  '[data-score]', '[data-rating]', 
  '.user-score', '.user-rating',
  '.accuracy', '#accuracy'
];

// Initialize score protection
function initializeScoreProtection() {
  console.log('Initializing Score Protection...');
  
  // Load saved settings
  loadSettings();
  
  // Find score element
  findScoreElement();
  
  // Start monitoring
  startScoreMonitoring();
  
  // Add CSS to hide score fluctuations
  addProtectionStyles();
  
  console.log('Score Protection initialized');
}

// Find score element on page
function findScoreElement() {
  for (const selector of SCORE_SELECTORS) {
    const element = document.querySelector(selector);
    if (element && isValidScoreElement(element)) {
      scoreElement = element;
      originalScore = parseFloat(element.textContent) || 0;
      console.log('Score element found:', selector, 'Current score:', originalScore);
      return true;
    }
  }
  
  // If not found, try more generic approach
  const allElements = document.querySelectorAll('*');
  for (const element of allElements) {
    const text = element.textContent.trim();
    if (isScoreText(text) && element.children.length === 0) {
      scoreElement = element;
      originalScore = parseFloat(text) || 0;
      console.log('Score element found via text analysis:', text);
      return true;
    }
  }
  
  console.log('Score element not found, will retry...');
  return false;
}

// Check if element contains valid score
function isValidScoreElement(element) {
  const text = element.textContent.trim();
  return isScoreText(text);
}

// Check if text represents a score
function isScoreText(text) {
  // Score patterns: 0.95, 95%, 0.9, etc.
  const scorePattern = /^(0?\.\d{1,2}|\d{1,2}(\.\d{1,2})?%?)$/;
  return scorePattern.test(text) && !isNaN(parseFloat(text));
}

// Start monitoring score changes
function startScoreMonitoring() {
  // Continuous monitoring
  setInterval(() => {
    if (!scoreElement) {
      findScoreElement();
      return;
    }
    
    checkAndProtectScore();
  }, CONFIG.MONITOR_INTERVAL);
  
  // DOM observer for real-time changes
  if (scoreElement) {
    scoreObserver = new MutationObserver(() => {
      checkAndProtectScore();
    });
    
    scoreObserver.observe(scoreElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
}

// Main score protection logic
function checkAndProtectScore() {
  if (!scoreElement || !CONFIG.PROTECTION_ENABLED) return;
  
  const displayedScore = parseFloat(scoreElement.textContent) || 0;
  
  // Update current score tracking
  if (!isProtectionActive) {
    currentScore = displayedScore;
    originalScore = displayedScore;
  }
  
  // Check if score reached target
  if (displayedScore >= CONFIG.TARGET_SCORE && !isProtectionActive) {
    activateProtection(displayedScore);
  }
  
  // Maintain protected score
  if (isProtectionActive && displayedScore < protectedScore) {
    maintainProtectedScore();
  }
  
  // Log score changes
  console.log('Score check:', {
    displayed: displayedScore,
    protected: protectedScore,
    active: isProtectionActive
  });
}

// Activate score protection
function activateProtection(score) {
  isProtectionActive = true;
  protectedScore = Math.max(score, CONFIG.TARGET_SCORE);
  
  console.log('🛡️ Score Protection ACTIVATED at:', protectedScore);
  
  // Save to storage
  saveSettings();
  
  // Notify user
  showNotification('Score Protection Activated!', `Score locked at ${protectedScore}`);
  
  // Maintain the score display
  maintainProtectedScore();
}

// Maintain protected score display
function maintainProtectedScore() {
  if (!scoreElement || !isProtectionActive) return;
  
  const currentDisplay = scoreElement.textContent.trim();
  const expectedDisplay = protectedScore.toString();
  
  if (currentDisplay !== expectedDisplay) {
    // Override the displayed score
    scoreElement.textContent = expectedDisplay;
    
    // Add protection indicator
    if (!scoreElement.classList.contains('score-protected')) {
      scoreElement.classList.add('score-protected');
      scoreElement.title = 'Score Protected by Score Stop Extension';
    }
  }
}

// Add CSS styles for protection
function addProtectionStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .score-protected {
      background: linear-gradient(90deg, #4CAF50, #45a049) !important;
      color: white !important;
      padding: 2px 6px !important;
      border-radius: 4px !important;
      font-weight: bold !important;
      border: 2px solid #2e7d32 !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
    }
    
    .score-protected::after {
      content: ' 🛡️';
      font-size: 0.8em;
    }
  `;
  document.head.appendChild(style);
}

// Show notification to user
function showNotification(title, message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 999999;
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 300px;
  `;
  
  notification.innerHTML = `
    <strong>${title}</strong><br>
    ${message}
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Save settings to storage
function saveSettings() {
  const settings = {
    protectedScore,
    isProtectionActive,
    targetScore: CONFIG.TARGET_SCORE,
    timestamp: Date.now()
  };
  
  chrome.storage.local.set({
    scoreStopSettings: settings
  });
}

// Load settings from storage
function loadSettings() {
  chrome.storage.local.get(['scoreStopSettings'], (result) => {
    if (result.scoreStopSettings) {
      const settings = result.scoreStopSettings;
      protectedScore = settings.protectedScore || CONFIG.TARGET_SCORE;
      isProtectionActive = settings.isProtectionActive || false;
      
      console.log('Settings loaded:', settings);
    }
  });
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Score content received message:', request);
  
  if (request.action === 'toggle_protection') {
    CONFIG.PROTECTION_ENABLED = request.enabled;
    sendResponse({ success: true, enabled: CONFIG.PROTECTION_ENABLED });
  }
  
  if (request.action === 'get_score_status') {
    sendResponse({
      currentScore,
      protectedScore,
      isProtectionActive,
      enabled: CONFIG.PROTECTION_ENABLED
    });
  }
  
  if (request.action === 'reset_protection') {
    isProtectionActive = false;
    protectedScore = CONFIG.TARGET_SCORE;
    saveSettings();
    sendResponse({ success: true });
  }
  
  if (request.action === 'set_target_score') {
    CONFIG.TARGET_SCORE = request.score;
    sendResponse({ success: true });
  }
});

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeScoreProtection);
} else {
  initializeScoreProtection();
}

// Re-initialize on page changes (for SPA sites)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(initializeScoreProtection, 1000);
  }
}).observe(document, { subtree: true, childList: true });

console.log('Score Stop Content Script fully loaded');