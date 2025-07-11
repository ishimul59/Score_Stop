// Score Stop - Background Script
console.log('Score Stop Background Script loaded');

// Extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Score Stop Extension installed');
  
  // Set default settings
  chrome.storage.local.set({
    scoreStopSettings: {
      protectedScore: 0.7,
      isProtectionActive: false,
      targetScore: 0.7,
      enabled: true,
      timestamp: Date.now()
    }
  });
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'score_protection_activated') {
    console.log('Score protection activated on tab:', sender.tab?.id);
    
    // Show notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'Score Stop',
      message: `Score protected at ${request.score} on ${sender.tab?.url}`
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
      console.log('Captcha solving site detected:', tab.url);
      
      // Inject content script if needed
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => {
          console.log('Score Stop checking if already loaded...');
          if (!window.scoreStopLoaded) {
            console.log('Score Stop not loaded, will load via manifest');
          }
        }
      }).catch(err => {
        console.log('Script injection info:', err.message);
      });
    }
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked on tab:', tab.id);
});