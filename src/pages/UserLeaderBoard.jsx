import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../services/api";

/* ── Particle System ─────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const colors = ["#ef4444", "#F97316", "#dc2626", "#fb923c", "#fca5a5"];
    for (let i = 0; i < 70; i++) {
      particles.current.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.3,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.current.forEach(p => {
        p.pulse += 0.018;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(a * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // draw connections
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i], b = particles.current[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const alpha = (1 - dist / 90) * 0.07;
            ctx.strokeStyle = `rgba(239,68,68,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7 }}
    />
  );
}

/* ── Scroll Reveal Hook ──────────────────────────────────── */
function useScrollReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ── Counter Animation ───────────────────────────────────── */
function AnimatedNumber({ value, duration = 1200, visible }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, visible, duration]);
  return <>{display}</>;
}

/* ── Podium Card ─────────────────────────────────────────── */
function PodiumCard({ student, position, visible }) {
  const [hovered, setHovered] = useState(false);
  const cfg = {
    1: {
      emoji: "🥇", glow: "#F97316", ring: "rgba(249,115,22,0.8)",
      label: "1ST", cardH: 190, blockH: 95,
      blockBg: "linear-gradient(180deg,#F97316,#c2410c)",
      textColor: "#F97316", order: 2, delay: "0.2s",
      shadow: "0 0 40px #F9731655, 0 0 80px #F9731622",
      animShadow: "0 0 60px #F9731699, 0 0 120px #F9731633",
    },
    2: {
      emoji: "🥈", glow: "#ef4444", ring: "rgba(239,68,68,0.7)",
      label: "2ND", cardH: 155, blockH: 68,
      blockBg: "linear-gradient(180deg,#ef4444,#991b1b)",
      textColor: "#ef4444", order: 1, delay: "0.4s",
      shadow: "0 0 28px #ef444444",
      animShadow: "0 0 50px #ef444477",
    },
    3: {
      emoji: "🥉", glow: "#dc2626", ring: "rgba(220,38,38,0.6)",
      label: "3RD", cardH: 135, blockH: 52,
      blockBg: "linear-gradient(180deg,#dc2626,#7f1d1d)",
      textColor: "#fca5a5", order: 3, delay: "0.6s",
      shadow: "0 0 20px #dc262633",
      animShadow: "0 0 40px #dc262655",
    },
  };

  const c = cfg[position];
  if (!student) return <div style={{ order: c.order }} />;
  const shortName = student.name.length > 13 ? student.name.split(" ")[0] : student.name;
  const translateY = visible ? 0 : 60;
  const opacity = visible ? 1 : 0;

  return (
    <div
      style={{
        order: c.order,
        display: "flex", flexDirection: "column", alignItems: "center",
        transform: `translateY(${translateY}px) scale(${position === 1 ? 1.08 : 1})`,
        opacity,
        transition: `transform 0.8s cubic-bezier(0.34,1.56,0.64,1) ${c.delay}, opacity 0.6s ease ${c.delay}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        height: c.cardH, width: "clamp(108px,22vw,148px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 7,
        borderRadius: 20, border: `2px solid ${c.ring}`,
        background: "rgba(8,0,0,0.75)", backdropFilter: "blur(16px)",
        padding: "14px 10px",
        boxShadow: hovered ? c.animShadow : c.shadow,
        transition: "box-shadow 0.4s ease, transform 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        cursor: "default", position: "relative", overflow: "hidden",
      }}>
        {/* shimmer top line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)" }} />
        {/* rank glow orb */}
        <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${c.glow}22 0%, transparent 70%)`, pointerEvents: "none" }} />
        <span style={{ fontSize: "clamp(30px,6vw,44px)", lineHeight: 1, filter: hovered ? `drop-shadow(0 0 8px ${c.glow})` : "none", transition: "filter 0.3s" }}>{c.emoji}</span>
        <p style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: "clamp(10px,2.5vw,13px)", color: c.textColor, textAlign: "center", lineHeight: 1.3, margin: 0 }}>
          {shortName}
        </p>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(255,255,255,0.35)", fontSize: "clamp(9px,2vw,11px)", margin: 0 }}>
          {student.roll}
        </p>
        <div style={{ padding: "3px 12px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: `1px solid ${c.glow}55`, color: c.textColor, fontWeight: 700, fontSize: "clamp(10px,2.5vw,13px)", fontFamily: "'Share Tech Mono',monospace", letterSpacing: "0.05em" }}>
          <AnimatedNumber value={student.points} visible={visible} /> pts
        </div>
      </div>
      <div style={{
        height: c.blockH, width: "clamp(108px,22vw,148px)",
        background: c.blockBg, borderRadius: "8px 8px 0 0",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 4px 24px ${c.glow}33`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(255,255,255,0.08) 0%, transparent 50%)" }} />
        <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, color: "#fff", fontSize: "clamp(14px,3vw,22px)", letterSpacing: "0.12em", position: "relative" }}>{c.label}</span>
      </div>
    </div>
  );
}

/* ── Row Animation Wrapper ───────────────────────────────── */
function AnimatedRow({ children, index }) {
  const [ref, visible] = useScrollReveal(0.05);
  return (
    <tr
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-24px)",
        transition: `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s`,
      }}
    >
      {children}
    </tr>
  );
}

/* ── Animated Mobile Card ────────────────────────────────── */
function AnimatedMobileCard({ children, index, style }) {
  const [ref, visible] = useScrollReveal(0.05);
  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transition: `opacity 0.55s ease ${index * 0.05}s, transform 0.55s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.05}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Glitch Text ─────────────────────────────────────────── */
function GlitchText({ text, style, className }) {
  return (
    <span className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      {text}
      <span aria-hidden style={{
        position: "absolute", inset: 0, color: "#ef4444",
        clipPath: "polygon(0 30%, 100% 30%, 100% 50%, 0 50%)",
        animation: "glitch-1 3.5s infinite",
        left: 2,
      }}>{text}</span>
      <span aria-hidden style={{
        position: "absolute", inset: 0, color: "#F97316",
        clipPath: "polygon(0 60%, 100% 60%, 100% 80%, 0 80%)",
        animation: "glitch-2 3.5s infinite",
        left: -2,
      }}>{text}</span>
    </span>
  );
}

/* ── Scanning Line Component ─────────────────────────────── */
function ScanLines() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2, opacity: 0.03, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)" }} />
  );
}



