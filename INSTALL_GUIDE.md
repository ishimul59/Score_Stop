# 📦 Score Stop Extension - ইনস্টলেশন গাইড

## 🚀 সহজ ইনস্টলেশন স্টেপ

### ১. ফাইল প্রস্তুতি:
```
✅ সব ফাইল একটি folder এ রাখুন:
   - manifest.json
   - background.js  
   - content.js
   - popup.html
   - popup.js
   - README.md
```

### ২. Chrome এ Extension Load করুন:

#### Step 1: Developer Mode চালু করুন
1. Chrome browser খুলুন
2. Address bar এ টাইপ করুন: `chrome://extensions/`
3. উপরের ডান দিকে **"Developer mode"** toggle switch **ON** করুন

#### Step 2: Extension Load করুন  
1. **"Load unpacked"** বাটনে click করুন
2. আপনার extension folder select করুন
3. **"Select Folder"** বাটনে click করুন

#### Step 3: Verify Installation
1. Extension list এ **"Score Stop - Score Protector"** দেখতে পাবেন
2. এটি **Enabled** অবস্থায় আছে কিনা check করুন
3. Browser toolbar এ extension icon দেখতে পাবেন

## 🛠️ যদি Problem হয়:

### ❌ "Failed to load extension" Error:
- Check করুন সব ফাইল same folder এ আছে কিনা
- manifest.json file ঠিক আছে কিনা verify করুন
- Folder name এ special character আছে কিনা দেখুন

### ❌ "Manifest file is missing or unreadable":
- manifest.json file present আছে কিনা check করুন
- File টি corrupt হয়নি তো দেখুন
- File permission ঠিক আছে কিনা verify করুন

### ❌ Extension icon দেখাচ্ছে না:
- Extension enabled আছে কিনা check করুন
- Browser restart করে দেখুন
- chrome://extensions/ এ গিয়ে extension reload করুন

## ✅ সফল ইনস্টলেশনের লক্ষণ:

1. **Extension visible** browser toolbar এ
2. **Green toggle** chrome://extensions/ এ  
3. **Click করলে popup** খুলছে
4. **"Extension Status: Enabled"** দেখাচ্ছে

## 🎯 ব্যবহার শুরু করুন:

1. Kolotibablo বা অন্য supported site এ যান
2. Extension icon এ click করুন  
3. Target Score set করুন (যেমন 0.7)
4. "Protect at 0.7" বাটনে click করুন
5. Score protection activate হয়ে যাবে!

## 📞 Help দরকার?

যদি এখনও সমস্যা হয়:
1. Browser restart করুন
2. Extension reload করুন
3. Debug Elements বাটন চেপে দেখুন
4. Chrome version latest কিনা check করুন

---
**Happy Score Protection! 🛡️**