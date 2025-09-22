"use client";
import { useEffect } from "react";

const NeonBackground: React.FC = () => {
  useEffect(() => {
    // fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // styles
    const style = document.createElement("style");
    style.textContent = `
      .gaming-text {
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Orbitron','Rajdhani',monospace;
        font-size: clamp(3rem, 8vw, 8rem);
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: transparent;
        -webkit-text-stroke: 3px rgba(255,255,255,0.15);
        text-stroke: 3px rgba(255,255,255,0.15);
        z-index: 0;
        opacity: 0.12;
        pointer-events: none;
        user-select: none;
        animation: pulse 3s ease-in-out infinite;
      }
      .gaming-text::before {
        content: 'GAMING GEAR';
        position: absolute; inset: 0;
        color: transparent;
        -webkit-text-stroke: 2px rgba(56,189,248,0.28); /* #38BDF8 */
        text-stroke: 2px rgba(56,189,248,0.35);
        filter: blur(2px);
        animation: glow 4s ease-in-out infinite alternate;
      }
      .gaming-text::after {
        content: 'GAMING GEAR';
        position: absolute; inset: 0;
        color: transparent;
        -webkit-text-stroke: 1px rgba(14,165,233,0.18); /* #0EA5E9 */
        text-stroke: 1px rgba(14,165,233,0.25);
        filter: blur(4px);
        animation: glow 6s ease-in-out infinite alternate-reverse;
      }
      @keyframes pulse { 0%,100%{ opacity:.2; transform:translate(-50%,-50%) scale(1);}
                         50%{ opacity:.35; transform:translate(-50%,-50%) scale(1.02);} }
      @keyframes glow { from{ filter: blur(2px) brightness(1);}
                        to  { filter: blur(2px) brightness(1.15);} }
      .dark .gaming-text { -webkit-text-stroke: 3px rgba(255,255,255,0.10); opacity:.12; }
      .dark .gaming-text::before { -webkit-text-stroke: 2px rgba(56,189,248,0.28); }
      .dark .gaming-text::after  { -webkit-text-stroke: 1px rgba(14,165,233,0.18); }

      @media (max-width: 768px) {
        .gaming-text { font-size: clamp(2rem, 6vw, 4rem); letter-spacing: .1em; }
      }
      @media (max-width: 480px) {
        .gaming-text { font-size: clamp(1.5rem, 5vw, 3rem); letter-spacing: .05em; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  return <div className="gaming-text">GAMING GEAR</div>;
};

export default NeonBackground;