/* ── Main Component ──────────────────────────────────────── */
export default function UserLeaderboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [podiumVisible, setPodiumVisible] = useState(false);
  const podiumRef = useRef(null);
  const tickerRef = useRef(null);

  useEffect(() => {
    api.get("/students").then(res => setData(res.data));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setPodiumVisible(true); },
      { threshold: 0.2 }
    );
    if (podiumRef.current) obs.observe(podiumRef.current);
    return () => obs.disconnect();
  }, [data]);

  const handleEnter = () => {
    try {
      const speech = new SpeechSynthesisUtterance("Welcome to Ignite Club BugByte");
      window.speechSynthesis.speak(speech);
    } catch (_) {}
    setExiting(true);
    setTimeout(() => setShowWelcome(false), 700);
  };

  const sorted = [...data].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);
  const filtered = sorted.filter(s =>
    s.roll.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const medal = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : null;
  const rowBorder = r => r === 1 ? "rgba(249,115,22,0.7)" : r === 2 ? "rgba(239,68,68,0.6)" : r === 3 ? "rgba(220,38,38,0.5)" : "transparent";
  const rowBg = r => r === 1 ? "rgba(249,115,22,0.05)" : r === 2 ? "rgba(239,68,68,0.04)" : r === 3 ? "rgba(220,38,38,0.03)" : "rgba(255,255,255,0.015)";
  const mobileCardBorder = r => r === 1 ? "rgba(249,115,22,0.55)" : r === 2 ? "rgba(239,68,68,0.45)" : r === 3 ? "rgba(220,38,38,0.4)" : "rgba(255,255,255,0.07)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .lb-wrap {
          font-family: 'Rajdhani', sans-serif;
          background: #060606;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          color: #f0f0f0;
        }

        /* animated gradient bg */
        .lb-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 55% at 10% 5%, rgba(185,28,28,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 90% 95%, rgba(194,65,12,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 40%, rgba(239,68,68,0.06) 0%, transparent 70%);
          animation: bgShift 12s ease-in-out infinite alternate;
        }
        @keyframes bgShift {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.04); }
        }

        .lb-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridMove 20s linear infinite;
        }
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 48px 48px; }
        }

        .lb-inner { position: relative; z-index: 3; max-width: 1140px; margin: 0 auto; padding: clamp(16px,4vw,52px) clamp(12px,3vw,36px) 52px; }

        /* ── Welcome ── */
        .welcome {
          position: fixed; inset: 0; z-index: 200;
          background: #060606;
          display: flex; align-items: center; justify-content: center; flex-direction: column;
          transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.4,0,0.2,1);
        }
        .welcome.exit { opacity: 0; transform: scale(1.08) translateY(-20px); pointer-events: none; }

        .scanline-anim {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(239,68,68,0.5) 20%, rgba(249,115,22,0.7) 50%, rgba(239,68,68,0.5) 80%, transparent 100%);
          animation: scan 3s linear infinite;
          pointer-events: none;
        }
        @keyframes scan { from { top: -2px; } to { top: 100%; } }

        .enter-btn {
          font-family: 'Orbitron', monospace; font-weight: 700;
          letter-spacing: 0.14em; font-size: clamp(12px,2.5vw,15px);
          padding: 15px clamp(32px,5vw,52px);
          border-radius: 14px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #dc2626 0%, #F97316 100%);
          color: white;
          box-shadow: 0 0 40px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
          position: relative; z-index: 1;
          animation: btnPulse 2s ease-in-out infinite;
        }
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 0 40px rgba(239,68,68,0.6), 0 0 80px rgba(239,68,68,0.2); }
          50% { box-shadow: 0 0 60px rgba(239,68,68,0.9), 0 0 120px rgba(249,115,22,0.3); }
        }
        .enter-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 0 70px rgba(239,68,68,0.95), 0 0 140px rgba(249,115,22,0.4);
          animation: none;
        }
        .enter-btn:active { transform: scale(0.97); }

        /* ── Glitch ── */
        @keyframes glitch-1 {
          0%,94%,100% { transform: translateX(0); opacity: 0; }
          95% { transform: translateX(-3px); opacity: 0.7; }
          97% { transform: translateX(2px); opacity: 0.5; }
          99% { transform: translateX(-1px); opacity: 0.3; }
        }
        @keyframes glitch-2 {
          0%,91%,100% { transform: translateX(0); opacity: 0; }
          92% { transform: translateX(3px); opacity: 0.6; }
          94% { transform: translateX(-2px); opacity: 0.4; }
          96% { transform: translateX(1px); opacity: 0.2; }
        }

        .orbitron { font-family: 'Orbitron', monospace; }
        .mono { font-family: 'Share Tech Mono', monospace; }
        .neon-red { color: #ef4444; text-shadow: 0 0 15px #ef444499, 0 0 40px #ef444433; }
        .neon-orange { color: #F97316; text-shadow: 0 0 15px #F9731699, 0 0 40px #F9731633; }

        @keyframes pulse { 0%,100% { opacity:0.45; } 50% { opacity:1; } }
        .pulse { animation: pulse 2.5s ease-in-out infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fu { animation: fadeUp 0.7s cubic-bezier(0.34,1.2,0.64,1) both; }
        .fu1 { animation-delay: 0.1s; }
        .fu2 { animation-delay: 0.25s; }
        .fu3 { animation-delay: 0.4s; }
        .fu4 { animation-delay: 0.55s; }

        .divider {
          height: 1px; margin: 0 auto;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.7), rgba(249,115,22,0.6), transparent);
          animation: dividerGlow 3s ease-in-out infinite alternate;
        }
        @keyframes dividerGlow {
          0% { opacity: 0.5; }
          100% { opacity: 1; box-shadow: 0 0 8px rgba(239,68,68,0.4); }
        }

        /* ── Live Badge ── */
        .live-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; border-radius: 99px;
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.35);
          font-family: 'Share Tech Mono', monospace; font-size: 11px;
          color: #ef4444; letter-spacing: 0.12em;
        }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #ef4444;
          animation: livePulse 1.2s ease-in-out infinite;
          box-shadow: 0 0 6px #ef4444;
        }
        @keyframes livePulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.6; }
        }

        /* ── Ticker ── */
        .ticker-wrap {
          overflow: hidden; background: rgba(239,68,68,0.06);
          border-top: 1px solid rgba(239,68,68,0.15);
          border-bottom: 1px solid rgba(239,68,68,0.15);
          padding: 10px 0; margin-bottom: 40px;
        }
        .ticker-track {
          display: flex; gap: 60px;
          animation: ticker 25s linear infinite;
          white-space: nowrap;
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker-item {
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px; color: rgba(239,68,68,0.6);
          letter-spacing: 0.1em; flex-shrink: 0;
        }
        .ticker-sep { color: rgba(249,115,22,0.5); }

        /* ── Search ── */
        .search-wrap { display: flex; justify-content: center; position: sticky; top: 12px; z-index: 40; }
        .search-input {
          width: 100%; max-width: 520px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 14px;
          padding: 14px 22px 14px 48px;
          color: #f0f0f0; font-size: 14px; outline: none;
          backdrop-filter: blur(18px);
          font-family: 'Rajdhani', sans-serif; font-weight: 500;
          transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
        }
        .search-input::placeholder { color: rgba(240,240,240,0.2); font-family: 'Rajdhani', sans-serif; }
        .search-input:focus {
          border-color: rgba(239,68,68,0.6);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1), 0 0 30px rgba(239,68,68,0.12);
        }
        .search-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: rgba(239,68,68,0.45); font-size: 16px; pointer-events: none;
        }

        /* ── Table ── */
        .card-wrap {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(239,68,68,0.12);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(220,38,38,0.05), inset 0 1px 0 rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
        }
        .lb-table { width: 100%; border-collapse: separate; border-spacing: 0 4px; padding: 12px 14px; }
        .lb-table thead th {
          font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 0.18em;
          color: rgba(239,68,68,0.5); padding: 12px 16px; text-align: left;
          border-bottom: 1px solid rgba(239,68,68,0.08);
        }
        .lb-table thead th.c { text-align: center; }
        .lb-table tbody td {
          padding: 15px 16px; font-size: 14px; font-weight: 500; vertical-align: middle;
          transition: background 0.2s;
        }
        .lb-table tbody td.c { text-align: center; }
        .lb-table tbody td:first-child { border-radius: 12px 0 0 12px; }
        .lb-table tbody td:last-child { border-radius: 0 12px 12px 0; }
        .lb-table tbody tr:hover td { background: rgba(239,68,68,0.06) !important; }
        .lb-table tbody tr { cursor: default; }
        .lb-table tbody tr:hover { transform: translateX(3px); }
        .lb-table tbody tr { transition: transform 0.2s ease; }

        .rank-chip {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 40px; height: 28px; border-radius: 8px;
          font-family: 'Share Tech Mono', monospace; font-size: 12px; font-weight: 700;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          color: rgba(240,240,240,0.4);
        }
        .pts-chip {
          display: inline-block; padding: 4px 14px; border-radius: 99px;
          background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.28);
          color: #F97316; font-weight: 700; font-size: 13px; font-family: 'Share Tech Mono', monospace;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .lb-table tbody tr:hover .pts-chip {
          background: rgba(249,115,22,0.18);
          box-shadow: 0 0 12px rgba(249,115,22,0.2);
        }
        .link-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 13px; border-radius: 10px; font-size: 12px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.07); color: rgba(240,240,240,0.45);
          background: rgba(255,255,255,0.025); text-decoration: none;
          transition: all 0.2s ease; font-family: 'Rajdhani', sans-serif; letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .link-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.4); color: #ef4444; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239,68,68,0.15); }

        /* ── Mobile cards ── */
        .m-card {
          background: rgba(255,255,255,0.02);
          border-radius: 18px; padding: 18px;
          backdrop-filter: blur(12px);
        }
        .m-card:active { transform: scale(0.98); }

        /* ── Footer ── */
        .lb-footer {
          text-align: center; padding: 32px 16px;
          border-top: 1px solid rgba(239,68,68,0.07);
          position: relative; z-index: 3; margin-top: 60px;
        }

        /* ── Stats Bar ── */
        .stats-bar {
          display: flex; justify-content: center; gap: clamp(24px,4vw,60px);
          padding: 20px; border-radius: 16px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(239,68,68,0.1);
          backdrop-filter: blur(10px); margin-bottom: 48px;
        }
        .stat-item { text-align: center; }
        .stat-value { font-family: 'Orbitron', monospace; font-size: clamp(18px,3vw,26px); font-weight: 900; color: #ef4444; text-shadow: 0 0 20px #ef444455; }
        .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: rgba(240,240,240,0.3); letter-spacing: 0.14em; margin-top: 2px; }

        /* ── responsive ── */
        .desktop-only { display: none; }
        .mobile-only { display: flex; flex-direction: column; gap: 10px; }
        @media (min-width: 768px) { .desktop-only { display: block; } .mobile-only { display: none; } }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060606; }
        ::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.25); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(239,68,68,0.45); }
      `}</style>

      <div className="lb-wrap">
        <ParticleCanvas />
        <ScanLines />
        <div className="lb-bg" />
        <div className="lb-grid" />

        {/* ── Welcome Screen ── */}
        {showWelcome && (
          <div className={`welcome${exiting ? " exit" : ""}`}>
            <div className="scanline-anim" />
            <div style={{ textAlign: "center", padding: "0 24px", position: "relative", zIndex: 1 }}>
              <p className="mono pulse" style={{ color: "rgba(239,68,68,0.6)", fontSize: 11, letterSpacing: "0.3em", marginBottom: 28 }}>
                ▶ SYSTEM INITIALIZING...
              </p>
              <h1 className="orbitron" style={{ fontSize: "clamp(36px,8vw,72px)", fontWeight: 900, lineHeight: 1, marginBottom: 10, position: "relative" }}>
                <GlitchText text="IGNITE" style={{ color: "#ef4444", textShadow: "0 0 20px #ef444499, 0 0 60px #ef444433" }} />
                {" "}
                <GlitchText text="CLUB" style={{ color: "#f0f0f0", textShadow: "0 0 20px rgba(255,255,255,0.2)" }} />
              </h1>
              <h2 className="orbitron neon-orange" style={{ fontSize: "clamp(18px,4vw,32px)", fontWeight: 700, marginBottom: 8 }}>
                BUGBYTE 🎉
              </h2>
              <p style={{ color: "rgba(240,240,240,0.25)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 52 }}>
                VISHVESHWARYA GROUP OF INSTITUTION
              </p>
              <button className="enter-btn" onClick={handleEnter}>⚡ ENTER ARENA</button>
            </div>
          </div>
        )}

        {/* ── Ticker ── */}
        {!showWelcome && (
          <div className="ticker-wrap">
            <div className="ticker-track">
              {[...Array(2)].map((_, i) => (
                sorted.map(s => (
                  <span key={`${i}-${s._id}`} className="ticker-item">
                    #{s.rank} {s.name} <span className="ticker-sep">—</span> {s.points} PTS <span className="ticker-sep">◆</span>
                  </span>
                ))
              ))}
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        <div className="lb-inner">

          {/* Header */}
          <div className="fu fu1" style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, alignItems: "center", marginBottom: 18 }}>
              <span className="live-badge"><span className="live-dot" />LIVE RANKINGS</span>
            </div>
            <p className="mono pulse" style={{ color: "rgba(239,68,68,0.4)", fontSize: 10, letterSpacing: "0.26em", marginBottom: 16 }}>
              VISHVESHWARYA GROUP OF INSTITUTION
            </p>
            <h1 className="orbitron" style={{ fontSize: "clamp(28px,6vw,58px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 10 }}>
              <GlitchText text="IGNITE CLUB" style={{ color: "#ef4444", textShadow: "0 0 20px #ef444488, 0 0 50px #ef444422" }} />
            </h1>
            <h2 className="orbitron neon-orange" style={{ fontSize: "clamp(13px,3vw,22px)", fontWeight: 700, marginBottom: 24, letterSpacing: "0.08em" }}>
              BUGBYTE — LEADERBOARD
            </h2>
            <div className="divider" style={{ maxWidth: 420 }} />
          </div>

          {/* Stats */}
          <div className="fu fu2">
            <StatsBar data={sorted} />
          </div>

          {/* Podium */}
          {top3.length > 0 && (
            <div ref={podiumRef} className="fu fu3" style={{ marginBottom: 64 }}>
              <p className="orbitron pulse" style={{ textAlign: "center", color: "rgba(239,68,68,0.5)", fontSize: 10, letterSpacing: "0.26em", marginBottom: 36 }}>
                🏆 &nbsp; TOP PERFORMERS &nbsp; 🏆
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(10px,3vw,32px)" }}>
                <PodiumCard student={top3[1]} position={2} visible={podiumVisible} />
                <PodiumCard student={top3[0]} position={1} visible={podiumVisible} />
                <PodiumCard student={top3[2]} position={3} visible={podiumVisible} />
              </div>
            </div>
          )}

          {/* Search */}
          <div className="fu fu4 search-wrap" style={{ marginBottom: 28 }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search by Roll No or Name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="desktop-only">
            <div className="card-wrap">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th className="c" style={{ width: 72 }}>RANK</th>
                    <th className="c">ROLL NO</th>
                    <th>NAME</th>
                    <th className="c">POINTS</th>
                    <th className="c">LINKEDIN</th>
                    <th className="c">GITHUB</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => {
                    const m = medal(item.rank);
                    return (
                      <AnimatedRow key={item._id} index={i}>
                        <td className="c" style={{ background: rowBg(item.rank), borderLeft: `3px solid ${rowBorder(item.rank)}` }}>
                          {m ? <span style={{ fontSize: 22 }}>{m}</span> : <span className="rank-chip">#{item.rank}</span>}
                        </td>
                        <td className="c mono" style={{ color: "#F97316", fontSize: 13, background: rowBg(item.rank) }}>{item.roll}</td>
                        <td style={{ fontWeight: 600, background: rowBg(item.rank), fontFamily: "'Rajdhani',sans-serif", fontSize: 15 }}>{item.name}</td>
                        <td className="c" style={{ background: rowBg(item.rank) }}><span className="pts-chip">{item.points}</span></td>
                        <td className="c" style={{ background: rowBg(item.rank) }}>
                          {item.linkedin
                            ? <a href={item.linkedin} target="_blank" rel="noreferrer" className="link-btn">🔗 LinkedIn</a>
                            : <span style={{ color: "rgba(255,255,255,0.1)" }}>—</span>}
                        </td>
                        <td className="c" style={{ background: rowBg(item.rank) }}>
                          {item.github
                            ? <a href={item.github} target="_blank" rel="noreferrer" className="link-btn">🐙 GitHub</a>
                            : <span style={{ color: "rgba(255,255,255,0.1)" }}>—</span>}
                        </td>
                      </AnimatedRow>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-only">
            {filtered.map((item, i) => {
              const m = medal(item.rank);
              return (
                <AnimatedMobileCard
                  key={item._id}
                  index={i}
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 18, padding: 18,
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${mobileCardBorder(item.rank)}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {m ? <span style={{ fontSize: 26 }}>{m}</span> : <span className="rank-chip">#{item.rank}</span>}
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 16, color: "#f0f0f0", fontFamily: "'Rajdhani',sans-serif" }}>{item.name}</p>
                        <p className="mono" style={{ color: "#F97316", fontSize: 12 }}>{item.roll}</p>
                      </div>
                    </div>
                    <span className="pts-chip">{item.points} pts</span>
                  </div>
                  {(item.linkedin || item.github) && (
                    <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                      {item.linkedin && <a href={item.linkedin} target="_blank" rel="noreferrer" className="link-btn" style={{ flex: 1, justifyContent: "center" }}>🔗 LinkedIn</a>}
                      {item.github && <a href={item.github} target="_blank" rel="noreferrer" className="link-btn" style={{ flex: 1, justifyContent: "center" }}>🐙 GitHub</a>}
                    </div>
                  )}
                </AnimatedMobileCard>
              );
            })}
            {filtered.length === 0 && (
              <p className="mono" style={{ textAlign: "center", color: "rgba(240,240,240,0.18)", marginTop: 48, letterSpacing: "0.14em" }}>
                NO RESULTS FOUND
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="lb-footer">
          <p className="orbitron" style={{ color: "rgba(239,68,68,0.45)", fontSize: 11, letterSpacing: "0.24em" }}>IGNITE CLUB — BUGBYTE</p>
          <p style={{ color: "rgba(255,255,255,0.12)", fontSize: 12, marginTop: 8, fontFamily: "'Share Tech Mono',monospace" }}>© 2026 BUGBYTE — ALL RIGHTS RESERVED</p>
        </footer>
      </div>
    </>
  );
}

/* ── Stats Bar Component ─────────────────────────────────── */
function StatsBar({ data }) {
  const [ref, visible] = useScrollReveal(0.1);
  const totalPts = data.reduce((s, d) => s + d.points, 0);
  const topPts = data[0]?.points || 0;
  const participants = data.length;

  return (
    <div ref={ref} className="stats-bar" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
    }}>
      <div className="stat-item">
        <div className="stat-value"><AnimatedNumber value={participants} visible={visible} /></div>
        <div className="stat-label">PARTICIPANTS</div>
      </div>
      <div style={{ width: 1, background: "rgba(239,68,68,0.15)", alignSelf: "stretch" }} />
      <div className="stat-item">
        <div className="stat-value"><AnimatedNumber value={topPts} visible={visible} /></div>
        <div className="stat-label">TOP SCORE</div>
      </div>
      <div style={{ width: 1, background: "rgba(239,68,68,0.15)", alignSelf: "stretch" }} />
      <div className="stat-item">
        <div className="stat-value"><AnimatedNumber value={totalPts} visible={visible} /></div>
        <div className="stat-label">TOTAL POINTS</div>
      </div>
    </div>
  );
}