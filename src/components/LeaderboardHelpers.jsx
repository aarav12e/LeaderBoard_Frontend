import { useEffect, useRef, useState } from "react";

export function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

export function Counter({ value, visible, duration = 1400 }) {
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

export function SlotRank({ rank, trigger }) {
  const [display, setDisplay] = useState(Math.floor(Math.random() * 99) + 1);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setSettled(false);
    let count = 0;
    const total = 12 + rank * 2;
    const iv = setInterval(() => {
      setDisplay(Math.floor(Math.random() * 99) + 1);
      count++;
      if (count >= total) {
        clearInterval(iv);
        setDisplay(rank);
        setSettled(true);
      }
    }, 55);
    return () => clearInterval(iv);
  }, [trigger, rank]);

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: 40, height: 28, borderRadius: 3,
      fontFamily: "'Share Tech Mono',monospace", fontSize: 12, fontWeight: 700,
      color: settled ? "rgba(0,255,160,0.4)" : "#00ffcc",
      background: settled ? "rgba(0,255,160,0.05)" : "rgba(0,255,200,0.1)",
      border: settled ? "1px solid rgba(0,255,160,0.12)" : "1px solid rgba(0,255,200,0.4)",
      textShadow: settled ? "none" : "0 0 10px #00ffcc",
      transition: "all 0.4s",
      boxShadow: settled ? "none" : "0 0 14px rgba(0,255,200,0.2)",
    }}>{`#${display}`}</span>
  );
}

export function rankGlow(rank) {
  if (rank === 1) return { border: "#ffd700", bg: "rgba(255,215,0,0.04)", bar: "#ffd700" };
  if (rank === 2) return { border: "#c0c8d8", bg: "rgba(192,200,216,0.035)", bar: "#c0c8d8" };
  if (rank === 3) return { border: "#cd7f32", bg: "rgba(205,127,50,0.04)", bar: "#cd7f32" };
  if (rank <= 5) return { border: "#00aaff", bg: "rgba(0,170,255,0.025)", bar: "#00aaff" };
  if (rank <= 10) return { border: "rgba(0,255,160,0.4)", bg: "transparent", bar: "#00ffa0" };
  return { border: "transparent", bg: "transparent", bar: "#00ffa0" };
}

export function LightningBorder({ active, color = "#00ccff" }) {
  const [segs, setSegs] = useState([]);

  useEffect(() => {
    if (!active) { setSegs([]); return; }
    const iv = setInterval(() => {
      const pts = [];
      [[0, 1, 0], [1, 0, 1], [1, -1, 0], [0, 0, -1]].forEach((_, s) => {
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
      <path d={d} fill="none" stroke={color} strokeWidth="0.9" strokeOpacity="0.85" filter="url(#lg)" />
    </svg>
  );
}

export function Glitch({ children, style }) {
  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      {children}
      <span aria-hidden style={{ position: "absolute", inset: 0, clipPath: "polygon(0 20%,100% 20%,100% 45%,0 45%)", color: "#00ffcc", animation: "g1 4.5s infinite", left: 3 }}>{children}</span>
      <span aria-hidden style={{ position: "absolute", inset: 0, clipPath: "polygon(0 60%,100% 60%,100% 80%,0 80%)", color: "#ff0088", animation: "g2 4.5s infinite", left: -3 }}>{children}</span>
    </span>
  );
}

export function computeGameData(sorted) {
  const LS_PREV = "lb_prev_v3";
  const lsGet = k => { try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch { return {}; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  const prev = lsGet(LS_PREV);
  const deltas = {};
  const badges = {};
  let topDelta = 0;
  let topClimber = null;

  sorted.forEach(s => {
    const prevRank = prev[s.roll];
    const delta = prevRank != null ? prevRank - s.rank : 0;
    deltas[s.roll] = { delta, hadPrev: prevRank != null };
    if (delta > topDelta) { topDelta = delta; topClimber = s.roll; }
  });

  sorted.forEach(s => {
    const b = [];
    const d = deltas[s.roll];
    if (s.rank <= 3) b.push({ icon: "👑", label: "TOP 3" });
    if (d.hadPrev && d.delta > 0) b.push({ icon: "🔥", label: "RISING" });
    if (s.roll === topClimber && topDelta > 0) b.push({ icon: "⚡", label: "CLIMBER" });
    if (!d.hadPrev) b.push({ icon: "🆕", label: "ROOKIE" });
    badges[s.roll] = b;
  });

  const newPrev = {};
  sorted.forEach(s => { newPrev[s.roll] = s.rank; });
  lsSet(LS_PREV, newPrev);

  return { deltas, badges };
}
