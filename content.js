// Content script for hCaptcha Solver Host
console.log('hCaptcha Solver content script loaded');

// Check if hCaptcha is present on the page
function detectHCaptcha() {
  const hcaptchaElements = document.querySelectorAll('[data-hcaptcha-widget-id], .h-captcha, iframe[src*="hcaptcha"]');
  return hcaptchaElements.length > 0;
}

// Monitor for hCaptcha appearance
function monitorForCaptcha() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        for (let node of mutation.addedNodes) {
          if (node.nodeType === 1) { // Element node
            // Check if hCaptcha was added
            if (node.querySelector && (
              node.querySelector('[data-hcaptcha-widget-id]') ||
              node.querySelector('.h-captcha') ||
              node.querySelector('iframe[src*="hcaptcha"]')
            )) {
              console.log('hCaptcha detected via mutation observer');
              notifyBackgroundScript();
              break;
            }
          }
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Notify background script about captcha detection
function notifyBackgroundScript() {
  chrome.runtime.sendMessage({
    action: 'captcha_detected',
    url: window.location.href,
    timestamp: Date.now()
  }, (response) => {
    console.log('Background script response:', response);
  });
}

// Add solve button to hCaptcha
function addSolveButton() {
  const hcaptchaContainers = document.querySelectorAll('.h-captcha');
  
  hcaptchaContainers.forEach((container, index) => {
    // Check if button already exists
    if (container.querySelector('.hcaptcha-solver-btn')) {
      return;
    }
    
    const solveButton = document.createElement('button');
    solveButton.className = 'hcaptcha-solver-btn';
    solveButton.textContent = 'Auto Solve';
    solveButton.style.cssText = `
      background: #4CAF50;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin: 10px 0;
      font-size: 14px;
      font-weight: bold;
    `;
    
    solveButton.addEventListener('click', () => {
      console.log('Solve button clicked');
      chrome.runtime.sendMessage({
        action: 'solve_captcha',
        containerIndex: index
      });
    });
    
    container.parentNode.insertBefore(solveButton, container.nextSibling);
  });
}

// Initialize when page loads
function initialize() {
  console.log('Initializing hCaptcha solver...');
  
  // Check for existing captcha
  if (detectHCaptcha()) {
    console.log('hCaptcha found on page load');
    notifyBackgroundScript();
    addSolveButton();
  }
  
  // Monitor for new captcha
  monitorForCaptcha();
  
  // Periodically check and add solve buttons
  setInterval(() => {
    if (detectHCaptcha()) {
      addSolveButton();
    }
  }, 2000);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'check_captcha') {
    const hasCaptcha = detectHCaptcha();
    sendResponse({ hasCaptcha });
  }
  
  if (request.action === 'add_solve_buttons') {
    addSolveButton();
    sendResponse({ success: true });
  }
});