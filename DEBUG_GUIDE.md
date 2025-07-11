# 🐛 Score Stop Extension - Debug Guide

## 🔍 Extension রান হচ্ছে না? এই গাইড Follow করুন!

### ১. প্রথম ধাপ: Extension Load হচ্ছে কিনা Check করুন

#### Chrome Extensions Page চেক করুন:
1. যান: `chrome://extensions/`
2. **"Score Stop - Score Protector"** দেখতে পাচ্ছেন?
3. **Green toggle** enable অবস্থায় আছে?
4. **"Errors"** link আছে কিনা দেখুন

### ২. Console Error চেক করুন

#### Background Script Errors:
1. `chrome://extensions/` এ যান
2. Score Stop extension এর **"background page"** link এ click করুন
3. Console এ error messages দেখুন:

**✅ সফল লগ দেখতে পাবেন:**
```
🛡️ Score Stop Background Script loaded successfully
🛡️ Score Stop: Extension installed/updated
🛡️ Score Stop: Default settings saved successfully
```

**❌ Error থাকলে:**
- Permissions missing
- Storage access denied
- Manifest syntax error

#### Content Script Errors:
1. Supported website এ যান (যেমন Kolotibablo)
2. **F12** চেপে Developer Tools খুলুন
3. **Console** tab এ যান
4. Page refresh করুন

**✅ সফল লগ দেখতে পাবেন:**
```
🛡️ Score Stop Extension loaded on: kolotibablo.com
🛡️ Score Stop Content Script fully loaded and initialized
🛡️ Score element found: Yes
```

**❌ Error থাকলে:**
- Content script inject হচ্ছে না
- Site URL match হচ্ছে না
- Permission issues

### ৩. Extension Icon চেক করুন

#### Toolbar এ Icon:
- **Browser toolbar** এ extension icon দেখা যাচ্ছে?
- **Click করলে popup** খুলছে?
- **"Extension Status: Enabled"** দেখাচ্ছে?

#### Popup Errors:
1. Extension icon এ **right-click**
2. **"Inspect popup"** select করুন
3. Console এ errors দেখুন

### ৪. Site Detection চেক করুন

#### Supported Sites:
- ✅ kolotibablo.com
- ✅ 2captcha.com  
- ✅ rucaptcha.com
- ✅ anticaptcha.com

#### Site Test:
1. একটি supported site এ যান
2. Extension popup খুলুন
3. **"Site Detected: ✅ Supported"** দেখাচ্ছে?

### ৫. Debug Elements ব্যবহার করুন

#### Extension থেকে Debug:
1. Extension popup খুলুন
2. **"Debug Elements"** বাটনে click করুন
3. Debug log দেখুন:

**চেক করুন:**
- Current Element কি detect হচ্ছে?
- Score element কোনটি?
- Business count ধরে নিচ্ছে কিনা?

### ৬. Common Problems & Solutions

#### ❌ "Content script not loaded":
**সমাধান:**
- Page refresh করুন
- Extension disable/enable করুন
- Browser restart করুন

#### ❌ "Site not supported":
**সমাধান:**
- URL check করুন
- WWW version try করুন
- HTTP/HTTPS দুটোই try করুন

#### ❌ "Score element not found":
**সমাধান:**
- Page fully load হতে দিন
- Manual Debug Elements চালান
- অন্য browser tab এ try করুন

#### ❌ "Extension disabled automatically":
**সমাধান:**
- Developer mode ON রাখুন  
- Antivirus software check করুন
- Chrome policy settings check করুন

### ৭. Advanced Debugging

#### Manual Content Script Test:
```javascript
// Console এ paste করুন (F12 → Console)
chrome.runtime.sendMessage({action: 'ping'}, (response) => {
  console.log('Extension response:', response);
});
```

#### Storage Check:
```javascript
// Console এ paste করুন  
chrome.storage.local.get(['scoreStopSettings', 'extensionEnabled'], (result) => {
  console.log('Storage data:', result);
});
```

### ৮. যদি কিছুই কাজ না করে

#### Clean Reinstall:
1. Extension **remove** করুন
2. Browser **restart** করুন  
3. `chrome://extensions/` cache clear করুন
4. Extension **fresh install** করুন

#### Alternative Method:
1. ZIP file **extract** করুন folder এ
2. **Load unpacked** ব্যবহার করুন
3. Developer tools খুলে errors check করুন

### 🚑 Emergency Help

যদি এখনও কাজ না করে:

1. **Chrome version** check করুন (88+ required)
2. **Incognito mode** এ try করুন
3. **Antivirus/Firewall** disable করুন temporarily
4. **Clean Chrome profile** দিয়ে test করুন

---

## 📞 Contact Information

সমস্যা solve না হলে এই debug info collect করুন:
- Chrome version
- Operating system  
- Extension console errors
- Site URL যেখানে test করছেন
- Extension popup screenshot

---

**Happy Debugging! 🛡️**

*90% সমস্যা এই guide follow করলে solve হয়ে যাবে!*