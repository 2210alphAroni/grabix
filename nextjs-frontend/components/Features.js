const FEATURES = [
  { icon:"⚡", title:"Lightning Fast",    desc:"Server-side processing with yt-dlp — downloads start instantly without buffering." },
  { icon:"🎯", title:"Multiple Formats",  desc:"MP4 video in 4K/1080p/720p, or extract MP3, M4A, FLAC audio from any source." },
  { icon:"🔒", title:"No Registration",   desc:"No account needed. Paste URL, pick quality, download. We respect your privacy." },
  { icon:"📱", title:"Works Everywhere",  desc:"Fully responsive Next.js app — works perfectly on mobile, tablet, and desktop." },
  { icon:"🎬", title:"Up to 4K Quality",  desc:"Download in highest available quality — 4K, HDR whenever the source supports it." },
  { icon:"🎵", title:"Audio Extraction",  desc:"Extract crystal-clear audio as MP3 up to 320kbps or lossless FLAC format." },
];

export default function Features() {
  return (
    <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
      <h2 className="font-display text-5xl tracking-wider mb-2">Why GRABIX?</h2>
      <p className="text-muted mb-10 text-sm">Built for speed, quality, and simplicity</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title}
               className="bg-surface border border-border rounded-2xl p-6
                          hover:border-cyan/25 hover:-translate-y-1
                          hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]
                          transition-all duration-300">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="text-base font-bold mb-2">{f.title}</h3>
            <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
