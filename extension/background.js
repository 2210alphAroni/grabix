// GRABIX — Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("GRABIX Downloader installed ✅");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "CHECK_BACKEND") {
    fetch("http://localhost:5000/api/health", { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((d) => sendResponse({ ok: true, data: d }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }
});
