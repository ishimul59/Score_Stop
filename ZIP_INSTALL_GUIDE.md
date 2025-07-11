# 📦 Score Stop Extension - ZIP Installation Guide

## 🎯 ZIP File থেকে Extension Install করার নিয়ম

### ✅ প্রস্তুত ZIP File:
- File name: `ScoreStop_Extension.zip`
- Size: ~13.5 KB
- Contains: সব essential extension files

### 🚀 Installation Steps:

#### Method 1: ZIP Drag & Drop (সহজ পদ্ধতি)
1. **Chrome খুলুন** এবং যান: `chrome://extensions/`
2. **Developer mode ON** করুন (উপরের ডান কোণায়)
3. **ZIP file টি drag করে** browser window এ drop করুন
4. **Chrome automatically** extension install করবে

#### Method 2: Extract Then Load (নিরাপদ পদ্ধতি)
1. **ZIP file extract** করুন যেকোনো folder এ
2. **Chrome এ যান:** `chrome://extensions/`
3. **Developer mode ON** করুন
4. **"Load unpacked"** click করুন
5. **Extracted folder select** করুন

### 🛠️ যদি ZIP Install Problem হয়:

#### ❌ "Package is invalid" Error:
- ZIP file corrupt হতে পারে
- আবার download করুন নতুন ZIP file
- অথবা Method 2 ব্যবহার করুন

#### ❌ "Manifest file missing" Error:
- ZIP file ভুল extract হয়েছে
- Windows: Right click → "Extract All"
- Mac: Double click ZIP file
- Linux: `unzip ScoreStop_Extension.zip`

#### ❌ "Failed to load" Error:
- Chrome restart করুন
- Developer mode off/on করুন
- Manual extract করে load unpacked ব্যবহার করুন

### ✅ সফল Installation চিহ্ন:

1. **Extension visible** chrome://extensions/ page এ
2. **Green toggle switch** enabled অবস্থায়
3. **Browser toolbar এ icon** দেখাচ্ছে
4. **Click করলে popup** খুলছে

### 🎯 বিকল্প উপায়:

যদি ZIP installation এখনও problem করে:

1. **ZIP extract করুন**
2. **Folder select করে load unpacked** করুন
3. **এটি 100% কাজ করবে**

### 📋 File Contents চেক করুন:

ZIP file এ এই files থাকতে হবে:
```
✅ manifest.json    - Extension config
✅ background.js    - Background service
✅ content.js       - Main functionality  
✅ popup.html       - UI interface
✅ popup.js         - UI logic
✅ README.md        - Documentation
```

### ⚠️ Important Notes:

- **Developer mode** অবশ্যই ON রাখতে হবে
- **Windows Defender** বা antivirus disable করুন temporarily
- **Chrome version 88+** required
- **Internet connection** লাগবে প্রথমবার

---

## 🚀 Quick Install Command (Linux/Mac):

```bash
# Extract zip
unzip ScoreStop_Extension.zip -d ScoreStop/

# Open Chrome extensions page
google-chrome chrome://extensions/

# Then load unpacked folder manually
```

---

**Happy Installing! 🛡️**

*ZIP file এ কোনো virus নেই, সব files clean এবং safe!*