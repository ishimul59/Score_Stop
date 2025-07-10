# Score Stop - Captcha Score Protector 🛡️

**আপনার ক্যাপচা সাইটের স্কোর ০.৯ এ লক করে রাখুন!**

## 🎯 কী করে এই Extension?

**Score Stop** একটি Chrome extension যা captcha solving websites (যেমন Kolotibablo, 2captcha) এ আপনার score/rating কে protect করে। যখন আপনার score ০.৯ এ পৌঁছায়, extension টি সেটাকে freeze করে রাখে যেন আর নিচে নেমে না যায়।

### ✨ Key Features:
- 🎯 **Auto Score Protection** - Score ০.৯ এ পৌঁছালে automatic lock
- 🔄 **Real-time Monitoring** - Continuous score tracking
- 🛡️ **Visual Protection Indicator** - Protected score দেখানো
- ⚙️ **Customizable Target** - Target score পরিবর্তন করা যায়
- 📊 **Live Status Display** - Real-time score এবং status দেখানো
- 🔔 **Notifications** - Protection activate হলে notification

## 🚀 Installation Guide

### পদ্ধতি ১: Chrome এ Manual Install

1. **ফোল্ডার প্রস্তুত করুন:**
   ```
   score-stop-extension/
   ├── score-stop-manifest.json
   ├── score-content.js
   ├── score-background.js
   ├── score-popup.html
   └── score-popup.js
   ```

2. **Chrome Extensions Page খুলুন:**
   - Chrome browser এ যান
   - Address bar এ টাইপ করুন: `chrome://extensions/`
   - Enter চাপুন

3. **Developer Mode চালু করুন:**
   - Page এর উপরে ডানদিকে **"Developer mode"** toggle ON করুন

4. **Extension Load করুন:**
   - **"Load unpacked"** বাটনে ক্লিক করুন
   - আপনার extension folder select করুন
   - **"Select Folder"** ক্লিক করুন

5. **Verify Installation:**
   - Extension list এ "Score Stop - Score Protector" দেখা যাবে
   - Browser toolbar এ extension icon আসবে

### পদ্ধতি ২: File Rename

যদি manifest.json নাম conflict করে:
1. `score-stop-manifest.json` কে rename করে `manifest.json` করুন
2. উপরের steps follow করুন

## 📖 কিভাবে ব্যবহার করবেন

### Step 1: Captcha Site এ যান
- Kolotibablo.com বা অন্য supported captcha site এ login করুন

### Step 2: Extension চেক করুন
- Browser toolbar এ Score Stop icon ক্লিক করুন
- "Site Detected: ✅ Supported" দেখা যাবে

### Step 3: Score Monitor করুন
- Extension popup এ আপনার current score দেখা যাবে
- Target score set করুন (default: 0.9)

### Step 4: Protection Activate করুন
- Score যখন ০.৯ এ পৌঁছাবে, automatic protection চালু হবে
- অথবা manually **"🛡️ Activate Protection"** ক্লিক করুন

### Step 5: Protected Score Maintain
- Score ০.৯ এ freeze হয়ে যাবে
- Page এ score green highlight সহ 🛡️ icon দেখা যাবে
- Extension popup এ "Protection Active" status দেখা যাবে

## 🎮 Interface Guide

### Extension Popup:
```
┌─────────────────────────┐
│      Score Stop         │
│   Captcha Protector     │
├─────────────────────────┤
│     Score: 0.9 🛡️       │
│   Protected Score       │
│                         │
│  🟢 Protection Active   │
├─────────────────────────┤
│ Target Score: [0.9]     │
│ Site: ✅ Supported      │
├─────────────────────────┤
│ 🛑 Deactivate Protection│
│ 🔄 Reset Protection     │
│ 🔍 Refresh Status      │
└─────────────────────────┘
```

### Page এ Visual Changes:
```html
<!-- Normal Score -->
<span class="score">0.7</span>

<!-- Protected Score -->
<span class="score score-protected">0.9 🛡️</span>
```

## ⚙️ Advanced Settings

