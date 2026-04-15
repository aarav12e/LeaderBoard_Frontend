import { useEffect, useRef } from "react";

export function SpaceCanvas() {
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

export function MatrixRain() {
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
        ctx.fillStyle = "rgba(0,180,100,0.08)";
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

export function CursorTrail() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -999, y: -999 });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const COLORS = ["#00ffcc", "#00aaff", "#00ffaa", "#7700ff", "#00ddff"];
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < 3; i++) {
        const spread = (Math.random() - 0.5) * 16;
        particles.current.push({
          x: mouse.current.x + spread, y: mouse.current.y + spread,
          vx: (Math.random() - 0.5) * 2, vy: -(Math.random() * 2.8 + 0.8),
          life: 1, decay: Math.random() * 0.045 + 0.03,
          r: Math.random() * 5 + 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= p.decay; p.r *= 0.97;
        if (p.life <= 0) { particles.current.splice(i, 1); continue; }
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, p.color + "ff");
        grad.addColorStop(0.4, p.color + "aa");
        grad.addColorStop(1, p.color + "00");
        ctx.globalAlpha = p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.fill();
      }
      ctx.globalAlpha = 1;
      const { x, y } = mouse.current;
      if (x > 0) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
        g.addColorStop(0, "#fff"); g.addColorStop(0.5, "#00ffcccc"); g.addColorStop(1, "#00ffcc00");
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }
      raf.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none" }} />;
}
