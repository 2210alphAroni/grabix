# 🎬 GRABIX — MERN Stack Media Downloader

YouTube, Facebook, Instagram, TikTok, Twitter সহ 1000+ সাইট থেকে video/audio download।

## 📁 Project Structure

```
grabix-mern/
├── backend/                  ← Node.js + Express API
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   │   ├── info.js           ← Video info fetch
│   │   └── download.js       ← File download
│   └── downloads/            ← Temp files (auto-clean)
│
├── nextjs-frontend/          ← Next.js website
│   ├── app/
│   │   ├── page.js
│   │   ├── layout.js
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Hero.js
│   │   ├── DownloaderCard.js
│   │   ├── Sites.js
│   │   ├── Features.js
│   │   └── Footer.js
│   ├── .env.local
│   └── package.json
│
└── extension/                ← Chrome/Firefox Extension
    ├── manifest.json
    ├── content.js
    ├── content.css
    ├── background.js
    ├── icons/
    └── popup/popup.html
```

---

## ✅ Prerequisites — আগে install করুন

### 1. Node.js
- Download: https://nodejs.org (LTS version নিন)
- Install করুন, default settings রাখুন
- Check: terminal এ `node -v` লিখুন → version দেখালে OK

### 2. yt-dlp
- Windows: https://github.com/yt-dlp/yt-dlp/releases থেকে `yt-dlp.exe` download করে PATH এ রাখুন
- Mac: `brew install yt-dlp`
- Linux: `sudo apt install yt-dlp` বা `pip install yt-dlp`
- Check: `yt-dlp --version`

### 3. FFmpeg (audio conversion এর জন্য)
- Windows: https://ffmpeg.org/download.html → PATH এ add করুন
- Mac: `brew install ffmpeg`
- Linux: `sudo apt install ffmpeg`
- Check: `ffmpeg -version`

---

## 🚀 Step-by-Step Run Guide

### STEP 1 — Backend চালু করুন

```bash
# Terminal খুলুন, backend folder এ যান
cd grabix-mern/backend

# Dependencies install করুন (শুধু প্রথমবার)
npm install

# Backend start করুন
npm start
```

✅ এই message দেখলে ready:
```
🚀 GRABIX Backend running → http://localhost:5000
```

> Backend সবসময় চালু রাখতে হবে। এই terminal বন্ধ করবেন না।

---

### STEP 2 — Next.js Frontend চালু করুন

```bash
# নতুন terminal খুলুন
cd grabix-mern/nextjs-frontend

# Dependencies install করুন (শুধু প্রথমবার)
npm install

# Dev server start করুন
npm run dev
```

✅ এই message দেখলে ready:
```
▲ Next.js ready on http://localhost:3000
```

Browser এ যান: **http://localhost:3000**

---

### STEP 3 — Browser Extension Install করুন

**Chrome এ:**
1. Chrome খুলুন
2. Address bar এ লিখুন: `chrome://extensions`
3. উপরে ডানে **"Developer mode"** toggle → ON করুন
4. **"Load unpacked"** button চাপুন
5. `grabix-mern/extension/` folder select করুন
6. ✅ Extension install হয়ে গেছে!

**Firefox এ:**
1. Firefox খুলুন
2. Address bar: `about:debugging`
3. **"This Firefox"** → **"Load Temporary Add-on"**
4. `grabix-mern/extension/manifest.json` select করুন

---

### STEP 4 — Extension Use করুন

1. YouTube / Facebook / TikTok / Instagram যেকোনো video page এ যান
2. Screen এর **নিচে ডানে** নীল **↓ GRABIX** button দেখবেন
3. Click করুন → Panel খুলবে
4. Video info automatically load হবে
5. Format বেছে নিন (MP4 1080p / MP3 320kbps ইত্যাদি)
6. Download button চাপুন → File save!

---

## 🌐 Supported Platforms

| Platform      | কী download হবে         |
|---------------|------------------------|
| YouTube       | Video + Audio          |
| Facebook      | Video, Reels           |
| Instagram     | Video, Reels           |
| TikTok        | Video (no watermark)   |
| Twitter/X     | Video, GIF             |
| Vimeo         | HD Video               |
| Twitch        | Clips, VODs            |
| Reddit        | Video, GIF             |
| Dailymotion   | Video                  |
| + 990 more    | yt-dlp supported       |

---

## 🎯 Supported Formats

**Video:** MP4 (4K/1440p/1080p/720p/480p/360p)
**Audio:** MP3 (320kbps, 192kbps), M4A (256kbps), FLAC (Lossless)

---

## ❓ Troubleshooting

**"Cannot connect to backend" দেখাচ্ছে?**
→ `npm start` backend এ চালু আছে কিনা দেখুন (port 5000)

**Extension button দেখাচ্ছে না?**
→ Page reload করুন (Ctrl+R)
→ Backend চালু আছে কিনা extension popup এ "Check Backend" চাপুন

**npm install error?**
→ Node.js properly install হয়েছে কিনা চেক করুন: `node -v`

**yt-dlp not found error?**
→ yt-dlp install করুন এবং system PATH এ আছে কিনা নিশ্চিত করুন

**FFmpeg error (audio download এ)?**
→ `ffmpeg -version` দিয়ে check করুন

---

## 🔧 API Endpoints

| Method | URL              | কাজ                  |
|--------|------------------|----------------------|
| GET    | /api/health      | Backend status       |
| POST   | /api/info        | Video info fetch     |
| POST   | /api/download    | File download        |

---

## 📝 Notes

- Downloaded temp files 5 সেকেন্ড পর auto-delete হয়
- `npm run dev` → development mode (hot reload)
- `npm run build && npm start` → production mode
- yt-dlp আপডেট করুন: `npm update yt-dlp-wrap`

---

Made with ❤️ — GRABIX v1.0 | Node.js + Express + Next.js + Chrome Extension
