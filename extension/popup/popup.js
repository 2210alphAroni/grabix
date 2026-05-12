async function check() {
  const dot = document.getElementById("dot");
  const stxt = document.getElementById("stxt");
  stxt.textContent = "Checking…"; dot.className = "dot";
  try {
    const r = await fetch("https://grabix-backend.onrender.com/api/health", {signal: AbortSignal.timeout(3000)});
    if (r.ok) { dot.className="dot on"; stxt.textContent="Backend connected ✓"; stxt.style.color="#00ff9d"; }
    else throw new Error();
  } catch {
    dot.className="dot off"; stxt.textContent="Offline"; stxt.style.color="#ff5f5f";
  }
}

document.getElementById("check-btn").addEventListener("click", check);
check();