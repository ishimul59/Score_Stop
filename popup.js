// Score Stop - Popup Script
console.log('Score Stop popup loaded');

// DOM elements
let scoreValue, scoreLabel, statusIndicator, statusText;
let toggleBtn, resetBtn, refreshBtn, targetScore, siteStatus;
let debugLog;

// State variables
let currentTab = null;
let isProtectionActive = false;
let currentScore = 0;
let protectedScore = 0.9;

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Popup DOM loaded');
  
  // Get DOM elements
  initializeElements();
  
  // Get current tab
  await getCurrentTab();
  
  // Load initial status
  await loadStatus();
  
  // Set up event listeners
  setupEventListeners();
  
  // Start real-time updates
  startRealTimeUpdates();
});

// Initialize DOM elements
function initializeElements() {
  scoreValue = document.getElementById('scoreValue');
  scoreLabel = document.getElementById('scoreLabel');
  statusIndicator = document.getElementById('statusIndicator');
  statusText = document.getElementById('statusText');
  toggleBtn = document.getElementById('toggleBtn');
  resetBtn = document.getElementById('resetBtn');
  refreshBtn = document.getElementById('refreshBtn');
  targetScore = document.getElementById('targetScore');
  siteStatus = document.getElementById('siteStatus');
  debugLog = document.getElementById('debugLog');
}

// Get current active tab
async function getCurrentTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTab = tab;
    
    // Check if it's a captcha solving site
    if (tab && tab.url) {
      const captchaSites = [
        'kolotibablo.com',
        '2captcha.com', 
        'rucaptcha.com',
        'anticaptcha.com'
      ];
      
      const isCaptchaSite = captchaSites.some(site => tab.url.includes(site));
      updateSiteStatus(isCaptchaSite, tab.url);
    }
  } catch (error) {
    console.error('Error getting current tab:', error);
    updateSiteStatus(false, 'Error detecting site');
  }
}

// Update site detection status
function updateSiteStatus(detected, url) {
  if (siteStatus) {
    if (detected) {
      siteStatus.textContent = '✅ Supported';
      siteStatus.style.color = '#4CAF50';
    } else {
      siteStatus.textContent = '❌ Not Supported';
      siteStatus.style.color = '#ff4444';
    }
  }
}

// Load current status from content script
async function loadStatus() {
  if (!currentTab || !currentTab.id) {
    updateUI({
      score: 0,
      isActive: false,
      enabled: false
    });
    return;
  }
  
  try {
    // Send message to content script
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: 'get_score_status'
    });
    
    if (response) {
      updateUI({
        score: response.protectedScore || response.currentScore || 0,
        isActive: response.isProtectionActive || false,
        enabled: response.enabled || false,
        currentScore: response.currentScore || 0,
        protectedScore: response.protectedScore || 0.9
      });
    } else {
      updateUI({ score: 0, isActive: false, enabled: false });
    }
  } catch (error) {
    console.log('Content script not available:', error.message);
    updateUI({ score: 0, isActive: false, enabled: false });
  }
}

// Update UI with current status
function updateUI(status) {
  // Update score display
  if (scoreValue) {
    const displayScore = status.isActive ? status.protectedScore : status.currentScore;
    scoreValue.textContent = displayScore.toFixed(1);
    
    if (status.isActive) {
      scoreValue.classList.add('protected');
      scoreLabel.textContent = 'Protected Score 🛡️';
    } else {
      scoreValue.classList.remove('protected');
      scoreLabel.textContent = 'Current Score';
    }
  }
  
  // Update protection status
  if (statusIndicator && statusText) {
    if (status.isActive) {
      statusIndicator.classList.add('active');
      statusText.textContent = 'Protection Active';
    } else {
      statusIndicator.classList.remove('active');
      statusText.textContent = 'Protection Inactive';
    }
  }
  
  // Update toggle button
  if (toggleBtn) {
    if (status.isActive) {
      toggleBtn.textContent = '🛑 Deactivate Protection';
      toggleBtn.className = 'danger-btn';
    } else {
      toggleBtn.textContent = '🛡️ Activate Protection';
      toggleBtn.className = 'primary-btn';
    }
    
    toggleBtn.disabled = !status.enabled;
  }
  
  // Store current state
  isProtectionActive = status.isActive;
  currentScore = status.currentScore || 0;
  protectedScore = status.protectedScore || 0.9;
  
  // Update target score input
  if (targetScore) {
    targetScore.value = protectedScore;
  }
}

