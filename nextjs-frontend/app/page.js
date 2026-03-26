import Navbar     from "@/components/Navbar";
import Hero       from "@/components/Hero";
import Sites      from "@/components/Sites";
import Features   from "@/components/Features";
import Footer     from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* Ambient blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[55%] h-[55%] rounded-full pointer-events-none z-0"
           style={{ background: "radial-gradient(ellipse, rgba(0,229,255,0.07) 0%, transparent 70%)",
                    animation: "drift1 9s ease-in-out infinite alternate",
                    filter: "blur(80px)" }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none z-0"
           style={{ background: "radial-gradient(ellipse, rgba(255,61,107,0.06) 0%, transparent 70%)",
                    animation: "drift2 11s ease-in-out infinite alternate",
                    filter: "blur(80px)" }} />

      <style>{`
        @keyframes drift1 { from{transform:translate(0,0) scale(1)} to{transform:translate(4%,7%) scale(1.08)} }
        @keyframes drift2 { from{transform:translate(0,0)} to{transform:translate(-4%,-5%)} }
      `}</style>

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Sites />
        <Features />
      </main>
      <Footer />
    </>
  );
}
