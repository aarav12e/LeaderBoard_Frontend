import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import toast from "react-hot-toast";
import SeniorAdminLogin from "../components/SeniorAdminLogin";
import { SeniorSpaceCanvas, SeniorMatrixRain } from "../components/SeniorLeaderboardEffects";
import { Counter } from "../components/SeniorLeaderboardHelpers";
import { SaveIcon, TrashIcon, EditIcon, CloseIcon, GithubIcon, LinkedinIcon, LogoutIcon, LeaderboardIcon } from "../components/Icons";

export default function SeniorAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("seniorAdminAuth") === "true"
  );
  const [form, setForm] = useState({ year: "1" });
  const [students, setStudents] = useState([]);
  const [pointsUpdate, setPointsUpdate] = useState({});
  const [linksUpdate, setLinksUpdate] = useState({});
  const [expandedLinks, setExpandedLinks] = useState({});
  const [flashRow, setFlashRow] = useState({});
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await api.get("/senior-students");
      setStudents(res.data);
    } catch {
      toast.error("Failed to fetch senior students");
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchStudents();
  }, [isAuthenticated]);

  const submit = async () => {
    if (!form.roll?.trim() || !form.name?.trim()) {
      return toast.error("Roll Number and Name are required!");
    }
    const yearNum = Number(form.year);
    if (![1, 2, 3, 4].includes(yearNum)) {
      return toast.error("Please select a Year (1st, 2nd, 3rd, or 4th)!");
    }
    try {
      const payload = {
        roll: form.roll.trim(),
        name: form.name.trim(),
        year: yearNum,
        points: form.points !== undefined && form.points !== "" ? Number(form.points) : 0,
        linkedin: form.linkedin?.trim() || "",
        github: form.github?.trim() || "",
      };
      await api.post("/senior-students", payload);
      toast.success("Senior Operative Added!", {
        style: { background: "#080003", border: "1px solid rgba(255,60,0,0.3)", color: "#ff6644", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
      setForm({ year: "1" });
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding student");
    }
  };

  const updatePoints = async (id) => {
    const change = pointsUpdate[id];
    if (change === undefined || change === "") return;
    try {
      await api.put(`/senior-students/${id}`, { points: Number(change) });
      toast.success("Points Updated!", {
        style: { background: "#080003", border: "1px solid rgba(255,60,0,0.3)", color: "#ff6644", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
      setPointsUpdate(prev => ({ ...prev, [id]: undefined }));
      setFlashRow(prev => ({ ...prev, [id]: "success" }));
      setTimeout(() => setFlashRow(prev => ({ ...prev, [id]: null })), 1200);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating points");
      setFlashRow(prev => ({ ...prev, [id]: "error" }));
      setTimeout(() => setFlashRow(prev => ({ ...prev, [id]: null })), 1200);
    }
  };

  const toggleLinkEdit = (id, student) => {
    setExpandedLinks(prev => {
      if (!prev[id]) {
        setLinksUpdate(prev2 => ({
          ...prev2,
          [id]: {
            github: student.github || "",
            linkedin: student.linkedin || "",
            year: student.year ? String(student.year) : "1",
          },
        }));
      }
      return { ...prev, [id]: !prev[id] };
    });
  };

  const updateLinks = async (id) => {
    const current = linksUpdate[id];
    if (!current) return;
    try {
      const payload = {
        github: current.github || "",
        linkedin: current.linkedin || "",
        year: Number(current.year) || 1,
      };
      await api.put(`/senior-students/${id}`, payload);
      toast.success("Operative Details Updated!", {
        style: { background: "#080003", border: "1px solid rgba(255,60,0,0.3)", color: "#ff6644", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
      setExpandedLinks(prev => ({ ...prev, [id]: false }));
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating operative");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this senior operative? This cannot be undone.")) return;
    try {
      await api.delete(`/senior-students/${id}`);
      toast.success("Operative Removed", {
        style: { background: "#080003", border: "1px solid rgba(255,60,0,0.3)", color: "#ff6644", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting operative");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("seniorAdminAuth");
    sessionStorage.removeItem("seniorAdminToken");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <SeniorAdminLogin onLogin={() => setIsAuthenticated(true)} />;

  const sorted = [...students].sort((a, b) => a.rank - b.rank);
  const filtered = sorted.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.roll.toLowerCase().includes(search.toLowerCase())
  );
  const totalPts = students.reduce((s, d) => s + (d.points || 0), 0);

  const rankColor = (rank) => {
    if (rank === 1) return "#ffd700";
    if (rank === 2) return "#c0c8d8";
    if (rank === 3) return "#cd7f32";
    if (rank <= 5) return "#ff6644";
    return "#ff4400";
  };

  const inputSx = {
    background: "rgba(255,60,0,0.04)",
    border: "1px solid rgba(255,60,0,0.2)",
    borderRadius: 2,
    color: "#ffe8e0",
    padding: "11px 14px",
    fontSize: 13,
    fontFamily: "'Share Tech Mono',monospace",
    outline: "none",
    width: "100%",
    letterSpacing: "0.03em",
    transition: "border-color 0.25s, box-shadow 0.25s",
    clipPath: "polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)",
  };
  const focusSx = e => {
    e.target.style.borderColor = "rgba(255,80,0,0.6)";
    e.target.style.boxShadow = "0 0 0 2px rgba(255,60,0,0.12)";
  };
  const blurSx = e => {
    e.target.style.borderColor = "rgba(255,60,0,0.2)";
    e.target.style.boxShadow = "none";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#080003}

        .sr-adm{font-family:'Share Tech Mono',monospace;background:#080003;min-height:100vh;color:#ffe8e0;position:relative;overflow-x:hidden}
        .sr-adm-inner{position:relative;z-index:3;max-width:1140px;margin:0 auto;padding:clamp(16px,4vw,52px) clamp(12px,3vw,36px) 72px}

        /* Topbar */
        .sr-adm-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;flex-wrap:wrap;gap:16px;padding-bottom:24px;border-bottom:1px solid rgba(255,60,0,0.1)}
        .sr-adm-live{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:2px;background:rgba(255,60,0,0.06);border:1px solid rgba(255,60,0,0.25);font-size:9px;color:#ff6644;letter-spacing:0.22em;clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)}
        .sr-adm-live-dot{width:7px;height:7px;border-radius:50%;background:#ff4400;animation:srLivePulse 1.2s ease-in-out infinite;box-shadow:0 0 7px #ff4400}
        @keyframes srLivePulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:0.5}}

        .sr-adm-nav-btn{background:rgba(255,60,0,0.04);border:1px solid rgba(255,60,0,0.22);color:rgba(255,140,60,0.7);padding:8px 18px;border-radius:2px;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:0.12em;text-decoration:none;transition:all 0.2s;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)}
        .sr-adm-nav-btn:hover{background:rgba(255,60,0,0.12);border-color:rgba(255,60,0,0.6);color:#ff6644;box-shadow:0 0 16px rgba(255,60,0,0.25)}

        .sr-adm-logout{background:rgba(255,40,0,0.06);border:1px solid rgba(255,60,0,0.25);color:rgba(255,100,60,0.7);padding:8px 18px;border-radius:2px;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:0.12em;cursor:pointer;transition:all 0.2s;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)}
        .sr-adm-logout:hover{background:rgba(255,60,0,0.14);border-color:rgba(255,60,0,0.6);color:#ff4400;box-shadow:0 0 18px rgba(255,60,0,0.25)}

        /* Stats */
        .sr-adm-stats{display:flex;gap:clamp(20px,4vw,60px);justify-content:center;padding:22px 32px;border-radius:2px;background:rgba(18,4,2,0.76);border:1px solid rgba(255,60,0,0.12);backdrop-filter:blur(14px);margin-bottom:36px;flex-wrap:wrap;clip-path:polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)}
        .sr-adm-stat-val{font-family:'Orbitron',monospace;font-size:clamp(20px,3vw,30px);font-weight:900;color:#ff4400;text-shadow:0 0 20px #ff440055}
        .sr-adm-stat-lbl{font-size:8px;color:rgba(255,100,60,0.4);letter-spacing:0.2em;margin-top:4px}

        /* Section */
        .sr-adm-section{background:rgba(16,3,1,0.76);border:1px solid rgba(255,60,0,0.12);border-radius:2px;overflow:hidden;backdrop-filter:blur(16px);box-shadow:0 0 50px rgba(255,60,0,0.03),inset 0 1px 0 rgba(255,60,0,0.06);position:relative;margin-bottom:28px}
        .sr-adm-section::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#ff440066,#ff880044,transparent)}
        .sr-adm-section-body{padding:clamp(18px,3vw,28px)}
        .sr-adm-section-title{font-family:'Orbitron',monospace;font-size:10px;letter-spacing:0.24em;color:rgba(255,100,60,0.6);margin-bottom:22px;display:flex;align-items:center;gap:10px}
        .sr-adm-section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(255,60,0,0.25),transparent)}

        /* Form */
        .sr-adm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:640px){.sr-adm-form-grid{grid-template-columns:1fr}}
        .sr-adm-select option{background:#160502;color:#ffe8e0}

        /* Search */
        .sr-adm-search-input{width:260px;background:rgba(255,60,0,0.04);border:1px solid rgba(255,60,0,0.18);border-radius:2px;padding:9px 14px 9px 36px;color:#ffe8e0;font-size:12px;outline:none;font-family:'Share Tech Mono',monospace;letter-spacing:0.04em;transition:all 0.25s;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)}
        .sr-adm-search-input::placeholder{color:rgba(255,60,0,0.25)}
        .sr-adm-search-input:focus{border-color:rgba(255,60,0,0.5);box-shadow:0 0 0 2px rgba(255,60,0,0.1);width:320px}

        /* Table */
        .sr-adm-table-wrap{overflow-x:auto;max-height:540px;overflow-y:auto}
        .sr-adm-table-wrap::-webkit-scrollbar{width:4px;height:4px}
        .sr-adm-table-wrap::-webkit-scrollbar-track{background:#080003}
        .sr-adm-table-wrap::-webkit-scrollbar-thumb{background:rgba(255,60,0,0.2);border-radius:99px}
        .sr-adm-table{width:100%;border-collapse:separate;border-spacing:0 4px}
        .sr-adm-table thead th{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:0.2em;color:rgba(255,100,60,0.45);padding:12px 16px;text-align:left;border-bottom:1px solid rgba(255,60,0,0.09);position:sticky;top:0;background:rgba(18,4,2,0.96);z-index:2;backdrop-filter:blur(16px)}
        .sr-adm-table thead th.c{text-align:center}
        .sr-adm-table tbody td{padding:14px 16px;font-size:14px;vertical-align:middle;background:rgba(255,60,0,0.015);transition:background 0.2s}
        .sr-adm-table tbody td:first-child{border-left:3px solid transparent;transition:border-color 0.3s}
        .sr-adm-table tbody tr:hover td{background:rgba(255,60,0,0.04)!important}
        .sr-adm-table tbody tr:hover td:first-child{border-left-color:rgba(255,60,0,0.5)}

        /* Buttons */
        .sr-adm-btn{font-family:'Orbitron',monospace;font-weight:700;letter-spacing:0.1em;font-size:10px;padding:11px 24px;border-radius:2px;border:1px solid #ff4400;background:transparent;color:#ff4400;cursor:pointer;transition:all 0.3s;text-shadow:0 0 10px #ff440088;box-shadow:0 0 18px #ff440018;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);position:relative;overflow:hidden}
        .sr-adm-btn::before{content:'';position:absolute;inset:0;background:#ff4400;transform:translateX(-110%);transition:transform 0.35s ease;z-index:-1}
        .sr-adm-btn:hover{color:#080003;text-shadow:none;box-shadow:0 0 40px #ff440066}
        .sr-adm-btn:hover::before{transform:translateX(0)}

        .sr-adm-btn-icon{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px;border:none;cursor:pointer;font-size:16px;transition:transform 0.18s,box-shadow 0.18s}
        .sr-adm-btn-save{background:rgba(255,60,0,0.08);border:1px solid rgba(255,60,0,0.3)}
        .sr-adm-btn-save:hover{background:rgba(255,60,0,0.2);box-shadow:0 0 14px rgba(255,60,0,0.35);transform:translateY(-1px)}
        .sr-adm-btn-del{background:rgba(255,50,50,0.06);border:1px solid rgba(255,50,50,0.25)}
        .sr-adm-btn-del:hover{background:rgba(255,50,50,0.18);box-shadow:0 0 14px rgba(255,50,50,0.35);transform:translateY(-1px)}
        .sr-adm-btn-link-edit{background:rgba(255,140,0,0.06);border:1px solid rgba(255,140,0,0.25);color:rgba(255,140,0,0.7);font-family:'Share Tech Mono',monospace;font-size:10px;padding:5px 12px;border-radius:2px;cursor:pointer;transition:all 0.2s;letter-spacing:0.06em}
        .sr-adm-btn-link-edit:hover{background:rgba(255,140,0,0.16);border-color:rgba(255,140,0,0.6);color:#ff8800}
        .sr-adm-btn-save-links{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:0.1em;padding:8px 18px;border-radius:2px;border:1px solid #ff8800;background:transparent;color:#ff8800;cursor:pointer;transition:all 0.2s;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)}
        .sr-adm-btn-save-links:hover{background:rgba(255,140,0,0.14);box-shadow:0 0 20px rgba(255,140,0,0.3)}

        .sr-adm-pts-input{width:90px;text-align:center;background:rgba(255,60,0,0.04);border:1px solid rgba(255,60,0,0.2);border-radius:2px;color:#ff6644;padding:7px 8px;font-size:13px;font-family:'Share Tech Mono',monospace;outline:none;letter-spacing:0.03em;transition:all 0.2s}
        .sr-adm-pts-input:focus{border-color:rgba(255,60,0,0.55);box-shadow:0 0 0 2px rgba(255,60,0,0.1)}

        .sr-adm-rank{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:26px;border-radius:2px;font-family:'Share Tech Mono',monospace;font-size:11px;font-weight:700;border:1px solid rgba(255,60,0,0.15);background:rgba(255,60,0,0.04);color:rgba(255,80,0,0.55);letter-spacing:0.04em}
        .sr-adm-pts-chip{display:inline-block;padding:4px 14px;border-radius:2px;background:rgba(255,60,0,0.08);border:1px solid rgba(255,60,0,0.25);color:#ff6644;font-weight:700;font-size:13px;font-family:'Share Tech Mono',monospace;letter-spacing:0.04em}
        .sr-adm-year-badge{display:inline-block;padding:3px 10px;border-radius:2px;background:rgba(255,140,0,0.08);border:1px solid rgba(255,140,0,0.28);color:#ff9e66;font-size:10px;font-weight:700;font-family:'Share Tech Mono',monospace;letter-spacing:0.08em}

        .sr-adm-link-row td{background:rgba(255,60,0,0.025)!important;border-top:1px solid rgba(255,60,0,0.08)!important}
        .sr-adm-link-row-inner{display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:6px 0}

        .sr-adm-empty{text-align:center;padding:52px 0;color:rgba(255,60,0,0.22);font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:0.18em}

        .sr-flash-success td{background:rgba(0,220,100,0.1)!important;box-shadow:inset 0 0 20px rgba(0,220,100,0.12)}
        .sr-flash-error td{background:rgba(255,50,50,0.1)!important;box-shadow:inset 0 0 20px rgba(255,50,50,0.12)}

        .sr-adm-footer{text-align:center;padding-top:36px;border-top:1px solid rgba(255,60,0,0.08);margin-top:20px}

        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#080003}
        ::-webkit-scrollbar-thumb{background:rgba(255,60,0,0.2);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,60,0,0.4)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.7s cubic-bezier(0.34,1.2,0.64,1) both}
        .fu1{animation-delay:0.05s}.fu2{animation-delay:0.18s}.fu3{animation-delay:0.32s}.fu4{animation-delay:0.46s}
      `}</style>

      <div className="sr-adm">
        <SeniorSpaceCanvas />
        <SeniorMatrixRain />

        <div className="sr-adm-inner">

          {/* Topbar Header */}
          <div className="sr-adm-topbar fu fu1">
            <div>
              <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,60,0,0.35)", marginBottom: 8 }}>
                ∥ VISHVESHWARYA GROUP OF INSTITUTION ∥
              </p>
              <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(22px,4.5vw,36px)", color: "#ff4400", textShadow: "0 0 24px #ff440055", lineHeight: 1 }}>
                IGNITE CLUB
              </h1>
              <p style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: "#ff8844", textShadow: "0 0 14px #ff884466", letterSpacing: "0.1em", marginTop: 4 }}>
                ▸ CodeCraft — SENIOR ADMIN DASHBOARD
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span className="sr-adm-live"><span className="sr-adm-live-dot" />LIVE UPLINK</span>
              <Link to="/senior-leader-board" className="sr-adm-nav-btn" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <LeaderboardIcon size={14} /> VIEW LEADERBOARD
              </Link>
              <button className="sr-adm-logout" onClick={handleLogout} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <LogoutIcon size={14} /> LOGOUT
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="sr-adm-stats fu fu2">
            {[
              { label: "TOTAL SENIOR OPERATIVES", val: students.length },
              { label: "TOTAL XP", val: totalPts },
              { label: "TOP SCORE", val: sorted[0]?.points ?? 0 },
              { label: "LEADER", val: sorted[0]?.name?.split(" ")[0] || "—", raw: true },
            ].map(({ label, val, raw }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div className="sr-adm-stat-val">
                  {raw ? val : <Counter value={val} visible={true} />}
                </div>
                <div className="sr-adm-stat-lbl">{label}</div>
              </div>
            ))}
          </div>

          {/* Add Operative Form */}
          <div className="sr-adm-section fu fu3">
            <div className="sr-adm-section-body">
              <div className="sr-adm-section-title">✦ ADD NEW SENIOR OPERATIVE</div>
              <form onSubmit={e => { e.preventDefault(); submit(); }}>
                <div className="sr-adm-form-grid">
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,100,60,0.5)", marginBottom: 6 }}>ROLL NUMBER *</label>
                    <input
                      type="text"
                      style={inputSx}
                      placeholder="e.g. 230123"
                      value={form.roll ?? ""}
                      onFocus={focusSx}
                      onBlur={blurSx}
                      onChange={e => setForm({ ...form, roll: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,100,60,0.5)", marginBottom: 6 }}>OPERATIVE NAME *</label>
                    <input
                      type="text"
                      style={inputSx}
                      placeholder="Student full name"
                      value={form.name ?? ""}
                      onFocus={focusSx}
                      onBlur={blurSx}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,100,60,0.5)", marginBottom: 6 }}>ACADEMIC YEAR *</label>
                    <select
                      className="sr-adm-select"
                      style={{ ...inputSx }}
                      value={form.year ?? "1"}
                      onChange={e => setForm({ ...form, year: e.target.value })}
                      required
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,100,60,0.5)", marginBottom: 6 }}>POINTS (XP SCORE)</label>
                    <input
                      type="number"
                      style={inputSx}
                      placeholder="e.g. 1500"
                      value={form.points ?? ""}
                      onFocus={focusSx}
                      onBlur={blurSx}
                      onChange={e => setForm({ ...form, points: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,100,60,0.5)", marginBottom: 6 }}>LINKEDIN URL</label>
                    <input
                      type="text"
                      style={inputSx}
                      placeholder="https://linkedin.com/in/username"
                      value={form.linkedin ?? ""}
                      onFocus={focusSx}
                      onBlur={blurSx}
                      onChange={e => setForm({ ...form, linkedin: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,100,60,0.5)", marginBottom: 6 }}>GITHUB URL</label>
                    <input
                      type="text"
                      style={inputSx}
                      placeholder="https://github.com/username"
                      value={form.github ?? ""}
                      onFocus={focusSx}
                      onBlur={blurSx}
                      onChange={e => setForm({ ...form, github: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
                  <button type="submit" className="sr-adm-btn">+ ADD SENIOR OPERATIVE</button>
                </div>
              </form>
            </div>
          </div>

          {/* Manage Operatives Section */}
          <div className="sr-adm-section fu fu4">
            <div className="sr-adm-section-body">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
                <div className="sr-adm-section-title" style={{ marginBottom: 0, flex: 1 }}>
                  ✦ MANAGE SENIOR OPERATIVES ({filtered.length})
                </div>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "rgba(255,60,0,0.35)", fontSize: 13, pointerEvents: "none" }}>⬡</span>
                  <input
                    className="sr-adm-search-input"
                    type="text"
                    placeholder="SCAN BY NAME / ROLL..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="sr-adm-table-wrap">
                <table className="sr-adm-table">
                  <thead>
                    <tr>
                      <th>OPERATIVE</th>
                      <th className="c">YEAR</th>
                      <th className="c">RANK</th>
                      <th className="c">CURRENT XP</th>
                      <th className="c">UPDATE XP</th>
                      <th>LINKS</th>
                      <th className="c">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => {
                      const rc = rankColor(s.rank);
                      const fl = flashRow[s._id];
                      return (
                        <Fragment key={s._id}>
                          <tr className={fl === "success" ? "sr-flash-success" : fl === "error" ? "sr-flash-error" : ""}>
                            <td>
                              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: 700, fontSize: 15, color: "#ffe8e0", letterSpacing: "0.03em" }}>{s.name}</div>
                              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: "rgba(255,100,60,0.45)", letterSpacing: "0.08em", marginTop: 3 }}>{s.roll}</div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span className="sr-adm-year-badge">
                                {s.year === 1 ? "1ST YR" : s.year === 2 ? "2ND YR" : s.year === 3 ? "3RD YR" : s.year === 4 ? "4TH YR" : `Y${s.year || "?"}`}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span className="sr-adm-rank" style={{ color: rc, borderColor: rc + "44", background: rc + "0d", textShadow: `0 0 10px ${rc}66` }}>
                                #{s.rank}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <span className="sr-adm-pts-chip">{s.points}</span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                                <input
                                  type="number"
                                  className="sr-adm-pts-input"
                                  placeholder="New"
                                  value={pointsUpdate[s._id] !== undefined ? pointsUpdate[s._id] : ""}
                                  onChange={e => setPointsUpdate({ ...pointsUpdate, [s._id]: e.target.value })}
                                  onKeyDown={e => e.key === "Enter" && updatePoints(s._id)}
                                />
                                <button className="sr-adm-btn-icon sr-adm-btn-save" onClick={() => updatePoints(s._id)} title="Save XP" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                  <SaveIcon size={14} />
                                </button>
                              </div>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                {s.github ? (
                                  <a href={s.github} target="_blank" rel="noreferrer" title={s.github} style={{ color: "#ff8844", display: "inline-flex", alignItems: "center" }}>
                                    <GithubIcon size={16} />
                                  </a>
                                ) : (
                                  <span style={{ opacity: 0.2, fontSize: 12 }}>—</span>
                                )}
                                {s.linkedin ? (
                                  <a href={s.linkedin} target="_blank" rel="noreferrer" title={s.linkedin} style={{ color: "#ff4400", display: "inline-flex", alignItems: "center" }}>
                                    <LinkedinIcon size={16} />
                                  </a>
                                ) : (
                                  <span style={{ opacity: 0.2, fontSize: 12 }}>—</span>
                                )}
                                <button className="sr-adm-btn-link-edit" onClick={() => toggleLinkEdit(s._id, s)} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                  {expandedLinks[s._id] ? <CloseIcon size={12} /> : <><EditIcon size={12} /> EDIT</>}
                                </button>
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button className="sr-adm-btn-icon sr-adm-btn-del" onClick={() => handleDelete(s._id)} title="Delete Operative" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                <TrashIcon size={14} />
                              </button>
                            </td>
                          </tr>
                          {expandedLinks[s._id] && (
                            <tr className="sr-adm-link-row">
                              <td colSpan={7}>
                                <div className="sr-adm-link-row-inner">
                                  <span style={{ fontSize: 11, color: "rgba(255,100,60,0.7)", letterSpacing: "0.1em" }}>YEAR:</span>
                                  <select
                                    className="sr-adm-select"
                                    style={{ ...inputSx, width: "auto", minWidth: 120, padding: "7px 10px" }}
                                    value={linksUpdate[s._id]?.year ?? "1"}
                                    onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], year: e.target.value } }))}
                                  >
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                  </select>
                                  <span style={{ fontSize: 11, color: "rgba(255,100,60,0.7)", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <GithubIcon size={14} /> GITHUB:
                                  </span>
                                  <input
                                    style={{ ...inputSx, flex: 1, minWidth: 160, padding: "8px 12px" }}
                                    placeholder="https://github.com/username"
                                    value={linksUpdate[s._id]?.github || ""}
                                    onFocus={focusSx}
                                    onBlur={blurSx}
                                    onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], github: e.target.value } }))}
                                  />
                                  <span style={{ fontSize: 11, color: "rgba(255,100,60,0.7)", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <LinkedinIcon size={14} /> LINKEDIN:
                                  </span>
                                  <input
                                    style={{ ...inputSx, flex: 1, minWidth: 160, padding: "8px 12px" }}
                                    placeholder="https://linkedin.com/in/username"
                                    value={linksUpdate[s._id]?.linkedin || ""}
                                    onFocus={focusSx}
                                    onBlur={blurSx}
                                    onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], linkedin: e.target.value } }))}
                                  />
                                  <button className="sr-adm-btn-save-links" onClick={() => updateLinks(s._id)} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                                    <SaveIcon size={14} /> SAVE CHANGES
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="sr-adm-empty">
                    {search ? "◈ NO MATCH FOUND ◈" : "◈ NO SENIOR OPERATIVES FOUND ◈"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="sr-adm-footer">
            <p style={{ fontFamily: "'Orbitron',monospace", color: "rgba(255,60,0,0.3)", fontSize: 10, letterSpacing: "0.24em" }}>
              IGNITE CLUB — CodeCraft SENIOR ADMIN
            </p>
            <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(255,255,255,0.1)", fontSize: 10, marginTop: 6 }}>
              © 2026 CodeCraft — ALL NODES SECURED
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}
