// ── GRABIX Content Script ─────────────────────────────────
// Detects video pages → injects floating ↓ button → opens download panel

const API = "http://localhost:5000";

const PLATFORMS = {
  "youtube.com":    { name:"YouTube",    icon:"▶", color:"#ff0000", isVideo:()=> location.pathname==="/watch" },
  "facebook.com":   { name:"Facebook",   icon:"f", color:"#1877f2", isVideo:()=> /\/videos\/|\/reel\/|\/watch/.test(location.pathname)||!!document.querySelector("video") },
  "instagram.com":  { name:"Instagram",  icon:"📸",color:"#dd2a7b", isVideo:()=> /\/reels?\/|\/p\//.test(location.pathname)||!!document.querySelector("video") },
  "tiktok.com":     { name:"TikTok",     icon:"🎵",color:"#010101", isVideo:()=> /\/@.+\/video\//.test(location.pathname) },
  "twitter.com":    { name:"Twitter/X",  icon:"𝕏", color:"#000000", isVideo:()=> /\/status\//.test(location.pathname)&&!!document.querySelector("video") },
  "x.com":          { name:"Twitter/X",  icon:"𝕏", color:"#000000", isVideo:()=> /\/status\//.test(location.pathname)&&!!document.querySelector("video") },
  "vimeo.com":      { name:"Vimeo",      icon:"🎬",color:"#1ab7ea", isVideo:()=> /^\/\d+/.test(location.pathname) },
  "twitch.tv":      { name:"Twitch",     icon:"🎮",color:"#6441a5", isVideo:()=> /\/videos\/|\/clip\//.test(location.pathname)||!!document.querySelector("video") },
  "reddit.com":     { name:"Reddit",     icon:"👽",color:"#ff4500", isVideo:()=> !!document.querySelector("video,shreddit-player") },
  "dailymotion.com":{ name:"Dailymotion",icon:"📺",color:"#0066dc", isVideo:()=> /\/video\//.test(location.pathname) },
};

let btn=null, panel=null, toast=null;

// ── Get current platform ──────────────────────────────────
function getPlatform() {
  const host = location.hostname.replace("www.","");
  for (const [domain, cfg] of Object.entries(PLATFORMS)) {
    if (host.includes(domain)) return cfg;
  }
  return null;
}

// ── Inject floating button ────────────────────────────────
function injectButton(platform) {
  if (btn) return;

  btn = document.createElement("div");
  btn.id = "grabix-btn";
  btn.innerHTML = `<div class="grabix-icon">↓</div><div class="grabix-label">GRABIX</div>`;
  btn.title = `Download from ${platform.name}`;
  btn.addEventListener("click", () => togglePanel(platform));
  document.body.appendChild(btn);

  toast = document.createElement("div");
  toast.id = "grabix-toast";
  document.body.appendChild(toast);

  requestAnimationFrame(() => btn.classList.add("visible"));
}

function removeAll() {
  [btn, panel, toast].forEach(el => el?.remove());
  btn = panel = toast = null;
}

// ── Toggle panel ──────────────────────────────────────────
function togglePanel(platform) {
  if (panel) {
    panel.classList.remove("visible");
    setTimeout(() => { panel?.remove(); panel = null; }, 280);
    return;
  }

  panel = document.createElement("div");
  panel.id = "grabix-panel";
  panel.innerHTML = `
    <div class="gp-header">
      <span class="gp-logo">GRAB<em>IX</em></span>
      <span class="gp-plat" style="background:${platform.color}22;color:${platform.color}">${platform.icon} ${platform.name}</span>
      <button class="gp-close" id="gp-x">✕</button>
    </div>
    <div class="gp-body" id="gp-body">
      <div class="gp-load"><div class="gp-spin"></div><span>Fetching info…</span></div>
    </div>`;
  document.body.appendChild(panel);
  requestAnimationFrame(() => panel.classList.add("visible"));

  document.getElementById("gp-x").onclick = () => {
    panel.classList.remove("visible");
    setTimeout(() => { panel?.remove(); panel = null; }, 280);
  };

  loadInfo(platform);
}

// ── Load video info ───────────────────────────────────────
async function loadInfo(platform) {
  const body = document.getElementById("gp-body");
  try {
    const res  = await fetch(`${API}/api/info`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ url: location.href }),
    });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || "Failed");
    renderInfo(body, data);
  } catch (e) {
    body.innerHTML = `
      <div class="gp-err">⚠ ${e.message.slice(0,120)}</div>
      <div class="gp-hint">Backend চালু আছে তো? <code>npm start</code></div>`;
  }
}

// ── Render info + format list ─────────────────────────────
function renderInfo(body, data) {
  const vFmts = (data.formats||[]).filter(f=>f.type==="video");
  const aFmts = (data.formats||[]).filter(f=>f.type==="audio");
  let activeTab = "video";

  function fmtHTML(list) {
    return list.map(f=>`
      <button class="gp-fmt" data-id="${f.id}">
        <span class="gp-fn">${(f.ext||f.id).toUpperCase()}</span>
        <span class="gp-fl">${f.label}</span>
        <span class="gp-dl">↓</span>
      </button>`).join("");
  }

  body.innerHTML = `
    <div class="gp-preview">
      ${data.thumbnail?`<img class="gp-thumb" src="${data.thumbnail}"/>`:`<div class="gp-thumb">🎬</div>`}
      <div class="gp-meta">
        <div class="gp-title">${data.title?.slice(0,60)||"Unknown"}${(data.title?.length||0)>60?"…":""}</div>
        <div class="gp-info">${data.uploader||""}${data.duration?" · "+fmtDur(data.duration):""}</div>
      </div>
    </div>
    <div class="gp-tabs">
      <button class="gp-tab active" data-t="video">🎬 Video</button>
      <button class="gp-tab" data-t="audio">🎵 Audio</button>
    </div>
    <div id="gp-fmts">${fmtHTML(vFmts)}</div>
    <div id="gp-prog" class="gp-prog hidden">
      <div class="gp-bar"><div class="gp-fill indeterminate"></div></div>
      <div class="gp-plabel">Downloading…</div>
    </div>`;

  // Tab switch
  body.querySelectorAll(".gp-tab").forEach(t => {
    t.onclick = () => {
      body.querySelectorAll(".gp-tab").forEach(x=>x.classList.remove("active"));
      t.classList.add("active");
      activeTab = t.dataset.t;
      document.getElementById("gp-fmts").innerHTML = fmtHTML(activeTab==="audio"?aFmts:vFmts);
      bindFmts(data);
    };
  });

  bindFmts(data);
}

function bindFmts(data) {
  document.querySelectorAll(".gp-fmt").forEach(b => {
    b.onclick = () => doDownload(location.href, b.dataset.id);
  });
}

// ── Download ──────────────────────────────────────────────
async function doDownload(url, fmtId) {
  const prog  = document.getElementById("gp-prog");
  const fill  = prog?.querySelector(".gp-fill");
  const label = prog?.querySelector(".gp-plabel");

  document.querySelectorAll(".gp-fmt").forEach(b=>b.disabled=true);
  prog?.classList.remove("hidden");
  if (fill)  { fill.className="gp-fill indeterminate"; }
  if (label) label.textContent = "Connecting…";

  try {
    const res = await fetch(`${API}/api/download`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ url, format_id: fmtId }),
    });
    if (!res.ok) { const d=await res.json(); throw new Error(d.error||"Failed"); }

    if (label) label.textContent = "Downloading file…";
    const blob = await res.blob();
    const cd   = res.headers.get("Content-Disposition")||"";
    const m    = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const name = m ? m[1].replace(/['"]/g,"") : "grabix-download";

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(a.href);

    if (fill)  { fill.className="gp-fill"; fill.style.width="100%"; }
    if (label) label.textContent = "✓ Download complete!";
    showToast("✓ Download started!");
    setTimeout(()=>prog?.classList.add("hidden"), 3500);
  } catch(e) {
    if (fill)  { fill.className="gp-fill err"; fill.style.width="100%"; }
    if (label) label.textContent = "✗ "+e.message.slice(0,80);
    showToast("✗ "+e.message.slice(0,50));
  } finally {
    document.querySelectorAll(".gp-fmt").forEach(b=>b.disabled=false);
  }
}

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 3000);
}

function fmtDur(s) {
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return h?`${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`:`${m}:${String(sec).padStart(2,"0")}`;
}

// ── Check page & inject ───────────────────────────────────
function check() {
  const p = getPlatform();
  if (p && p.isVideo()) injectButton(p);
  else removeAll();
}

check();

// SPA navigation watcher
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    btn = null; panel = null;
    setTimeout(check, 900);
  }
}).observe(document.body, { subtree:true, childList:true });
