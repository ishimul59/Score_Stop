// Score Stop - Background Script
console.log('🛡️ Score Stop Background Script loaded successfully');

// Debug function for better error tracking
function debugLog(message, data = null) {
  const timestamp = new Date().toLocaleTimeString();
  if (data) {
    console.log(`[${timestamp}] 🛡️ Score Stop:`, message, data);
  } else {
    console.log(`[${timestamp}] 🛡️ Score Stop:`, message);
  }
}

// Extension installation
chrome.runtime.onInstalled.addListener(() => {
  debugLog('Extension installed/updated');
  
  // Set default settings
  const defaultSettings = {
    scoreStopSettings: {
      protectedScore: 0.7,
      isProtectionActive: false,
      targetScore: 0.7,
      enabled: true,
      timestamp: Date.now()
    },
    extensionEnabled: true // Default extension to enabled
  };
  
  chrome.storage.local.set(defaultSettings, () => {
    if (chrome.runtime.lastError) {
      debugLog('Error setting default settings:', chrome.runtime.lastError);
    } else {
      debugLog('Default settings saved successfully', defaultSettings);
    }
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  debugLog('Message received:', request);
  
  if (request.action === 'score_protection_activated') {
    debugLog('Score protection activated on tab:', sender.tab?.id);
    
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      title: 'Score Stop',
      message: `Score protected at ${request.score} on ${sender.tab?.url}`
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        debugLog('Notification error:', chrome.runtime.lastError);
      } else {
        debugLog('Notification created:', notificationId);
      }
    });
    
    sendResponse({ success: true });
  }
  
  if (request.action === 'get_extension_status') {
    chrome.storage.local.get(['scoreStopSettings'], (result) => {
      sendResponse({
        success: true,
        settings: result.scoreStopSettings || {}
      });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'update_settings') {
    chrome.storage.local.set({
      scoreStopSettings: request.settings
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  return true;
});

// Monitor tab updates for captcha solving sites
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if it's a captcha solving site
    const captchaSites = [
      'kolotibablo.com',
      '2captcha.com',
      'rucaptcha.com',
      'anticaptcha.com'
    ];
    
    const isCaptchaSite = captchaSites.some(site => tab.url.includes(site));
    
    if (isCaptchaSite) {
      debugLog('✅ Captcha solving site detected:', tab.url);
      
      // Test content script communication
      setTimeout(() => {
        chrome.tabs.sendMessage(tabId, { action: 'ping' }, (response) => {
          if (chrome.runtime.lastError) {
            debugLog('❌ Content script not responding:', chrome.runtime.lastError.message);
            debugLog('Will try to inject manually...');
            
            // Try manual injection
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              files: ['content.js']
            }).then(() => {
              debugLog('✅ Manual content script injection successful');
            }).catch(err => {
              debugLog('❌ Manual injection failed:', err.message);
            });
          } else {
            debugLog('✅ Content script is responding:', response);
          }
        });
      }, 1000);
    } else {
      debugLog('Site not supported:', tab.url);
    }
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
});