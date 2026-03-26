const fs = require("fs");

function writeCookiesFile() {
  const content = process.env.YOUTUBE_COOKIES;
  if (!content) return null;
  const cookiePath = "/tmp/yt-cookies.txt";
  fs.writeFileSync(cookiePath, content);
  return cookiePath;
}

module.exports = { writeCookiesFile };