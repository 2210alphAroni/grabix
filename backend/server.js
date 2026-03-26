const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const infoRouter = require("./routes/info");
const downloadRouter = require("./routes/download");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  // origin: [
  //   "http://localhost:3000", 
  //   "http://localhost:3001",
  //   "chrome-extension://*",   
  //   "moz-extension://*",      
  // ],
  origin: true,
  methods: ["GET", "POST"],
}));

app.use(express.json());

// Ensure downloads dir exists
const downloadsDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir);

// ── Routes ────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "GRABIX backend is running 🚀", version: "1.0.0" });
});

app.use("/api/info",     infoRouter);
app.use("/api/download", downloadRouter);

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 GRABIX Backend running → http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
});
