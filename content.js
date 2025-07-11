// Score Stop - Content Script for Score Protection
console.log('🛡️ Score Stop Extension loaded on:', window.location.hostname);

// Mark as loaded to track status
window.scoreStopLoaded = true;

// Configuration
const CONFIG = {
  TARGET_SCORE: 0.7,
  MIN_SCORE: 0.6,
  MONITOR_INTERVAL: 2000, // 2 seconds
  PROTECTION_ENABLED: true,
  EXTENSION_ENABLED: true
};

// Score monitoring variables
let currentScore = 0;
let protectedScore = 0.7;
let isProtectionActive = false;
let scoreElement = null;
let originalScore = 0;
let scoreObserver = null;

// Common score selectors for different sites (prioritized order)
const SCORE_SELECTORS = [
  // Kolotibablo specific (high priority)
  '.rating', '#rating', '.user-rating',
  '[class*="rating"]:not([class*="count"])',
  '[id*="rating"]:not([id*="count"])',
  
  // Score selectors (avoid count/business)
  '.score:not([class*="count"]):not([class*="business"])', 
  '#score:not([id*="count"]):not([id*="business"])',
  '.user-score', '.accuracy', '#accuracy',
  
  // 2captcha specific
  '.rate', '#rate', '.balance', '#balance',
  
  // Generic selectors (lower priority)
  '[data-score]:not([data-count])', '[data-rating]:not([data-count])',
  '[class*="score"]:not([class*="count"]):not([class*="business"])',
  '[id*="score"]:not([id*="count"]):not([id*="business"])'
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
  console.log('🔍 Searching for score element...');
  
  // First try specific selectors
  for (const selector of SCORE_SELECTORS) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      if (isValidScoreElement(element) && !isBusinessCountElement(element)) {
        scoreElement = element;
        originalScore = parseFloat(element.textContent) || 0;
        console.log('✅ Score element found:', selector, 'Current score:', originalScore, element);
        return true;
      }
    }
  }
  
  // If not found, try more generic approach with filtering
  const allElements = document.querySelectorAll('*');
  const potentialScoreElements = [];
  
  for (const element of allElements) {
    const text = element.textContent.trim();
    if (isScoreText(text) && element.children.length === 0 && !isBusinessCountElement(element)) {
      potentialScoreElements.push({
        element,
        text,
        score: parseFloat(text.replace(/[^\d.]/g, ''))
      });
    }
  }
  
  // Sort by most likely to be actual score (not count)
  potentialScoreElements.sort((a, b) => {
    // Prefer elements with decimal scores (0.XX format)
    const aIsDecimal = a.score < 1.0;
    const bIsDecimal = b.score < 1.0;
    if (aIsDecimal && !bIsDecimal) return -1;
    if (!aIsDecimal && bIsDecimal) return 1;
    return 0;
  });
  
  if (potentialScoreElements.length > 0) {
    const best = potentialScoreElements[0];
    scoreElement = best.element;
    originalScore = best.score;
    console.log('✅ Score element found via analysis:', best.text, 'Score:', originalScore);
    return true;
  }
  
  console.log('❌ Score element not found, will retry...');
  return false;
}

// Check if element is likely a business count (not score)
function isBusinessCountElement(element) {
  const text = element.textContent.toLowerCase();
  const className = element.className.toLowerCase();
  const id = element.id.toLowerCase();
  
  // Avoid elements that are clearly counts/business metrics
  const businessKeywords = ['count', 'total', 'business', 'task', 'job', 'work', 'complete'];
  
  return businessKeywords.some(keyword => 
    text.includes(keyword) || className.includes(keyword) || id.includes(keyword)
  );
}

// Check if element contains valid score
function isValidScoreElement(element) {
  const text = element.textContent.trim();
  return isScoreText(text);
}

// Check if text represents a score
function isScoreText(text) {
  // Clean the text
  const cleanText = text.trim().replace(/[^\d.%]/g, '');
  
  // Score patterns: 0.95, 95%, 0.9, etc. (but not large numbers like counts)
  const scorePattern = /^(0?\.\d{1,3}|\d{1,2}(\.\d{1,3})?%?)$/;
  
  if (!scorePattern.test(cleanText)) return false;
  
  const numValue = parseFloat(cleanText);
  if (isNaN(numValue)) return false;
  
  // Valid score ranges (0.0 to 1.0 or 0% to 100%)
  if (cleanText.includes('%')) {
    return numValue >= 0 && numValue <= 100;
  } else {
    return numValue >= 0 && numValue <= 1.0;
  }
}

