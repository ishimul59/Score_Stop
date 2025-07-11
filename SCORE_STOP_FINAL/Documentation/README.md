# Score Stop - Score Protector

একটি ব্রাউজার এক্সটেনশন যা captcha solving websites এ আপনার score protect এবং maintain করে।

## ফিচারসমূহ

- 🛡️ **Automatic Score Protection** - নির্দিষ্ট score এ পৌঁছালে auto protect
- 🎯 **Manual Protection** - যেকোনো score এ manually activate
- ⚙️ **Customizable Target** - 0.1 থেকে 1.0 পর্যন্ত target score set করুন
- 🔄 **On/Off Toggle** - সম্পূর্ণ extension enable/disable করুন
- 🐛 **Debug Mode** - Score detection troubleshooting
- 📊 **Real-time Monitoring** - Live score tracking

## সাপোর্টেড সাইটসমূহ

- Kolotibablo.com
- 2captcha.com
- RuCaptcha.com
- AntiCaptcha.com
- এবং অন্যান্য similar captcha solving sites

## ইনস্টলেশন নির্দেশনা

### Chrome/Edge Browser এ Install করার জন্য:

1. **Extension Files Download করুন:**
   - সব ফাইল একটি folder এ রাখুন

2. **Chrome এ Developer Mode Enable করুন:**
   - Chrome এ যান: `chrome://extensions/`
   - উপরের ডানদিকে **"Developer mode"** toggle on করুন

3. **Extension Load করুন:**
   - **"Load unpacked"** বাটনে click করুন
   - আপনার extension folder select করুন
   - **"Select Folder"** এ click করুন

4. **Extension Activate করুন:**
   - Extension list এ **"Score Stop"** দেখতে পাবেন
   - এটি enable করুন

### ব্যবহারবিধি:

1. **সাপোর্টেড website এ যান** (যেমন Kolotibablo)
2. **Extension icon** এ click করুন
3. **Target Score সেট করুন** (যেমন 0.7)
4. **"Protect at 0.7"** বাটনে click করুন
5. **Extension automatically** score monitor করবে এবং protect করবে

## Important Files:

```
Score Stop Extension/
├── manifest.json       # Extension configuration
├── background.js       # Background service worker
├── content.js         # Main score protection logic
├── popup.html         # User interface
├── popup.js           # UI functionality
└── README.md          # এই ফাইল
```

## Troubleshooting:

### যদি extension load না হয়:
1. সব ফাইল একই folder এ আছে কিনা check করুন
2. manifest.json file corrupt নয় তো?
3. Chrome developer mode on আছে কিনা দেখুন

### যদি score detect না করে:
1. **Debug Elements** বাটন দিয়ে check করুন
2. Site টি supported কিনা দেখুন
3. Extension enabled আছে কিনা verify করুন

## Version: 1.0.0

**Developed for captcha solving professionals** 💪

---
*Score protection made simple and effective!*
