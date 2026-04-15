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

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      tw: Math.random() * Math.PI * 2,
      spd: Math.random() * 0.00012 + 0.00004,
    }));

    const nebulae = [
      { x: 0.15, y: 0.2, r: 0.32, h: 185 },
      { x: 0.85, y: 0.8, r: 0.28, h: 210 },
    ];

    let t = 0;
    const draw = () => {
      t += 0.003;
      ctx.fillStyle = "#000308";
      ctx.fillRect(0, 0, W, H);
      nebulae.forEach(n => {
        const a = 0.028 + 0.01 * Math.sin(t * 0.4 + n.h * 0.05);
        const g = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, n.r * Math.min(W, H));
        g.addColorStop(0, `hsla(${n.h},100%,60%,${a})`);
        g.addColorStop(0.5, `hsla(${n.h},100%,60%,${a * 0.2})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      stars.forEach(s => {
        s.z -= s.spd;
        s.tw += 0.02;
        if (s.z <= 0) {
          s.z = 1;
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
        }
        const px = (s.x / s.z) * W * 0.5 + W / 2;
        const py = (s.y / s.z) * H * 0.5 + H / 2;
        if (px < 0 || px > W || py < 0 || py > H) return;
        const sz = s.r * (1 - s.z) * 2.5;
        const a = (1 - s.z) * (0.6 + 0.35 * Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,235,255,${a})`;
        ctx.fill();
      });

      raf.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
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
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    const cols = Math.floor(W / 22);
    const drops = Array(cols).fill(0).map(() => Math.random() * -(H / 16));
    const chars = "アイウエオカキサシス01ΨΩΛΞΔаб∑∂∫⌘⊗∞◈⬡".split("");

    const draw = () => {
      ctx.fillStyle = "rgba(0,3,8,0.16)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = "13px 'Share Tech Mono', monospace";
      drops.forEach((y, i) => {
        ctx.fillStyle = `rgba(0,255,160,${0.55 + Math.random() * 0.2})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 22, y * 16);
        if (y * 16 > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.35 + Math.random() * 0.25;
      });
      raf.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.08 }} />;
}
