# Score Stop Extension - ইনস্টল গাইড 🛡️

## 📁 এই ZIP ফাইলে কী আছে:
- `manifest.json` - Extension এর configuration
- `content.js` - Score protection logic
- `background.js` - Background service
- `popup.html` - Extension UI
- `popup.js` - UI functionality

## 🚀 কিভাবে ইনস্টল করবেন:

### Step 1: ZIP Extract করুন
1. এই ZIP file কোন ফোল্ডারে extract করুন
2. নিশ্চিত করুন যে সব 5টি files আছে

### Step 2: Chrome এ Load করুন
1. Chrome browser খুলুন
2. Address bar এ লিখুন: `chrome://extensions/`
3. "Developer mode" toggle ON করুন
4. "Load unpacked" ক্লিক করুন
5. Extract করা folder টি select করুন

### Step 3: Test করুন
1. Kolotibablo.com এ যান
2. Extension icon ক্লিক করুন
3. "Site Detected: ✅ Supported" দেখতে পাবেন

## ✨ কিভাবে কাজ করে:
- Score যখন 0.9 এ পৌঁছাবে automatic protection চালু হবে
- Score 0.9 এ freeze হয়ে যাবে
- High rate পেতে থাকবেন!

## 🔧 সমস্যা হলে:
- Page refresh করুন
- Extension reload করুন
- Console error check করুন (F12)

**Made with ❤️ for Captcha Workers**