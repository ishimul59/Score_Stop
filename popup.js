// Score Stop - Popup Script
console.log('Score Stop popup loaded');

// DOM elements
let scoreValue, scoreLabel, statusIndicator, statusText;
let toggleBtn, resetBtn, refreshBtn, debugBtn, targetScore, siteStatus;
let debugLog, extensionToggle, extensionStatus;

// State variables
let currentTab = null;
let isProtectionActive = false;
let currentScore = 0;
let protectedScore = 0.7;
let isExtensionEnabled = true;

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
  debugBtn = document.getElementById('debugBtn');
  targetScore = document.getElementById('targetScore');
  siteStatus = document.getElementById('siteStatus');
  debugLog = document.getElementById('debugLog');
  extensionToggle = document.getElementById('extensionToggle');
  extensionStatus = document.getElementById('extensionStatus');
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
  // First load extension status from storage
  const storageResult = await chrome.storage.local.get(['extensionEnabled']);
  const extensionEnabled = storageResult.extensionEnabled !== false; // Default to true if not set
  
  if (!currentTab || !currentTab.id) {
    updateUI({
      score: 0,
      isActive: false,
      enabled: false,
      extensionEnabled: extensionEnabled
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
        protectedScore: response.protectedScore || 0.7,
        extensionEnabled: response.extensionEnabled !== false && extensionEnabled
      });
    } else {
      updateUI({ score: 0, isActive: false, enabled: false, extensionEnabled: extensionEnabled });
    }
  } catch (error) {
    console.log('Content script not available:', error.message);
    updateUI({ score: 0, isActive: false, enabled: false, extensionEnabled: extensionEnabled });
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
      toggleBtn.textContent = '🛑 Stop Protection';
      toggleBtn.className = 'danger-btn';
      toggleBtn.disabled = false;
    } else {
      const targetValue = parseFloat(targetScore?.value || 0.7);
      toggleBtn.textContent = `🛡️ Protect at ${targetValue}`;
      toggleBtn.className = 'primary-btn';
      toggleBtn.disabled = false; // Always enable manual activation
    }
  }
  
  // Update extension toggle
  if (extensionToggle && extensionStatus) {
    isExtensionEnabled = status.extensionEnabled !== false;
    extensionToggle.checked = isExtensionEnabled;
    extensionStatus.textContent = isExtensionEnabled ? 'Enabled' : 'Disabled';
    extensionStatus.style.color = isExtensionEnabled ? '#4CAF50' : '#ff4444';
    
    // Disable/enable all other controls based on extension status
    const controlsContainer = document.querySelector('.controls');
    const settingsCards = document.querySelectorAll('.status-card:not(:first-child)');
    
    if (isExtensionEnabled) {
      controlsContainer?.classList.remove('extension-disabled');
      settingsCards.forEach(card => card.classList.remove('extension-disabled'));
    } else {
      controlsContainer?.classList.add('extension-disabled');
      settingsCards.forEach(card => card.classList.add('extension-disabled'));
    }
  }
  
  // Store current state
  isProtectionActive = status.isActive;
  currentScore = status.currentScore || 0;
  protectedScore = status.protectedScore || 0.7;
  
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
  
  // Debug button
  if (debugBtn) {
    debugBtn.addEventListener('click', debugElements);
  }
  
  // Target score input
  if (targetScore) {
    targetScore.addEventListener('change', updateTargetScore);
  }
  
  // Extension toggle
  if (extensionToggle) {
    extensionToggle.addEventListener('change', toggleExtension);
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
    
    if (isProtectionActive) {
      // Deactivate protection
      const response = await chrome.tabs.sendMessage(currentTab.id, {
        action: 'reset_protection'
      });
      
      if (response && response.success) {
        addLog('Protection deactivated');
        await loadStatus();
      } else {
        addLog('Error: Failed to deactivate protection');
      }
    } else {
      // Activate protection manually at current target score
      const targetScoreValue = parseFloat(targetScore.value) || 0.7;
      
      const response = await chrome.tabs.sendMessage(currentTab.id, {
        action: 'activate_protection_manual',
        targetScore: targetScoreValue
      });
      
      if (response && response.success) {
        addLog(`Protection activated at ${targetScoreValue}`);
        await loadStatus();
      } else {
        addLog('Error: Failed to activate protection');
      }
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

// Debug elements detection
async function debugElements() {
  if (!currentTab || !currentTab.id) {
    addLog('Error: No active tab');
    return;
  }
  
  try {
    debugBtn.disabled = true;
    debugBtn.textContent = '⏳ Debugging...';
    
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: 'debug_score_elements'
    });
    
    if (response && response.success) {
      const debugInfo = response.debugInfo;
      
      // Show debug log
      if (debugLog) {
        debugLog.classList.remove('hidden');
      }
      
      addLog('=== DEBUG INFO ===');
      addLog(`Current Element: ${debugInfo.currentElement ? 
        `${debugInfo.currentElement.tagName}.${debugInfo.currentElement.className} = "${debugInfo.currentElement.text}"` : 
        'None found'}`);
      addLog(`Current Score: ${debugInfo.currentScore}`);
      addLog(`Protected Score: ${debugInfo.protectedScore}`);
      addLog(`Protection Active: ${debugInfo.isProtectionActive}`);
      addLog('');
      addLog('All Potential Elements:');
      
      debugInfo.allPotentialElements.forEach((element, index) => {
        const status = element.isCurrent ? '[CURRENT]' : 
                      element.isBusinessCount ? '[BUSINESS COUNT]' : 
                      element.isValid ? '[VALID]' : '[INVALID]';
        addLog(`${index + 1}. ${status} ${element.selector}: "${element.text}"`);
      });
      
      addLog('=== END DEBUG ===');
    } else {
      addLog('Error: Failed to get debug info');
    }
  } catch (error) {
    console.error('Error debugging elements:', error);
    addLog('Error: ' + error.message);
  } finally {
    debugBtn.disabled = false;
    debugBtn.textContent = '🐛 Debug Elements';
  }
}

