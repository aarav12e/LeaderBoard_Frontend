import { useEffect, useRef, useState } from "react";

function HoloPodiumCard({ student, position, visible }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shimmer, setShimmer] = useState({ x: 50, y: 50 });
  const [hov, setHov] = useState(false);
  const [sparks, setSparks] = useState([]);

  const cfg = {
    1: { emoji: "🥇", col: "#00ffcc", col2: "#00aaff", label: "1ST", order: 2, cardH: 200, blockH: 100, delay: 0.1 },
    2: { emoji: "🥈", col: "#00aaff", col2: "#7700ff", label: "2ND", order: 1, cardH: 160, blockH: 70, delay: 0.35 },
    3: { emoji: "🥉", col: "#aa00ff", col2: "#ff0088", label: "3RD", order: 3, cardH: 138, blockH: 54, delay: 0.6 },
  };
  const c = cfg[position];

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setSparks(Array.from({ length: 18 }, (_, i) => ({ id: i, angle: (i / 18) * 360, dist: 40 + Math.random() * 60, size: 2 + Math.random() * 5 })));
      setTimeout(() => setSparks([]), 1000);
    }, c.delay * 1000 + 600);
    return () => clearTimeout(t);
  }, [visible, c.delay]);

  if (!student) return <div style={{ order: c.order }} />;
  const shortName = student.name.length > 12 ? student.name.split(" ")[0] : student.name;

  const onMouseMove = e => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * 24, y: (x - 0.5) * -24 });
    setShimmer({ x: x * 100, y: y * 100 });
  };

  const onMouseLeave = () => { setTilt({ x: 0, y: 0 }); setHov(false); };

  return (
    <div style={{ order: c.order, display: "flex", flexDirection: "column", alignItems: "center", opacity: visible ? 1 : 0, transform: visible ? `scale(${position === 1 ? 1.1 : 1})` : "translateY(80px) scale(0.8)", transition: `all 0.9s cubic-bezier(0.34,1.56,0.64,1) ${c.delay}s`, transformOrigin: "bottom center", position: "relative" }}>
      {sparks.map(sp => (
        <div key={sp.id} style={{ position: "absolute", top: "40%", left: "50%", width: sp.size, height: sp.size, borderRadius: "50%", background: c.col, boxShadow: `0 0 8px ${c.col}`, transform: `rotate(${sp.angle}deg) translateX(${sp.dist}px)`, animation: "sparkOut 0.9s ease-out forwards", zIndex: 20, pointerEvents: "none" }} />
      ))}
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={onMouseLeave}
        style={{
          height: c.cardH, width: "clamp(110px,20vw,150px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
          borderRadius: 4,
          background: "linear-gradient(145deg,rgba(0,4,14,0.96),rgba(0,12,28,0.88))",
          border: `1px solid ${hov ? c.col + "99" : c.col + "44"}`,
          padding: "14px 10px",
          boxShadow: hov ? `0 0 0 1px ${c.col}55,0 0 50px ${c.col}44,0 0 100px ${c.col}18,inset 0 0 30px ${c.col}10` : `0 0 0 1px ${c.col}22,0 0 25px ${c.col}18`,
          transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: hov ? "transform 0.06s,box-shadow 0.3s,border-color 0.3s" : "transform 0.7s cubic-bezier(0.34,1.2,0.64,1),box-shadow 0.3s",
          cursor: "default", position: "relative", overflow: "hidden",
        }}
      >
        {hov && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2, background: `radial-gradient(circle at ${shimmer.x}% ${shimmer.y}%,rgba(255,255,255,0.12) 0%,transparent 60%)`, mixBlendMode: "overlay" }} />}
        {hov && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3, background: `linear-gradient(${shimmer.x + shimmer.y}deg,transparent 0%,rgba(0,255,200,0.06) 20%,rgba(0,150,255,0.07) 40%,rgba(200,0,255,0.05) 60%,rgba(255,200,0,0.04) 80%,transparent 100%)`, mixBlendMode: "screen" }} />}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${c.col}99,transparent)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${c.col}55,transparent)`, animation: "scanCard 2.5s linear infinite" }} />
        <span style={{ fontSize: "clamp(28px,5vw,42px)", lineHeight: 1, filter: hov ? `drop-shadow(0 0 14px ${c.col})` : "none", transition: "filter 0.3s", zIndex: 4 }}>{c.emoji}</span>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: 700, fontSize: "clamp(9px,2vw,12px)", color: c.col, textAlign: "center", lineHeight: 1.3, margin: 0, textShadow: `0 0 10px ${c.col}88`, zIndex: 4 }}>{shortName}</p>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(0,255,200,0.28)", fontSize: "clamp(8px,1.8vw,10px)", margin: 0, letterSpacing: "0.1em", zIndex: 4 }}>{student.roll}</p>
        <div style={{ padding: "3px 12px", borderRadius: 2, background: "rgba(0,0,0,0.5)", border: `1px solid ${c.col}44`, color: c.col, fontWeight: 700, fontSize: "clamp(10px,2vw,12px)", fontFamily: "'Share Tech Mono',monospace", letterSpacing: "0.08em", textShadow: `0 0 12px ${c.col}`, zIndex: 4 }}>
          {student.points} XP
        </div>
      </div>
      <div style={{ height: c.blockH, width: "clamp(110px,20vw,150px)", background: `linear-gradient(180deg,${c.col}2a 0%,${c.col2}18 50%,rgba(0,0,0,0.6) 100%)`, border: `1px solid ${c.col}33`, borderTop: "none", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `repeating-linear-gradient(0deg,transparent,transparent 8px,${c.col}0a 8px,${c.col}0a 9px)` }} />
        <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, color: c.col, fontSize: "clamp(14px,2.8vw,22px)", letterSpacing: "0.16em", textShadow: `0 0 24px ${c.col},0 0 50px ${c.col}55`, position: "relative" }}>{c.label}</span>
      </div>
    </div>
  );
}

export default function UserLeaderboardPodium({ top3, podiumVisible, podiumRef }) {
  if (!top3.length) return null;
  return (
    <div ref={podiumRef} className="fu fu3" style={{ marginBottom: 72 }}>
      <p style={{ textAlign: "center", color: "rgba(0,255,160,0.28)", fontSize: 9, letterSpacing: "0.32em", marginBottom: 40, fontFamily: "'Share Tech Mono',monospace" }}>◈ &nbsp; ELITE OPERATIVES &nbsp; ◈</p>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(12px,3vw,38px)" }}>
        <HoloPodiumCard student={top3[1]} position={2} visible={podiumVisible} />
        <HoloPodiumCard student={top3[0]} position={1} visible={podiumVisible} />
        <HoloPodiumCard student={top3[2]} position={3} visible={podiumVisible} />
      </div>
    </div>
  );
}