// Start monitoring score changes
function startScoreMonitoring() {
  // Continuous monitoring
  setInterval(() => {
    // Only monitor if extension is enabled
    if (!CONFIG.EXTENSION_ENABLED) return;
    
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
  if (!scoreElement || !CONFIG.PROTECTION_ENABLED || !CONFIG.EXTENSION_ENABLED) return;
  
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
  // Debug logging (less frequent)
  if (Math.random() < 0.1) { // Only log 10% of the time to avoid spam
    console.log('🔍 Score Check:', {
      displayed: displayedScore,
      protected: protectedScore,
      active: isProtectionActive,
      element: scoreElement?.tagName + (scoreElement?.className ? '.' + scoreElement.className : ''),
      elementText: scoreElement?.textContent?.trim()
    });
  }
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
    scoreStopSettings: settings,
    extensionEnabled: CONFIG.EXTENSION_ENABLED
  });
}

// Load settings from storage
function loadSettings() {
  chrome.storage.local.get(['scoreStopSettings', 'extensionEnabled'], (result) => {
    if (result.scoreStopSettings) {
      const settings = result.scoreStopSettings;
      protectedScore = settings.protectedScore || CONFIG.TARGET_SCORE;
      isProtectionActive = settings.isProtectionActive || false;
      
      console.log('Settings loaded:', settings);
    }
    
    // Load extension enabled status
    if (result.extensionEnabled !== undefined) {
      CONFIG.EXTENSION_ENABLED = result.extensionEnabled;
      console.log('Extension enabled status:', CONFIG.EXTENSION_ENABLED);
    }
  });
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('🛡️ Score content received message:', request);
  
  if (request.action === 'ping') {
    sendResponse({ 
      success: true, 
      loaded: true, 
      url: window.location.href,
      scoreElement: scoreElement ? 'found' : 'not found'
    });
    return true;
  }
  
  if (request.action === 'toggle_protection') {
    CONFIG.PROTECTION_ENABLED = request.enabled;
    sendResponse({ success: true, enabled: CONFIG.PROTECTION_ENABLED });
  }
  
  if (request.action === 'get_score_status') {
    sendResponse({
      currentScore,
      protectedScore,
      isProtectionActive,
      enabled: CONFIG.PROTECTION_ENABLED,
      extensionEnabled: CONFIG.EXTENSION_ENABLED
    });
  }
  
  if (request.action === 'reset_protection') {
    isProtectionActive = false;
    protectedScore = CONFIG.TARGET_SCORE;
    
    // Remove protection styling
    if (scoreElement) {
      scoreElement.classList.remove('score-protected');
      scoreElement.removeAttribute('title');
    }
    
    saveSettings();
    showNotification('Protection Reset', 'Score protection has been reset');
    sendResponse({ success: true });
  }
  
  if (request.action === 'set_target_score') {
    CONFIG.TARGET_SCORE = request.score;
    protectedScore = request.score; // Update protected score too
    saveSettings();
    sendResponse({ success: true });
  }
  
  if (request.action === 'activate_protection_manual') {
    const targetScoreValue = request.targetScore || CONFIG.TARGET_SCORE;
    
    // Force activate protection at specified score
    CONFIG.TARGET_SCORE = targetScoreValue;
    activateProtection(targetScoreValue);
    
    sendResponse({ success: true, protectedScore: targetScoreValue });
  }
  
  if (request.action === 'debug_score_elements') {
    const debugInfo = getDebugInfo();
    sendResponse({ success: true, debugInfo });
  }
  
  if (request.action === 'toggle_extension') {
    CONFIG.EXTENSION_ENABLED = request.enabled;
    
    if (!CONFIG.EXTENSION_ENABLED) {
      // If extension is disabled, reset protection
      isProtectionActive = false;
      
      // Remove protection styling
      if (scoreElement) {
        scoreElement.classList.remove('score-protected');
        scoreElement.removeAttribute('title');
      }
      
      showNotification('Extension Disabled', 'Score protection has been turned off');
    } else {
      showNotification('Extension Enabled', 'Score protection is now active');
    }
    
    saveSettings();
    sendResponse({ success: true, enabled: CONFIG.EXTENSION_ENABLED });
  }
  
  return true; // Keep channel open for async response
});

// Get debug information about detected elements
function getDebugInfo() {
  const allPotentialElements = [];
  
  // Check all selectors
  for (const selector of SCORE_SELECTORS) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      allPotentialElements.push({
        selector,
        text: element.textContent.trim(),
        tagName: element.tagName,
        className: element.className,
        id: element.id,
        isValid: isValidScoreElement(element),
        isBusinessCount: isBusinessCountElement(element),
        isCurrent: element === scoreElement
      });
    }
  }
  
  return {
    currentElement: scoreElement ? {
      text: scoreElement.textContent.trim(),
      tagName: scoreElement.tagName,
      className: scoreElement.className,
      id: scoreElement.id
    } : null,
    currentScore,
    protectedScore,
    isProtectionActive,
    allPotentialElements
  };
}

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

console.log('🛡️ Score Stop Content Script fully loaded and initialized');
console.log('🛡️ Current configuration:', CONFIG);
console.log('🛡️ Score element found:', scoreElement ? 'Yes' : 'No');
console.log('🛡️ Extension ready for:', window.location.hostname);