// Update target score
async function updateTargetScore() {
  if (!currentTab || !currentTab.id) {
    addLog('Error: No active tab');
    return;
  }
  
  const newTarget = parseFloat(targetScore.value);
  
  // Better validation for score range
      if (isNaN(newTarget) || newTarget < 0.1 || newTarget > 1.0) {
      targetScore.value = (protectedScore || 0.7).toFixed(1); // Revert to previous value
    addLog('Error: Target score must be between 0.1 and 1.0');
    showTemporaryError('Invalid score range (0.1 - 1.0)');
    return;
  }
  
  try {
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: 'set_target_score',
      score: newTarget
    });
    
    if (response && response.success) {
      protectedScore = newTarget; // Update local state
      addLog(`✅ Target score updated to ${newTarget}`);
      showTemporarySuccess(`Target set to ${newTarget}`);
    } else {
      addLog('Error: Failed to update target score');
      showTemporaryError('Failed to update target score');
    }
  } catch (error) {
    console.error('Error updating target score:', error);
    addLog('Error: ' + error.message);
    showTemporaryError('Communication error');
  }
}

// Show temporary success message
function showTemporarySuccess(message) {
  const input = targetScore;
  const originalColor = input.style.borderColor;
  input.style.borderColor = '#4CAF50';
  input.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.5)';
  
  setTimeout(() => {
    input.style.borderColor = originalColor;
    input.style.boxShadow = '';
  }, 2000);
}

// Show temporary error message
function showTemporaryError(message) {
  const input = targetScore;
  const originalColor = input.style.borderColor;
  input.style.borderColor = '#f44336';
  input.style.boxShadow = '0 0 5px rgba(244, 67, 54, 0.5)';
  
  setTimeout(() => {
    input.style.borderColor = originalColor;
    input.style.boxShadow = '';
  }, 2000);
}

// Toggle extension on/off
async function toggleExtension() {
  if (!currentTab || !currentTab.id) {
    addLog('Error: No active tab');
    return;
  }
  
  try {
    const enabled = extensionToggle.checked;
    
    // Save extension status to storage
    await chrome.storage.local.set({
      extensionEnabled: enabled
    });
    
    // Notify content script
    const response = await chrome.tabs.sendMessage(currentTab.id, {
      action: 'toggle_extension',
      enabled: enabled
    });
    
    if (response && response.success) {
      addLog(`Extension ${enabled ? 'enabled' : 'disabled'}`);
      
      // Update UI immediately
      updateUI({
        score: currentScore,
        isActive: enabled ? isProtectionActive : false,
        enabled: enabled,
        currentScore: currentScore,
        protectedScore: protectedScore,
        extensionEnabled: enabled
      });
      
      // Show notification
      if (enabled) {
        showTemporarySuccess('Extension enabled');
      } else {
        showTemporaryError('Extension disabled');
      }
      
    } else {
      addLog('Error: Failed to toggle extension');
      // Revert toggle state
      extensionToggle.checked = !enabled;
    }
  } catch (error) {
    console.error('Error toggling extension:', error);
    addLog('Error: ' + error.message);
    // Revert toggle state
    extensionToggle.checked = !extensionToggle.checked;
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