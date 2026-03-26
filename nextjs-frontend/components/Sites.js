const SITES = [
  { name:"YouTube",    type:"Video / Audio",   icon:"▶",  bg:"#ff0000" },
  { name:"Facebook",   type:"Video / Reels",   icon:"f",  bg:"#1877f2" },
  { name:"Instagram",  type:"Video / Reels",   icon:"📸", bg:"#dd2a7b" },
  { name:"TikTok",     type:"Video / Music",   icon:"🎵", bg:"#000000" },
  { name:"Twitter/X",  type:"Video / GIF",     icon:"𝕏",  bg:"#000000" },
  { name:"Vimeo",      type:"HD Video",        icon:"🎬", bg:"#1ab7ea" },
  { name:"Spotify",    type:"Music / Podcast", icon:"🎵", bg:"#1ed760" },
  { name:"Twitch",     type:"Clips / VODs",    icon:"🎮", bg:"#6441a5" },
  { name:"Reddit",     type:"Video / GIF",     icon:"👽", bg:"#ff4500" },
  { name:"Dailymotion",type:"Video",           icon:"📺", bg:"#0066dc" },
  { name:"Pinterest",  type:"Video / Image",   icon:"📌", bg:"#e60023" },
  { name:"LinkedIn",   type:"Video",           icon:"💼", bg:"#0a66c2" },
];

export default function Sites() {
  return (
    <section id="sites" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
      <h2 className="font-display text-5xl tracking-wider mb-2">Supported Platforms</h2>
      <p className="text-muted mb-10 text-sm">1000+ sites powered by yt-dlp</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {SITES.map((s) => (
          <div key={s.name}
               className="bg-surface border border-border rounded-2xl p-4
                          flex items-center gap-3
                          hover:border-cyan/30 hover:-translate-y-0.5
                          transition-all duration-200 cursor-default">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center
                            text-sm font-bold text-white flex-shrink-0"
                 style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-[10px] text-muted mt-0.5">{s.type}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