### Target Score পরিবর্তন:
1. Extension popup খুলুন
2. "Target Score" field এ নতুন value দিন (0.1 - 1.0)
3. Enter চাপুন

### Debug Mode:
1. Extension popup এ "Score Stop" title এ double-click করুন
2. Debug log দেখা যাবে
3. Real-time events monitor করতে পারবেন

### Manual Control:
- **Activate Protection:** যে কোন সময় manually activate করা যায়
- **Reset Protection:** Protection reset করে fresh start
- **Refresh Status:** Current status reload করা

## 🌐 Supported Sites

✅ **Confirmed Working:**
- Kolotibablo.com
- 2captcha.com
- RuCaptcha.com
- AntiCaptcha.com

⚠️ **Generic Support:**
- Any site with score/rating display
- Automatic detection algorithm

## 🔧 Troubleshooting

### Extension কাজ করছে না?

1. **Site Detection চেক করুন:**
   - Extension popup এ "Site Detected" status দেখুন
   - ❌ দেখা গেলে site supported না

2. **Console Error চেক করুন:**
   - F12 চেপে Developer Tools খুলুন
   - Console tab এ error আছে কিনা দেখুন

3. **Extension Reload করুন:**
   - `chrome://extensions/` এ যান
   - Score Stop extension এ refresh icon (🔄) ক্লিক করুন

4. **Page Refresh করুন:**
   - Captcha site টি refresh করুন
   - Extension আবার try করুন

### Score Protect হচ্ছে না?

1. **Target Score চেক করুন:**
   - Current score টি target এর চেয়ে কম কিনা
   - Target score appropriate কিনা (0.8-0.9 recommended)

2. **Manual Activation:**
   - **"🛡️ Activate Protection"** manually ক্লিক করুন

3. **Score Element Detection:**
   - Page এ score properly display হচ্ছে কিনা
   - Different score selectors try করতে পারে

## ⚡ Performance Tips

### Best Practices:
1. **Target Score:** 0.8 - 0.9 এর মধ্যে রাখুন
2. **Manual Check:** মাঝে মাঝে extension status check করুন
3. **Page Refresh:** নতুন task শুরুর আগে page refresh করুন

### Resource Usage:
- **Memory:** ~2-5 MB
- **CPU:** Very Low Impact
- **Network:** Zero additional requests

## 🔒 Privacy & Security

### Data Collection:
- ❌ **No data sent to external servers**
- ❌ **No personal information collected**
- ❌ **No tracking or analytics**

### Local Storage Only:
- ✅ Extension settings locally saved
- ✅ Score data stays in browser
- ✅ Complete privacy protection

## 📝 Technical Details

### Architecture:
```
┌─────────────────┐    ┌─────────────────┐
│   Background    │◄──►│  Content Script │
│     Script      │    │   (Page Level)  │
└─────────────────┘    └─────────────────┘
         ▲                       ▲
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Popup Script   │    │   DOM Monitor   │
│   (User UI)     │    │  (Score Track)  │
└─────────────────┘    └─────────────────┘
```

### Score Detection Algorithm:
1. **Selector Based:** Common CSS selectors for scores
2. **Text Analysis:** Regex pattern matching
3. **Dynamic Detection:** Real-time DOM monitoring
4. **Fallback Methods:** Multiple detection strategies

## 🤝 Support

### Issues Report করুন:
- Extension কাজ না করলে
- নতুন site support চাইলে  
- Bug পেলে

### Feature Requests:
- নতুন functionality চাইলে
- UI improvement suggestions
- Performance enhancements

## 📜 Version History

### v1.0.0 (Current)
- ✅ Initial release
- ✅ Basic score protection
- ✅ Real-time monitoring
- ✅ Visual UI with popup
- ✅ Multi-site support

## ⚠️ Disclaimer

এই extension টি educational purpose এর জন্য তৈরি। আপনার ব্যবহার করার আগে captcha site এর terms of service check করুন। Extension ব্যবহারের সম্পূর্ণ দায়িত্ব user এর।

---

**Made with ❤️ for Captcha Workers**

**Score Stop v1.0.0** | Keep your score high! 🚀