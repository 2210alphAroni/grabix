import "./globals.css";

export const metadata = {
  title: "GRABIX — Universal Media Downloader",
  description: "Download videos and audio from YouTube, Facebook, TikTok, Instagram and 1000+ sites.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
