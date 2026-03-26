"use client";
import { useState, useRef } from "react";
import DownloaderCard from "./DownloaderCard";

const STATS = [
  { num: "1000+", label: "Sites Supported" },
  { num: "4K",    label: "Max Resolution"  },
  { num: "FREE",  label: "Always Free"     },
  { num: "320",   label: "MP3 kbps"        },
];

export default function Hero() {
  return (
    <section id="download"
      className="relative min-h-screen flex flex-col items-center justify-center
                 px-4 pt-28 pb-20 text-center">

      {/* Eyebrow */}
      <p className="font-mono text-[11px] tracking-[4px] text-cyan uppercase mb-5
                    opacity-0 animate-[fadeUp_0.6s_ease_0.2s_forwards]">
        ⚡ Universal Media Downloader
      </p>

      {/* Headline */}
      <h1 className="font-display leading-[0.88] tracking-wider mb-6
                     opacity-0 animate-[fadeUp_0.7s_ease_0.4s_forwards]"
          style={{ fontSize: "clamp(58px,11vw,128px)" }}>
        <span className="block text-white">DOWNLOAD</span>
        <span className="block text-cyan"
              style={{ textShadow: "0 0 60px rgba(0,229,255,0.25)" }}>ANYTHING</span>
        <span className="block text-rose">ANYWHERE</span>
      </h1>

      <p className="text-sm text-muted max-w-md leading-relaxed mb-10
                    opacity-0 animate-[fadeUp_0.7s_ease_0.6s_forwards]">
        Paste any URL from YouTube, Facebook, Instagram, TikTok, Twitter and more —
        download video, audio, or music in seconds.
      </p>

      {/* Downloader Card */}
      <div className="w-full max-w-2xl opacity-0 animate-[fadeUp_0.8s_ease_0.8s_forwards]">
        <DownloaderCard />
      </div>

      {/* Stats */}
      <div className="flex w-full max-w-2xl mt-14 gap-px
                      opacity-0 animate-[fadeUp_0.8s_ease_1.0s_forwards]">
        {STATS.map((s, i) => (
          <div key={i}
               className={`flex-1 py-6 bg-surface border border-border text-center
                           hover:bg-cyan/5 transition-colors
                           ${i === 0 ? "rounded-l-2xl" : ""}
                           ${i === STATS.length - 1 ? "rounded-r-2xl" : ""}`}>
            <div className="font-display text-3xl tracking-widest text-cyan">{s.num}</div>
            <div className="text-[10px] text-muted tracking-widest uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
