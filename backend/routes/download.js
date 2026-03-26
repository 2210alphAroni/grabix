const express = require("express");
const router = express.Router();
const YTDlpWrap = require("yt-dlp-wrap").default;
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const ytDlp = new YTDlpWrap();
const DOWNLOADS_DIR = path.join(__dirname, "../downloads");

function buildArgs(url, formatId, outputTemplate) {
  const base = [url, "-o", outputTemplate, "--no-playlist", "--no-check-certificates", "--js-runtimes", "nodejs", "--extractor-args", "youtube:skip=dash,hls"];

  if (formatId.startsWith("video-")) {
    const quality = formatId.replace("video-", "");
    return [
      ...base,
      "-f", `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`,
      "--merge-output-format", "mp4",
      "--postprocessor-args", "ffmpeg:-c:v copy -c:a aac",
    ];
  }
  if (formatId === "audio-mp3-320") return [...base, "-f", "bestaudio/best", "-x", "--audio-format", "mp3", "--audio-quality", "0"];
  if (formatId === "audio-mp3-192") return [...base, "-f", "bestaudio/best", "-x", "--audio-format", "mp3", "--audio-quality", "5"];
  if (formatId === "audio-m4a")     return [...base, "-f", "bestaudio[ext=m4a]/bestaudio/best"];
  if (formatId === "audio-flac")    return [...base, "-f", "bestaudio/best", "-x", "--audio-format", "flac"];
  return [...base, "-f", "best"];
}

router.post("/", async (req, res) => {
  const { url, format_id } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  const jobId = uuidv4().slice(0, 8);
  // Let yt-dlp set the real title and extension
  const outTemplate = path.join(DOWNLOADS_DIR, `${jobId}_%(title)s.%(ext)s`);

  try {
    await ytDlp.execPromise(buildArgs(url.trim(), format_id || "video-1080", outTemplate));

    const matched = fs.readdirSync(DOWNLOADS_DIR).find((f) => f.startsWith(jobId));
    if (!matched) throw new Error("Downloaded file not found on server");

    const filePath = path.join(DOWNLOADS_DIR, matched);
    const fileSize = fs.statSync(filePath).size;
    const ext      = path.extname(matched).slice(1) || "mp4";

    // Build clean download filename from what yt-dlp saved
    const rawTitle   = matched.replace(`${jobId}_`, "").replace(new RegExp(`\\.${ext}$`), "");
    const safeTitle  = rawTitle.replace(/[/\\?%*:|"<>]/g, "-").trim().slice(0, 80) || "grabix-download";
    const dlFilename = `${safeTitle}.${ext}`;

    const mimes = { mp4:"video/mp4", webm:"video/webm", mkv:"video/x-matroska", mp3:"audio/mpeg", m4a:"audio/mp4", flac:"audio/flac", opus:"audio/ogg" };

    res.setHeader("Content-Type", mimes[ext] || "application/octet-stream");
    res.setHeader("Content-Length", fileSize);
    const asciiName = dlFilename.replace(/[^\x00-\x7F]/g, "_");
    res.setHeader("Content-Disposition", `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(dlFilename)}`);
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    stream.on("end", () => setTimeout(() => { try { fs.unlinkSync(filePath); } catch(_){} }, 5000));
    stream.on("error", (e) => { if (!res.headersSent) res.status(500).json({ error: e.message }); });

  } catch (err) {
    console.error("[DOWNLOAD ERROR]\n", err.message);
    try { fs.readdirSync(DOWNLOADS_DIR).filter(f=>f.startsWith(jobId)).forEach(f=>fs.unlinkSync(path.join(DOWNLOADS_DIR,f))); } catch(_){}
    if (!res.headersSent) res.status(500).json({ error: err.message?.slice(0,300) || "Download failed" });
  }
});

module.exports = router;