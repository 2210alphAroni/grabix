"use client";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4
                    bg-bg/85 backdrop-blur-xl border-b border-border">
      <div className="font-display text-2xl tracking-[4px] text-cyan"
           style={{ textShadow: "0 0 18px rgba(0,229,255,0.35)" }}>
        GRAB<span className="text-rose">IX</span>
      </div>

      {/* Desktop nav */}
      <ul className="hidden md:flex gap-7 list-none">
        {["Sites", "Features"].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`}
               className="text-xs font-medium text-muted tracking-widest uppercase
                          hover:text-cyan transition-colors duration-200 no-underline">
              {item}
            </a>
          </li>
        ))}
        <li>
          <span className="bg-rose text-white text-[10px] font-bold
                           px-3 py-1 rounded-full tracking-widest uppercase">
            Free
          </span>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button className="md:hidden text-2xl text-white bg-transparent border-none cursor-pointer"
              onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-bg/97 border-b border-border
                        flex flex-col gap-4 px-6 py-5 md:hidden">
          {["Download", "Sites", "Features"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
               onClick={() => setOpen(false)}
               className="text-sm font-medium text-muted tracking-widest uppercase
                          hover:text-cyan transition-colors no-underline">
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
