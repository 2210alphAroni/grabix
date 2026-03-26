const express = require("express");
const router = express.Router();
const YTDlpWrap = require("yt-dlp-wrap").default;

const ytDlp = new YTDlpWrap();

// Format definitions — what we show to the user
const VIDEO_FORMATS = [
  { id: "video-2160", label: "MP4 4K · 2160p",    ext: "mp4", type: "video", quality: "2160" },
  { id: "video-1080", label: "MP4 Full HD · 1080p", ext: "mp4", type: "video", quality: "1080" },
  { id: "video-720",  label: "MP4 HD · 720p",      ext: "mp4", type: "video", quality: "720"  },
  { id: "video-480",  label: "MP4 SD · 480p",      ext: "mp4", type: "video", quality: "480"  },
  { id: "video-360",  label: "MP4 · 360p",         ext: "mp4", type: "video", quality: "360"  },
];

const AUDIO_FORMATS = [
  { id: "audio-mp3-320", label: "MP3 · 320 kbps",  ext: "mp3", type: "audio", quality: "320" },
  { id: "audio-mp3-192", label: "MP3 · 192 kbps",  ext: "mp3", type: "audio", quality: "192" },
  { id: "audio-m4a",     label: "M4A · 256 kbps",  ext: "m4a", type: "audio", quality: "256" },
  { id: "audio-flac",    label: "FLAC · Lossless",  ext: "flac",type: "audio", quality: "best"},
];

router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url || url.trim().length < 10) {
    return res.status(400).json({ error: "Valid URL is required" });
  }

  try {
    // Fetch metadata via yt-dlp
    const metadata = await ytDlp.getVideoInfo(url.trim(), [
      "--no-check-certificates",
      "--no-playlist",
      "--js-runtimes",
      "nodejs",
      "--extractor-args",
      "youtube:skip=dash,hls",
    ]);

    // Find which video qualities are actually available
    const availableHeights = new Set(
      (metadata.formats || [])
        .filter((f) => f.height)
        .map((f) => String(f.height))
    );

    const videoFormats = VIDEO_FORMATS.map((f) => ({
      ...f,
      available: availableHeights.size === 0 || availableHeights.has(f.quality) || parseInt(f.quality) <= 1080,
    }));

    return res.json({
      title:     metadata.title     || "Unknown Title",
      thumbnail: metadata.thumbnail || "",
      duration:  metadata.duration  || 0,
      uploader:  metadata.uploader  || metadata.channel || "Unknown",
      platform:  metadata.extractor_key || detectPlatform(url),
      webpage_url: metadata.webpage_url || url,
      formats: [...videoFormats, ...AUDIO_FORMATS],
    });

  } catch (err) {
    console.error("[INFO ERROR]", err.message);
    return res.status(400).json({
      error: err.message?.slice(0, 200) || "Could not fetch video info",
    });
  }
});

function detectPlatform(url) {
  if (url.includes("youtube") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("facebook") || url.includes("fb.com"))  return "Facebook";
  if (url.includes("instagram"))  return "Instagram";
  if (url.includes("tiktok"))     return "TikTok";
  if (url.includes("twitter") || url.includes("x.com")) return "Twitter";
  if (url.includes("vimeo"))      return "Vimeo";
  return "Unknown";
}

module.exports = router;