// Set up event listeners
function setupEventListeners() {
  // Toggle protection button
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleProtection);
  }
  
  // Reset protection button
  if (resetBtn) {
    resetBtn.addEventListener('click', resetProtection);
  }
  
  // Refresh status button
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshStatus);
  }
  
  // Target score input
  if (targetScore) {
    targetScore.addEventListener('change', updateTargetScore);
  }
  
  // Debug log toggle (double click on title)
  const title = document.querySelector('.title');
  if (title) {
    title.addEventListener('dblclick', toggleDebugLog);
  }
}

// Toggle protection on/off
async function toggleProtection() {
  if (!currentTab || !currentTab.id) {
    addLog('Error: No active tab');
    return;
  }
  
  try {
    toggleBtn.disabled = true;
    toggleBtn.textContent = '⏳ Processing...';
    
    const action = isProtectionActive ? 'toggle_protection' : 'toggle_protection';
    const enabled = !isProtectionActive;
    
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: action,
      enabled: enabled
    });
    
    if (response && response.success) {
      addLog(`Protection ${enabled ? 'activated' : 'deactivated'}`);
      await loadStatus(); // Refresh status
    } else {
      addLog('Error: Failed to toggle protection');
    }
  } catch (error) {
    console.error('Error toggling protection:', error);
    addLog('Error: ' + error.message);
  } finally {
    toggleBtn.disabled = false;
  }
}

// Reset protection
async function resetProtection() {
  if (!currentTab || !currentTab.id) {
    addLog('Error: No active tab');
    return;
  }
  
  try {
    resetBtn.disabled = true;
    resetBtn.textContent = '⏳ Resetting...';
    
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: 'reset_protection'
    });
    
    if (response && response.success) {
      addLog('Protection reset successfully');
      await loadStatus(); // Refresh status
    } else {
      addLog('Error: Failed to reset protection');
    }
  } catch (error) {
    console.error('Error resetting protection:', error);
    addLog('Error: ' + error.message);
  } finally {
    resetBtn.disabled = false;
    resetBtn.textContent = '🔄 Reset Protection';
  }
}

// Refresh status
async function refreshStatus() {
  refreshBtn.disabled = true;
  refreshBtn.textContent = '⏳ Refreshing...';
  
  await getCurrentTab();
  await loadStatus();
  
  setTimeout(() => {
    refreshBtn.disabled = false;
    refreshBtn.textContent = '🔍 Refresh Status';
  }, 1000);
  
  addLog('Status refreshed');
}

// Update target score
async function updateTargetScore() {
  if (!currentTab || !currentTab.id) return;
  
  const newTarget = parseFloat(targetScore.value);
  if (isNaN(newTarget) || newTarget < 0.1 || newTarget > 1.0) {
    targetScore.value = protectedScore; // Revert to previous value
    addLog('Error: Invalid target score');
    return;
  }
  
  try {
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: 'set_target_score',
      score: newTarget
    });
    
    if (response && response.success) {
      addLog(`Target score updated to ${newTarget}`);
    }
  } catch (error) {
    console.error('Error updating target score:', error);
    addLog('Error: ' + error.message);
  }
}

// Start real-time updates
function startRealTimeUpdates() {
  setInterval(async () => {
    if (document.visibilityState === 'visible') {
      await loadStatus();
    }
  }, 3000); // Update every 3 seconds
}

// Add log entry
function addLog(message) {
  if (debugLog && !debugLog.classList.contains('hidden')) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}\n`;
    debugLog.textContent += logEntry;
    debugLog.scrollTop = debugLog.scrollHeight;
  }
  console.log('Popup:', message);
}

// Toggle debug log visibility
function toggleDebugLog() {
  if (debugLog) {
    debugLog.classList.toggle('hidden');
    if (!debugLog.classList.contains('hidden')) {
      addLog('Debug log enabled');
    }
  }
}

// Listen for messages from background/content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Popup received message:', request);
  
  if (request.action === 'score_updated') {
    updateUI({
      score: request.score,
      isActive: request.isActive,
      enabled: true,
      currentScore: request.currentScore,
      protectedScore: request.protectedScore
    });
  }
  
  if (request.action === 'protection_activated') {
    addLog(`Protection activated at score ${request.score}`);
    loadStatus();
  }
  
  sendResponse({ received: true });
});

console.log('Score Stop popup script loaded');