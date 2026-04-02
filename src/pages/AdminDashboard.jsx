import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

/* ─────────────────────────────────────────────────────────────
   Shared theme tokens (mirrors UserLeaderBoard.jsx)
───────────────────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');`;

/* ── Animated Counter (same as leaderboard) ─────────────────── */
function Counter({ value, visible, duration = 1200 }) {
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
  return <>{n.toLocaleString()}</>;
}

/* ── Particle Canvas (identical to leaderboard) ──────────── */
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

        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener("resize", resize);

        const colors = ["#ef4444", "#F97316", "#dc2626", "#fb923c", "#fca5a5"];
        for (let i = 0; i < 60; i++) {
            particles.current.push({
                x: Math.random() * W, y: Math.random() * H,
                r: Math.random() * 1.8 + 0.3,
                vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.5 + 0.1, pulse: Math.random() * Math.PI * 2,
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            particles.current.forEach(p => {
                p.pulse += 0.018; p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.floor(a * 255).toString(16).padStart(2, "0");
                ctx.fill();
            });
            for (let i = 0; i < particles.current.length; i++) {
                for (let j = i + 1; j < particles.current.length; j++) {
                    const a = particles.current[i], b = particles.current[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 90) {
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(239,68,68,${(1 - dist / 90) * 0.07})`;
                        ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            }
            raf.current = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); };
    }, []);

    return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7 }} />;
}

/* ─────────────────────────────────────────────────────────────
   Admin credentials
───────────────────────────────────────────────────────────── */
const ADMINS = [
    { username: "aarav12ee", password: "waterbottle" },
    { username: "kajal", password: "kajal12kajal" },
    { username: "Ishant_raj_2006", password: "Ishant@845437" },
];

/* ─────────────────────────────────────────────────────────────
   Admin Login Page – matching leaderboard theme
───────────────────────────────────────────────────────────── */
function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [shake, setShake] = useState(false);
    const [focusing, setFocusing] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        if (ADMINS.some(a => a.username === username && a.password === password)) {
            sessionStorage.setItem("adminAuth", "true");
            onLogin();
        } else {
            setShake(true);
            toast.error("Invalid credentials — access denied!", {
                style: { background: "#1a0000", border: "1px solid #ef444455", color: "#fca5a5" },
                iconTheme: { primary: "#ef4444", secondary: "#1a0000" },
            });
            setTimeout(() => setShake(false), 600);
        }
    };

    return (
        <>
            <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-login-page {
          min-height: 100vh;
          background: #060606;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', sans-serif;
          position: relative; overflow: hidden;
        }

        /* animated gradient bg */
        .adm-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 55% at 10% 5%, rgba(185,28,28,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 90% 95%, rgba(194,65,12,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 50% 40%, rgba(239,68,68,0.06) 0%, transparent 70%);
          animation: bgShift 12s ease-in-out infinite alternate;
        }
        @keyframes bgShift { 0% { opacity:0.8; transform:scale(1); } 100% { opacity:1; transform:scale(1.04); } }

        .adm-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridMove 20s linear infinite;
        }
        @keyframes gridMove { 0% { background-position:0 0; } 100% { background-position:48px 48px; } }

        .adm-scanlines {
          position: fixed; inset: 0; pointer-events: none; z-index: 2;
          opacity: 0.03;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px);
        }

        /* scan line sweep */
        .adm-sweep {
          position: fixed; left: 0; right: 0; height: 2px; z-index: 3;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.5) 20%, rgba(249,115,22,0.7) 50%, rgba(239,68,68,0.5) 80%, transparent);
          animation: sweep 3.5s linear infinite; pointer-events: none;
        }
        @keyframes sweep { from { top: -2px; } to { top: 100%; } }

        /* card */
        .adm-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 440px;
          margin: 24px;
          background: rgba(8,0,0,0.75);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 20px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 60px rgba(220,38,38,0.08), 0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04);
          animation: fadeUp 0.65s cubic-bezier(0.34,1.2,0.64,1) both;
        }
        .adm-card.shake { animation: shake 0.5s ease; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20% { transform:translateX(-10px); } 40% { transform:translateX(10px); }
          60% { transform:translateX(-8px); }  80% { transform:translateX(8px); }
        }

        /* shimmer top edge */
        .adm-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.6), rgba(249,115,22,0.5), transparent);
        }

        /* icon ring */
        .adm-icon-ring {
          display: inline-flex; align-items: center; justify-content: center;
          width: 72px; height: 72px; border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(239,68,68,0.3), rgba(220,38,38,0.1));
          border: 2px solid rgba(239,68,68,0.4);
          font-size: 32px; margin-bottom: 16px;
          box-shadow: 0 0 32px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: ringPulse 3s ease-in-out infinite;
        }
        @keyframes ringPulse {
          0%,100% { box-shadow: 0 0 32px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.06); }
          50% { box-shadow: 0 0 52px rgba(239,68,68,0.5), inset 0 1px 0 rgba(255,255,255,0.06); }
        }

        /* inputs */
        .adm-label {
          display: block; font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 0.2em; color: rgba(239,68,68,0.6);
          margin-bottom: 6px;
        }
        .adm-input {
          width: 100%; padding: 12px 16px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 10px; color: #f0f0f0;
          font-size: 15px; font-family: 'Rajdhani', sans-serif; font-weight: 500;
          outline: none; transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .adm-input::placeholder { color: rgba(240,240,240,0.18); }
        .adm-input:focus {
          border-color: rgba(239,68,68,0.6);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 0 0 3px rgba(239,68,68,0.1), 0 0 20px rgba(239,68,68,0.1);
        }

        /* submit btn */
        .adm-submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #dc2626 0%, #F97316 100%);
          border: none; border-radius: 10px; color: #fff;
          font-family: 'Orbitron', monospace; font-size: 14px; font-weight: 700;
          letter-spacing: 0.12em; cursor: pointer;
          box-shadow: 0 0 30px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
          animation: btnPulse 2.5s ease-in-out infinite;
        }
        @keyframes btnPulse {
          0%,100% { box-shadow: 0 0 30px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.15); }
          50% { box-shadow: 0 0 55px rgba(239,68,68,0.7), inset 0 1px 0 rgba(255,255,255,0.15); }
        }
        .adm-submit-btn:hover { transform: translateY(-3px) scale(1.02); animation: none; box-shadow: 0 0 70px rgba(239,68,68,0.8); }
        .adm-submit-btn:active { transform: scale(0.97); }

        .adm-divider {
          height: 1px; margin: 24px 0;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.4), rgba(249,115,22,0.3), transparent);
        }
      `}</style>

            <div className="adm-login-page">
                <ParticleCanvas />
                <div className="adm-bg" />
                <div className="adm-grid" />
                <div className="adm-scanlines" />
                <div className="adm-sweep" />

                <div className={`adm-card${shake ? " shake" : ""}`}>
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div className="adm-icon-ring">🔐</div>
                        <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: "0.3em", color: "rgba(239,68,68,0.5)", marginBottom: 10 }}>
                            ▶ ADMIN ACCESS TERMINAL
                        </p>
                        <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(20px,4vw,28px)", color: "#f0f0f0", lineHeight: 1.1 }}>
                            IGNITE<span style={{ color: "#ef4444" }}> CLUB</span>
                        </h1>
                        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "#F97316", fontSize: 12, letterSpacing: "0.12em", marginTop: 6 }}>
                            BUGBYTE — ADMIN DASHBOARD
                        </p>
                        <div className="adm-divider" />
                    </div>

                    <form onSubmit={handleLogin}>
                        {/* Username */}
                        <div style={{ marginBottom: 18 }}>
                            <label className="adm-label">USERNAME</label>
                            <input
                                type="text"
                                className="adm-input"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="Enter username"
                                autoComplete="username"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 28 }}>
                            <label className="adm-label">PASSWORD</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="adm-input"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    autoComplete="current-password"
                                    required
                                    style={{ paddingRight: 48 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                        background: "none", border: "none", cursor: "pointer",
                                        fontSize: 18, color: "rgba(239,68,68,0.5)", lineHeight: 1,
                                    }}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="adm-submit-btn">
                            ⚡ AUTHENTICATE
                        </button>
                    </form>

                    {/* Footer tag */}
                    <p style={{ textAlign: "center", marginTop: 24, fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(239,68,68,0.3)", letterSpacing: "0.18em" }}>
                        VISHVESHWARYA GROUP OF INSTITUTION
                    </p>
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────────────────────
   Admin Dashboard Main Page – matching leaderboard theme
───────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => sessionStorage.getItem("adminAuth") === "true"
    );
    const [form, setForm] = useState({});
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pointsUpdate, setPointsUpdate] = useState({});
    const [linksUpdate, setLinksUpdate] = useState({});
    const [expandedLinks, setExpandedLinks] = useState({});
    const [flashRow, setFlashRow] = useState({}); // { [id]: 'success' | 'error' }

    const fetchStudents = async () => {
        try {
            const res = await api.get("/students");
            setStudents(res.data);
        } catch {
            toast.error("Failed to fetch students");
        }
    };

    useEffect(() => { if (isAuthenticated) fetchStudents(); }, [isAuthenticated]);

    const submit = async () => {
        if (!form.roll || !form.name) return toast.error("Roll and Name are required!");
        try {
            await api.post("/students", form);
            toast.success("Student Added Successfully!");
            setForm({});
            fetchStudents();
        } catch { toast.error("Error adding student"); }
    };

    const updatePoints = async (id) => {
        const change = pointsUpdate[id];
        if (!change) return;
        try {
            await api.put(`/students/${id}`, { points: Number(change) });
            toast.success("Points Updated!");
            setPointsUpdate({ ...pointsUpdate, [id]: undefined });
            setFlashRow(prev => ({ ...prev, [id]: "success" }));
            setTimeout(() => setFlashRow(prev => ({ ...prev, [id]: null })), 1200);
            fetchStudents();
        } catch {
            toast.error("Error updating points");
            setFlashRow(prev => ({ ...prev, [id]: "error" }));
            setTimeout(() => setFlashRow(prev => ({ ...prev, [id]: null })), 1200);
        }
    };

    const toggleLinkEdit = (id, student) => {
        setExpandedLinks(prev => {
            if (!prev[id]) {
                setLinksUpdate(prev2 => ({ ...prev2, [id]: { github: student.github || "", linkedin: student.linkedin || "" } }));
            }
            return { ...prev, [id]: !prev[id] };
        });
    };

    const updateLinks = async (id) => {
        const links = linksUpdate[id];
        if (!links) return;
        try {
            await api.put(`/students/${id}`, { github: links.github, linkedin: links.linkedin });
            toast.success("Links Updated!");
            setExpandedLinks(prev => ({ ...prev, [id]: false }));
            fetchStudents();
        } catch { toast.error("Error updating links"); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        try {
            await api.delete(`/students/${id}`);
            toast.success("Student Deleted");
            fetchStudents();
        } catch { toast.error("Error deleting student"); }
    };

    const seedData = async () => {
        const data = [];
        if (!confirm("This will add all the sample data provided. Continue?")) return;
        try {
            setLoading(true);
            const loadingToast = toast.loading("Importing data...");
            for (let s of data) {
                await api.post("/students", { roll: s.Roll, name: s.name, points: s.points, linkedin: s.linkedin, github: s.github });
            }
            toast.success("All data imported!", { id: loadingToast });
            fetchStudents();
        } catch (e) {
            toast.error("Error importing data: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("adminAuth");
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;

    /* ── Shared input style ─── */
    const inputSx = {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 10,
        color: "#f0f0f0",
        padding: "10px 14px",
        fontSize: 14,
        fontFamily: "'Rajdhani',sans-serif",
        fontWeight: 500,
        outline: "none",
        width: "100%",
        transition: "border-color 0.25s, box-shadow 0.25s",
    };

    const focusSx = (e) => {
        e.target.style.borderColor = "rgba(239,68,68,0.6)";
        e.target.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.1)";
    };
    const blurSx = (e) => {
        e.target.style.borderColor = "rgba(239,68,68,0.2)";
        e.target.style.boxShadow = "none";
    };

    /* ── Sorted by rank ─── */
    const sorted = [...students].sort((a, b) => a.rank - b.rank);

    return (
        <>
            <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-page {
          font-family: 'Rajdhani', sans-serif;
          background: #060606;
          min-height: 100vh;
          color: #f0f0f0;
          position: relative; overflow-x: hidden;
        }

        .adm-bg2 {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 80% 55% at 10% 5%, rgba(185,28,28,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 60% 45% at 90% 95%, rgba(194,65,12,0.18) 0%, transparent 60%);
          animation: bgShift2 12s ease-in-out infinite alternate;
        }
        @keyframes bgShift2 { 0% { opacity:0.8; transform:scale(1); } 100% { opacity:1; transform:scale(1.04); } }

        .adm-grid2 {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(239,68,68,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: gridMove2 20s linear infinite;
        }
        @keyframes gridMove2 { 0% { background-position:0 0; } 100% { background-position:48px 48px; } }

        .adm-scanlines2 {
          position: fixed; inset: 0; pointer-events: none; z-index: 2;
          opacity: 0.03;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px);
        }

        .adm-inner { position: relative; z-index: 3; max-width: 1060px; margin: 0 auto; padding: clamp(16px,4vw,48px) clamp(12px,3vw,36px) 60px; }

        /* topbar */
        .adm-topbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 36px; flex-wrap: wrap; gap: 12px;
        }

        /* section card */
        .adm-section {
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(239,68,68,0.12);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(220,38,38,0.05), inset 0 1px 0 rgba(255,255,255,0.04);
          backdrop-filter: blur(12px);
          margin-bottom: 28px;
          position: relative;
        }
        .adm-section::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.4), rgba(249,115,22,0.3), transparent);
        }
        .adm-section-body { padding: clamp(18px,3vw,28px); }

        .adm-section-title {
          font-family: 'Orbitron', monospace; font-size: 11px;
          letter-spacing: 0.22em; color: rgba(239,68,68,0.6);
          margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
        }
        .adm-section-title::after {
          content:''; flex:1; height:1px;
          background: linear-gradient(90deg, rgba(239,68,68,0.2), transparent);
        }

        /* form grid */
        .adm-form-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
        }
        @media(max-width:600px) { .adm-form-grid { grid-template-columns:1fr; } }
        .adm-full { grid-column: 1 / -1; }

        /* action btns */
        .adm-btn {
          font-family: 'Orbitron', monospace; font-weight: 700;
          letter-spacing: 0.1em; font-size: 11px;
          padding: 10px 24px; border-radius: 10px; border: none;
          cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
        }
        .adm-btn-primary {
          background: linear-gradient(135deg,#dc2626,#F97316);
          color: #fff;
          box-shadow: 0 0 24px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .adm-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(239,68,68,0.6); }
        .adm-btn-secondary {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.25);
          color: rgba(239,68,68,0.7);
        }
        .adm-btn-secondary:hover { background: rgba(239,68,68,0.15); color: #ef4444; transform: translateY(-2px); }
        .adm-btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .adm-btn-sm { padding: 6px 14px; font-size: 10px; border-radius: 8px; }
        .adm-btn-logout {
          background: rgba(239,68,68,0.06);
          border: 1px solid rgba(239,68,68,0.3);
          color: rgba(239,68,68,0.65);
          padding: 8px 20px; border-radius: 10px;
          font-family: 'Share Tech Mono',monospace; font-size: 12px;
          letter-spacing: 0.1em; cursor: pointer;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .adm-btn-logout:hover { background: rgba(239,68,68,0.15); color: #ef4444; box-shadow: 0 0 18px rgba(239,68,68,0.25); }

        .adm-btn-icon {
          width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center;
          border-radius: 8px; border: none; cursor: pointer; font-size: 16px;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .adm-btn-save { background: rgba(249,115,22,0.12); border: 1px solid rgba(249,115,22,0.3); }
        .adm-btn-save:hover { background: rgba(249,115,22,0.22); box-shadow: 0 0 14px rgba(249,115,22,0.3); transform: translateY(-1px); }
        .adm-btn-del  { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.3); }
        .adm-btn-del:hover  { background: rgba(239,68,68,0.22); box-shadow: 0 0 14px rgba(239,68,68,0.3); transform: translateY(-1px); }
        .adm-btn-link { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: rgba(240,240,240,0.5); font-size: 11px; font-family:'Rajdhani',sans-serif; padding: 4px 10px; border-radius:7px; cursor:pointer; transition: all 0.2s; }
        .adm-btn-link:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color:#ef4444; }

        /* table */
        .adm-table-wrap {
          overflow-x: auto; max-height: 420px; overflow-y: auto;
        }
        .adm-table-wrap::-webkit-scrollbar { width: 4px; height: 4px; }
        .adm-table-wrap::-webkit-scrollbar-track { background: #060606; }
        .adm-table-wrap::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.25); border-radius: 99px; }

        .adm-table { width: 100%; border-collapse: separate; border-spacing: 0 4px; }
        .adm-table thead th {
          font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 0.18em;
          color: rgba(239,68,68,0.5); padding: 10px 14px; text-align: left;
          border-bottom: 1px solid rgba(239,68,68,0.08);
          position: sticky; top:0; background: rgba(6,0,0,0.95); z-index:2;
          backdrop-filter: blur(12px);
        }
        .adm-table tbody td {
          padding: 13px 14px; font-size: 14px; font-weight:500; vertical-align: middle;
          background: rgba(255,255,255,0.012);
          transition: background 0.2s;
        }
        .adm-table tbody td:first-child { border-radius: 10px 0 0 10px; }
        .adm-table tbody td:last-child  { border-radius: 0 10px 10px 0; }
        .adm-table tbody tr:hover td { background: rgba(239,68,68,0.05) !important; }

        .adm-badge {
          display: inline-block; padding: 4px 12px; border-radius: 99px;
          background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.28);
          color: #F97316; font-family: 'Share Tech Mono', monospace; font-weight: 700; font-size: 12px;
        }
        .adm-roll { font-family: 'Share Tech Mono',monospace; color: #F97316; font-size: 12px; }
        .adm-name { font-weight: 700; font-family: 'Rajdhani',sans-serif; font-size: 15px; }

        .adm-pts-input {
          width: 80px; text-align: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(239,68,68,0.2); border-radius:8px;
          color:#f0f0f0; padding:6px 8px; font-size:13px;
          font-family:'Share Tech Mono',monospace; outline:none;
        }
        .adm-pts-input:focus { border-color: rgba(239,68,68,0.6); box-shadow: 0 0 0 2px rgba(239,68,68,0.1); }

        /* link expand row */
        .adm-link-row td { background: rgba(239,68,68,0.04) !important; border-top: 1px solid rgba(239,68,68,0.08) !important; border-radius: 0 !important; }
        .adm-link-row-inner { display:flex; flex-wrap:wrap; gap:10px; align-items:center; padding: 4px 0; }

        /* live badge */
        .adm-live { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:99px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.35); font-family:'Share Tech Mono',monospace; font-size:11px; color:#ef4444; letter-spacing:0.12em; }
        .adm-live-dot { width:7px; height:7px; border-radius:50%; background:#ef4444; animation:livePulse2 1.2s ease-in-out infinite; box-shadow:0 0 6px #ef4444; }
        @keyframes livePulse2 { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.5);opacity:0.6;} }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060606; }
        ::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.25); border-radius:99px; }
      `}</style>

            <div className="adm-page">
                <ParticleCanvas />
                <div className="adm-bg2" />
                <div className="adm-grid2" />
                <div className="adm-scanlines2" />

                <div className="adm-inner">
                    {/* Top bar */}
                    <div className="adm-topbar">
                        <div>
                            <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, letterSpacing: "0.25em", color: "rgba(239,68,68,0.45)", marginBottom: 6 }}>
                                ▶ IGNITE CLUB — BUGBYTE
                            </p>
                            <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(20px,4vw,32px)", color: "#f0f0f0", lineHeight: 1 }}>
                                ADMIN <span style={{ color: "#ef4444" }}>DASHBOARD</span>
                            </h1>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <span className="adm-live"><span className="adm-live-dot" />LIVE</span>
                            <button className="adm-btn-logout" onClick={handleLogout}>🚪 LOGOUT</button>
                        </div>
                    </div>

                    {/* Stats strip */}
                    <div style={{
                        display: "flex", gap: "clamp(20px,3vw,48px)", justifyContent: "center",
                        padding: "18px 24px", borderRadius: 16, marginBottom: 28,
                        background: "rgba(255,255,255,0.015)", border: "1px solid rgba(239,68,68,0.1)",
                        backdropFilter: "blur(10px)", flexWrap: "wrap",
                    }}>
                        {[
                            { label: "TOTAL STUDENTS", val: students.length },
                            { label: "TOTAL POINTS", val: students.reduce((s, d) => s + (d.points || 0), 0) },
                            { label: "TOP SCORE", val: sorted[0]?.points ?? 0 },
                        ].map(({ label, val }) => (
                            <div key={label} style={{ textAlign: "center" }}>
                                <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(18px,3vw,26px)", color: "#ef4444", textShadow: "0 0 20px #ef444455" }}>
                                    <Counter value={val} visible={true} />
                                </div>
                                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(240,240,240,0.3)", letterSpacing: "0.16em", marginTop: 2 }}>{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Add Student form */}
                    <div className="adm-section">
                        <div className="adm-section-body">
                            <div className="adm-section-title">✦ ADD NEW STUDENT</div>
                            <div className="adm-form-grid">
                                {[
                                    { ph: "Roll Number", key: "roll", type: "text" },
                                    { ph: "Student Name", key: "name", type: "text" },
                                    { ph: "Points", key: "points", type: "number" },
                                    { ph: "LinkedIn URL", key: "linkedin", type: "text" },
                                ].map(({ ph, key, type }) => (
                                    <input key={key} type={type} style={inputSx} placeholder={ph}
                                        value={form[key] || ""} onFocus={focusSx} onBlur={blurSx}
                                        onChange={e => setForm({ ...form, [key]: type === "number" ? +e.target.value : e.target.value })}
                                    />
                                ))}
                                <input type="text" style={inputSx} placeholder="GitHub URL" className="adm-full"
                                    value={form.github || ""} onFocus={focusSx} onBlur={blurSx}
                                    onChange={e => setForm({ ...form, github: e.target.value })}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
                                <button className="adm-btn adm-btn-primary" onClick={submit}>
                                    + ADD STUDENT
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Student table */}
                    <div className="adm-section">
                        <div className="adm-section-body">
                            <div className="adm-section-title">✦ MANAGE STUDENTS ({students.length})</div>
                            <div className="adm-table-wrap">
                                <table className="adm-table">
                                    <thead>
                                        <tr>
                                            <th>NAME / ROLL</th>
                                            <th>RANK</th>
                                            <th>CURRENT PTS</th>
                                            <th>NEW PTS</th>
                                            <th>LINKS</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sorted.map(s => (
                                            <>
                                                <tr key={s._id} style={{
                                                    transition: "background 0.4s",
                                                    background: flashRow[s._id] === "success"
                                                        ? "rgba(0,220,100,0.12)"
                                                        : flashRow[s._id] === "error"
                                                        ? "rgba(239,68,68,0.14)"
                                                        : undefined,
                                                    boxShadow: flashRow[s._id] === "success"
                                                        ? "inset 0 0 20px rgba(0,220,100,0.15)"
                                                        : flashRow[s._id] === "error"
                                                        ? "inset 0 0 20px rgba(239,68,68,0.15)"
                                                        : undefined,
                                                }}>
                                                    <td>
                                                        <div className="adm-name">{s.name}</div>
                                                        <div className="adm-roll">{s.roll}</div>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(240,240,240,0.4)", fontSize: 13 }}>
                                                            #{s.rank}
                                                        </span>
                                                    </td>
                                                    <td><span className="adm-badge">{s.points}</span></td>
                                                    <td>
                                                        <input
                                                            type="number" placeholder="New" className="adm-pts-input"
                                                            value={pointsUpdate[s._id] !== undefined ? pointsUpdate[s._id] : ""}
                                                            onChange={e => setPointsUpdate({ ...pointsUpdate, [s._id]: e.target.value })}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                                            {s.github
                                                                ? <a href={s.github} target="_blank" rel="noreferrer" title={s.github} style={{ fontSize: 18 }}>🐙</a>
                                                                : <span style={{ opacity: 0.25, fontSize: 12, fontFamily: "'Share Tech Mono',monospace" }}>—</span>}
                                                            {s.linkedin
                                                                ? <a href={s.linkedin} target="_blank" rel="noreferrer" title={s.linkedin} style={{ fontSize: 18 }}>💼</a>
                                                                : <span style={{ opacity: 0.25, fontSize: 12, fontFamily: "'Share Tech Mono',monospace" }}>—</span>}
                                                            <button className="adm-btn-link" onClick={() => toggleLinkEdit(s._id, s)}>
                                                                {expandedLinks[s._id] ? "✕ Close" : "✏️ Edit"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: "flex", gap: 6 }}>
                                                            <button className="adm-btn-icon adm-btn-save" onClick={() => updatePoints(s._id)} title="Save Points">💾</button>
                                                            <button className="adm-btn-icon adm-btn-del" onClick={() => handleDelete(s._id)} title="Delete">🗑️</button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {expandedLinks[s._id] && (
                                                    <tr key={`${s._id}-links`} className="adm-link-row">
                                                        <td colSpan={6}>
                                                            <div className="adm-link-row-inner">
                                                                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "rgba(239,68,68,0.6)", letterSpacing: "0.1em" }}>🐙 GITHUB:</span>
                                                                <input style={{ ...inputSx, flex: 1, minWidth: 180, padding: "7px 12px" }}
                                                                    placeholder="https://github.com/username"
                                                                    value={linksUpdate[s._id]?.github || ""}
                                                                    onFocus={focusSx} onBlur={blurSx}
                                                                    onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], github: e.target.value } }))}
                                                                />
                                                                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "rgba(239,68,68,0.6)", letterSpacing: "0.1em" }}>💼 LINKEDIN:</span>
                                                                <input style={{ ...inputSx, flex: 1, minWidth: 180, padding: "7px 12px" }}
                                                                    placeholder="https://linkedin.com/in/username"
                                                                    value={linksUpdate[s._id]?.linkedin || ""}
                                                                    onFocus={focusSx} onBlur={blurSx}
                                                                    onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], linkedin: e.target.value } }))}
                                                                />
                                                                <button className="adm-btn adm-btn-sm adm-btn-primary" onClick={() => updateLinks(s._id)}>💾 SAVE LINKS</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                                {students.length === 0 && (
                                    <p style={{ textAlign: "center", fontFamily: "'Share Tech Mono',monospace", color: "rgba(240,240,240,0.18)", letterSpacing: "0.16em", padding: "48px 0" }}>
                                        NO STUDENTS FOUND
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer style={{ textAlign: "center", paddingTop: 32, borderTop: "1px solid rgba(239,68,68,0.07)" }}>
                        <p style={{ fontFamily: "'Orbitron',monospace", color: "rgba(239,68,68,0.4)", fontSize: 11, letterSpacing: "0.24em" }}>IGNITE CLUB — BUGBYTE</p>
                        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(255,255,255,0.12)", fontSize: 11, marginTop: 8 }}>© 2026 BUGBYTE — ALL RIGHTS RESERVED</p>
                    </footer>
                </div>
            </div>
        </>
    );
}