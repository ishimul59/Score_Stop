// Background script for hCaptcha Solver Host
console.log('hCaptcha Solver Host background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('hCaptcha Solver Host extension installed');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  if (request.action === 'captcha_detected') {
    console.log('hCaptcha detected on page:', sender.tab.url);
    // Handle captcha detection logic here
    sendResponse({success: true, message: 'Captcha detection acknowledged'});
  }
  
  if (request.action === 'solve_captcha') {
    console.log('Solving captcha request received for tab:', request.tabId);
    handleCaptchaSolving(request, sendResponse);
    return true; // Keep channel open for async response
  }
  
  return true; // Keep message channel open for async response
});

// Listen for tab updates to detect captcha pages
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Check if page might have captcha
    if (tab.url.includes('hcaptcha') || tab.url.includes('captcha')) {
      console.log('Potential captcha page detected:', tab.url);
    }
  }
});