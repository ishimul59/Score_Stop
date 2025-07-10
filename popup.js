// Popup script for hCaptcha Solver Host
console.log('hCaptcha Solver popup loaded');

// DOM elements
let statusText, captchaCount, solveBtn, refreshBtn, settingsBtn;

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup DOM loaded');
  
  // Get DOM elements
  statusText = document.getElementById('statusText');
  captchaCount = document.getElementById('captchaCount');
  solveBtn = document.getElementById('solveBtn');
  refreshBtn = document.getElementById('refreshBtn');
  settingsBtn = document.getElementById('settingsBtn');
  
  // Add event listeners
  solveBtn.addEventListener('click', solveCaptcha);
  refreshBtn.addEventListener('click', refreshDetection);
  settingsBtn.addEventListener('click', openSettings);
  
  // Initial check
  await checkCurrentTab();
});

// Check current tab for captcha
async function checkCurrentTab() {
  try {
    updateStatus('Checking current tab...', 'Scanning for hCaptcha');
    
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      updateStatus('Error: No active tab', 'Please refresh the page');
      return;
    }
    
    // Send message to content script to check for captcha
    chrome.tabs.sendMessage(tab.id, { action: 'check_captcha' }, (response) => {
      if (chrome.runtime.lastError) {
        console.log('Content script not ready:', chrome.runtime.lastError.message);
        updateStatus('Content script loading...', 'Please refresh the page if needed');
        return;
      }
      
      if (response && response.hasCaptcha) {
        updateStatus('hCaptcha detected!', 'Ready to solve');
        enableSolveButton();
      } else {
        updateStatus('No hCaptcha found', 'Navigate to a page with hCaptcha');
        disableSolveButton();
      }
    });
    
  } catch (error) {
    console.error('Error checking tab:', error);
    updateStatus('Error checking tab', error.message);
  }
}

// Update status display
function updateStatus(main, sub) {
  if (statusText) statusText.textContent = main;
  if (captchaCount) captchaCount.textContent = sub;
}

// Enable solve button
function enableSolveButton() {
  if (solveBtn) {
    solveBtn.disabled = false;
    solveBtn.classList.remove('disabled');
    solveBtn.textContent = '🚀 Auto Solve Current Page';
  }
}

// Disable solve button
function disableSolveButton() {
  if (solveBtn) {
    solveBtn.disabled = true;
    solveBtn.classList.add('disabled');
    solveBtn.textContent = '❌ No Captcha Found';
  }
}

// Solve captcha function
async function solveCaptcha() {
  try {
    updateStatus('Solving hCaptcha...', 'Please wait...');
    solveBtn.textContent = '⏳ Solving...';
    solveBtn.disabled = true;
    
    // Get current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }
    
    // Send solve request to background script
    chrome.runtime.sendMessage({
      action: 'solve_captcha',
      tabId: tab.id,
      url: tab.url
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Background script error:', chrome.runtime.lastError);
        updateStatus('Error communicating with background', 'Please try again');
        resetSolveButton();
        return;
      }
      
      if (response && response.success) {
        updateStatus('Captcha solving initiated!', 'Check the page for progress');
        setTimeout(() => {
          checkCurrentTab(); // Recheck after solving attempt
        }, 2000);
      } else {
        updateStatus('Failed to solve captcha', response?.message || 'Unknown error');
        resetSolveButton();
      }
    });
    
  } catch (error) {
    console.error('Error solving captcha:', error);
    updateStatus('Error solving captcha', error.message);
    resetSolveButton();
  }
}

// Reset solve button to normal state
function resetSolveButton() {
  if (solveBtn) {
    solveBtn.disabled = false;
    solveBtn.textContent = '🚀 Auto Solve Current Page';
  }
}

// Refresh detection
async function refreshDetection() {
  refreshBtn.textContent = '🔄 Refreshing...';
  refreshBtn.disabled = true;
  
  await checkCurrentTab();
  
  setTimeout(() => {
    refreshBtn.textContent = '🔄 Refresh Detection';
    refreshBtn.disabled = false;
  }, 1000);
}

// Open settings (placeholder)
function openSettings() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('settings.html')
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Popup received message:', request);
  
  if (request.action === 'captcha_status_update') {
    updateStatus(request.status, request.details);
  }
  
  if (request.action === 'solving_complete') {
    if (request.success) {
      updateStatus('Captcha solved successfully!', 'Page should be updated');
    } else {
      updateStatus('Failed to solve captcha', request.error || 'Unknown error');
    }
    resetSolveButton();
  }
  
  sendResponse({ received: true });
});

// Auto-refresh status every 5 seconds
setInterval(() => {
  if (document.visibilityState === 'visible') {
    checkCurrentTab();
  }
}, 5000);