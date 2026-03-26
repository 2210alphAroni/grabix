"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PLATFORMS = [
  "Auto Detect",
  "YouTube",
  "Facebook",
  "Instagram",
  "TikTok",
  "Twitter/X",
];

export default function DownloaderCard() {
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("Auto Detect");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState(null);
  const [formats, setFormats] = useState({ video: [], audio: [] });
  const [tab, setTab] = useState("video");
  const [selectedFmt, setSelectedFmt] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(null); // null | "loading" | "done" | "error"
  const [dlMessage, setDlMessage] = useState("");

  // ── Analyze URL ──────────────────────────────────────────
  async function analyze() {
    if (url.trim().length < 10) return;
    setLoading(true);
    setError("");
    setInfo(null);
    setSelectedFmt(null);
    setDlProgress(null);

    try {
      const res = await fetch(`${API}/api/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setInfo(data);
      const video = data.formats.filter((f) => f.type === "video");
      const audio = data.formats.filter((f) => f.type === "audio");
      setFormats({ video, audio });
      setSelectedFmt(video[1]?.id || video[0]?.id || null); // default 1080p
    } catch (e) {
      setError(e.message || "Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  // ── Download ─────────────────────────────────────────────
  async function download() {
    if (!selectedFmt || !url) return;
    setDownloading(true);
    setDlProgress("loading");
    setDlMessage("Sending to server...");

    try {
      const res = await fetch(`${API}/api/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), format_id: selectedFmt }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Download failed");
      }

      setDlMessage("Downloading file...");
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      const filename = match
        ? match[1].replace(/['"]/g, "")
        : "grabix-download";

      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);

      setDlProgress("done");
      setDlMessage("✓ Download complete!");
      setTimeout(() => setDlProgress(null), 4000);
    } catch (e) {
      setDlProgress("error");
      setDlMessage(e.message?.slice(0, 100) || "Download failed");
    } finally {
      setDownloading(false);
    }
  }

  const fmtList = tab === "video" ? formats.video : formats.audio;

  return (
    <div className="grabix-card p-8 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
      {/* Top accent line */}
      <div
        className="absolute top-0 left-10 right-10 h-px opacity-40"
        style={{
          background: "linear-gradient(90deg,transparent,#00e5ff,transparent)",
        }}
      />

      {/* Platform chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
                    ${
                      platform === p
                        ? "border-cyan text-cyan bg-cyan/[0.08]"
                        : "border-border text-muted hover:border-cyan/40 hover:text-cyan/80"
                    }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* URL Input */}
      <div className="flex gap-3 mb-4">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && url.length > 10 && analyze()}
          placeholder="Paste your video/audio URL here..."
          className="flex-1 bg-white/[0.04] border border-border rounded-xl px-4 py-3.5
                     text-white text-sm font-mono outline-none
                     placeholder:text-muted placeholder:font-body
                     focus:border-cyan focus:bg-cyan/[0.04] transition-all"
        />
        <button
          onClick={analyze}
          disabled={loading || url.trim().length < 10}
          className="grabix-btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze →"
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex gap-3 items-start bg-red-500/[0.08] border border-red-500/25
                        rounded-xl p-3 mb-4 text-red-400 text-xs"
        >
          <span className="text-base flex-shrink-0">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Preview */}
      {info && (
        <div
          className="flex gap-3 items-center bg-white/[0.03] border border-border
                        rounded-xl p-3 mb-5"
        >
          <div
            className="w-20 h-14 rounded-lg overflow-hidden bg-border flex-shrink-0
                          flex items-center justify-center text-2xl"
          >
            {info.thumbnail ? (
              <img
                src={info.thumbnail}
                alt="thumb"
                className="w-full h-full object-cover"
              />
            ) : (
              "🎬"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate mb-1">
              {info.title}
            </p>
            <p className="text-[11px] text-muted">
              {info.platform} · {info.uploader}
              {info.duration ? ` · ${fmtDur(info.duration)}` : ""}
            </p>
          </div>
        </div>
      )}

      {/* Format Picker */}
      {info && (
        <div className="pt-5 border-t border-border">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {["video", "audio"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSelectedFmt(null);
                }}
                className={`tab-btn ${tab === t ? "active" : ""}`}
              >
                {t === "video" ? "🎬 Video" : "🎵 Audio Only"}
              </button>
            ))}
          </div>

          {/* Formats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
            {fmtList.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFmt(f.id)}
                className={`format-option ${selectedFmt === f.id ? "selected" : ""}`}
              >
                {selectedFmt === f.id && (
                  <span className="absolute top-2 right-2 text-[10px] text-cyan">
                    ✓
                  </span>
                )}
                <div className="font-mono text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                  {f.ext?.toUpperCase()}
                  {f.quality === "2160" && <QBadge color="gold">4K</QBadge>}
                  {(f.quality === "1080" || f.quality === "720") && (
                    <QBadge color="cyan">HD</QBadge>
                  )}
                  {f.type === "audio" && <QBadge color="success">HQ</QBadge>}
                </div>
                <div className="text-[11px] text-muted">{f.label}</div>
              </button>
            ))}
          </div>

          {/* Download button */}
          <button
            onClick={download}
            disabled={!selectedFmt || downloading}
            className="grabix-btn-download"
          >
            {downloading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Downloading...
              </span>
            ) : (
              "↓   DOWNLOAD NOW"
            )}
          </button>

          {/* Progress / status */}
          {dlProgress && (
            <div
              className={`mt-3 flex items-center gap-2 text-xs rounded-lg p-3
              ${
                dlProgress === "done"
                  ? "bg-green-500/[0.08] border border-green-500/20 text-green-400"
                  : dlProgress === "error"
                    ? "bg-red-500/[0.08] border border-red-500/20 text-red-400"
                    : "bg-cyan/5 border border-cyan/15 text-cyan"
              }`}
            >
              {dlProgress === "loading" && (
                <span className="w-3 h-3 border border-cyan/30 border-t-cyan rounded-full animate-spin flex-shrink-0" />
              )}
              {dlMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QBadge({ color, children }) {
  const colors = {
    gold: "bg-yellow-400/15 text-yellow-300",
    cyan: "bg-cyan/15 text-cyan",
    success: "bg-green-400/15 text-green-300",
  };
  return (
    <span
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function fmtDur(s) {
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    sec = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
}
