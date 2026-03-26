const fs = require("fs");
const path = require("path");

function writeCookiesFile() {
  const cookiesContent = process.env.YOUTUBE_COOKIES;
  if (!cookiesContent) return null;
  
  const cookiePath = path.join("/tmp", "yt-cookies.txt");
  fs.writeFileSync(cookiePath, cookiesContent);
  return cookiePath;
}

module.exports = { writeCookiesFile };