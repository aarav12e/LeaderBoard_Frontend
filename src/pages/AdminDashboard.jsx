import { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import AdminLogin from "../components/AdminLogin";
import AdminHeader from "../components/AdminHeader";
import AdminAddStudentForm from "../components/AdminAddStudentForm";
import AdminManageStudents from "../components/AdminManageStudents";
import AdminFooter from "../components/AdminFooter";
import { SpaceCanvas, MatrixRain } from "../components/AdminEffects";




/* ─────────────────────────────────────────────────────────────
   Admin Login Page — deep space theme
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   Admin Dashboard — deep space theme, clean readability
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
  const [flashRow, setFlashRow] = useState({});
  const [search, setSearch] = useState("");

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
      toast.success("Student Added!", {
        style: { background: "#000814", border: "1px solid rgba(0,255,160,0.3)", color: "#00ffa0", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
      setForm({});
      fetchStudents();
    } catch { toast.error("Error adding student"); }
  };

  const updatePoints = async (id) => {
    const change = pointsUpdate[id];
    if (!change) return;
    try {
      await api.put(`/students/${id}`, { points: Number(change) });
      toast.success("Points Updated!", {
        style: { background: "#000814", border: "1px solid rgba(0,255,160,0.3)", color: "#00ffa0", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
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
      toast.success("Links Updated!", {
        style: { background: "#000814", border: "1px solid rgba(0,255,160,0.3)", color: "#00ffa0", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
      setExpandedLinks(prev => ({ ...prev, [id]: false }));
      fetchStudents();
    } catch { toast.error("Error updating links"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student? This cannot be undone.")) return;
    try {
      await api.delete(`/students/${id}`);
      toast.success("Student Removed", {
        style: { background: "#000814", border: "1px solid rgba(0,255,160,0.3)", color: "#00ffa0", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
      fetchStudents();
    } catch { toast.error("Error deleting student"); }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;

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
    if (rank <= 5) return "#00aaff";
    return "#00ffcc";
  };

  /* shared input style */
  const inputSx = {
    background: "rgba(0,255,160,0.03)",
    border: "1px solid rgba(0,255,160,0.15)",
    borderRadius: 2,
    color: "#e8fff4",
    padding: "10px 14px",
    fontSize: 13,
    fontFamily: "'Share Tech Mono',monospace",
    outline: "none",
    width: "100%",
    letterSpacing: "0.03em",
    transition: "border-color 0.25s, box-shadow 0.25s",
    clipPath: "polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)",
  };
  const focusSx = e => { e.target.style.borderColor = "rgba(0,255,160,0.5)"; e.target.style.boxShadow = "0 0 0 2px rgba(0,255,160,0.08)"; };
  const blurSx  = e => { e.target.style.borderColor = "rgba(0,255,160,0.15)"; e.target.style.boxShadow = "none"; };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#000308}

        .adm{font-family:'Share Tech Mono',monospace;background:#000308;min-height:100vh;color:#e0ffe8;position:relative;overflow-x:hidden}
        .adm-inner{position:relative;z-index:3;max-width:1140px;margin:0 auto;padding:clamp(16px,4vw,52px) clamp(12px,3vw,36px) 72px}

        /* ── TOPBAR ── */
        .adm-topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:16px;padding-bottom:24px;border-bottom:1px solid rgba(0,255,160,0.08)}
        .adm-live{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:2px;background:rgba(0,255,160,0.05);border:1px solid rgba(0,255,160,0.22);font-size:9px;color:#00ffa0;letter-spacing:0.22em;clip-path:polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)}
        .adm-live-dot{width:7px;height:7px;border-radius:50%;background:#00ffa0;animation:livePulse 1.2s ease-in-out infinite;box-shadow:0 0 7px #00ffa0}
        @keyframes livePulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.6);opacity:0.5}}

        .adm-logout{background:rgba(0,255,160,0.04);border:1px solid rgba(0,255,160,0.2);color:rgba(0,255,200,0.55);padding:8px 20px;border-radius:2px;font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:0.12em;cursor:pointer;transition:all 0.2s;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)}
        .adm-logout:hover{background:rgba(0,255,160,0.1);border-color:rgba(0,255,160,0.5);color:#00ffcc;box-shadow:0 0 18px rgba(0,255,160,0.2)}

        /* ── STATS ── */
        .adm-stats{display:flex;gap:clamp(20px,4vw,60px);justify-content:center;padding:20px 32px;border-radius:2px;background:rgba(0,4,14,0.72);border:1px solid rgba(0,255,160,0.09);backdrop-filter:blur(14px);margin-bottom:36px;flex-wrap:wrap;clip-path:polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)}
        .adm-stat-val{font-family:'Orbitron',monospace;font-size:clamp(20px,3vw,30px);font-weight:900;color:#00ffcc;text-shadow:0 0 20px #00ffcc55}
        .adm-stat-lbl{font-size:8px;color:rgba(0,255,160,0.3);letter-spacing:0.2em;margin-top:3px}
        .adm-stat-sep{width:1px;background:rgba(0,255,160,0.1);align-self:stretch}

        /* ── SECTION ── */
        .adm-section{background:rgba(0,4,14,0.72);border:1px solid rgba(0,255,160,0.09);border-radius:2px;overflow:hidden;backdrop-filter:blur(16px);box-shadow:0 0 50px rgba(0,255,160,0.02),inset 0 1px 0 rgba(0,255,160,0.05);position:relative;margin-bottom:28px}
        .adm-section::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00ffcc66,#00aaff44,transparent)}
        .adm-section-body{padding:clamp(18px,3vw,28px)}
        .adm-section-title{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:0.24em;color:rgba(0,255,160,0.4);margin-bottom:22px;display:flex;align-items:center;gap:10px}
        .adm-section-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,rgba(0,255,160,0.2),transparent)}

        /* ── ADD FORM ── */
        .adm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:600px){.adm-form-grid{grid-template-columns:1fr}}
        .adm-full{grid-column:1 / -1}

        /* ── SEARCH ── */
        .adm-search-wrap{display:flex;justify-content:flex-end;margin-bottom:18px}
        .adm-search-input{width:260px;background:rgba(0,255,160,0.03);border:1px solid rgba(0,255,160,0.15);border-radius:2px;padding:9px 14px 9px 36px;color:#e8fff4;font-size:12px;outline:none;font-family:'Share Tech Mono',monospace;letter-spacing:0.04em;transition:all 0.25s;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)}
        .adm-search-input::placeholder{color:rgba(0,255,160,0.18)}
        .adm-search-input:focus{border-color:rgba(0,255,160,0.4);box-shadow:0 0 0 2px rgba(0,255,160,0.06);width:320px}

        /* ── TABLE ── */
        .adm-table-wrap{overflow-x:auto;max-height:520px;overflow-y:auto}
        .adm-table-wrap::-webkit-scrollbar{width:4px;height:4px}
        .adm-table-wrap::-webkit-scrollbar-track{background:#000308}
        .adm-table-wrap::-webkit-scrollbar-thumb{background:rgba(0,255,160,0.18);border-radius:99px}
        .adm-table{width:100%;border-collapse:separate;border-spacing:0 4px}
        .adm-table thead th{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:0.2em;color:rgba(0,255,160,0.32);padding:12px 16px;text-align:left;border-bottom:1px solid rgba(0,255,160,0.07);position:sticky;top:0;background:rgba(0,3,12,0.96);z-index:2;backdrop-filter:blur(16px)}
        .adm-table thead th.c{text-align:center}
        .adm-table tbody td{padding:14px 16px;font-size:14px;vertical-align:middle;background:rgba(0,255,160,0.015);transition:background 0.2s}
        .adm-table tbody td:first-child{border-left:3px solid transparent;transition:border-color 0.3s}
        .adm-table tbody tr:hover td{background:rgba(0,255,160,0.035)!important}
        .adm-table tbody tr:hover td:first-child{border-left-color:rgba(0,255,160,0.4)}

        /* ── LINK EXPAND ROW ── */
        .adm-link-row td{background:rgba(0,255,160,0.02)!important;border-top:1px solid rgba(0,255,160,0.07)!important}
        .adm-link-row-inner{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:4px 0}

        /* ── BUTTONS ── */
        .adm-btn{font-family:'Orbitron',monospace;font-weight:700;letter-spacing:0.1em;font-size:10px;padding:10px 22px;border-radius:2px;border:1px solid #00ffcc;background:transparent;color:#00ffcc;cursor:pointer;transition:all 0.3s;text-shadow:0 0 10px #00ffcc88;box-shadow:0 0 18px #00ffcc18;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);position:relative;overflow:hidden}
        .adm-btn::before{content:'';position:absolute;inset:0;background:#00ffcc;transform:translateX(-110%);transition:transform 0.35s ease;z-index:-1}
        .adm-btn:hover{color:#000308;text-shadow:none;box-shadow:0 0 40px #00ffcc66;animation:none}
        .adm-btn:hover::before{transform:translateX(0)}

        .adm-btn-icon{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:2px;border:none;cursor:pointer;font-size:16px;transition:transform 0.18s,box-shadow 0.18s}
        .adm-btn-save{background:rgba(0,255,160,0.06);border:1px solid rgba(0,255,160,0.25)}
        .adm-btn-save:hover{background:rgba(0,255,160,0.15);box-shadow:0 0 14px rgba(0,255,160,0.3);transform:translateY(-1px)}
        .adm-btn-del{background:rgba(255,50,50,0.06);border:1px solid rgba(255,50,50,0.2)}
        .adm-btn-del:hover{background:rgba(255,50,50,0.15);box-shadow:0 0 14px rgba(255,50,50,0.3);transform:translateY(-1px)}
        .adm-btn-link-edit{background:rgba(0,170,255,0.06);border:1px solid rgba(0,170,255,0.2);color:rgba(0,170,255,0.6);font-family:'Share Tech Mono',monospace;font-size:10px;padding:5px 12px;border-radius:2px;cursor:pointer;transition:all 0.2s;letter-spacing:0.06em}
        .adm-btn-link-edit:hover{background:rgba(0,170,255,0.14);border-color:rgba(0,170,255,0.5);color:#00aaff}
        .adm-btn-save-links{font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:0.1em;padding:8px 18px;border-radius:2px;border:1px solid #00aaff;background:transparent;color:#00aaff;cursor:pointer;transition:all 0.2s;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)}
        .adm-btn-save-links:hover{background:rgba(0,170,255,0.12);box-shadow:0 0 20px rgba(0,170,255,0.3)}

        /* ── POINTS INPUT ── */
        .adm-pts-input{width:90px;text-align:center;background:rgba(0,255,160,0.04);border:1px solid rgba(0,255,160,0.18);border-radius:2px;color:#00ffa0;padding:7px 8px;font-size:13px;font-family:'Share Tech Mono',monospace;outline:none;letter-spacing:0.03em;transition:all 0.2s}
        .adm-pts-input:focus{border-color:rgba(0,255,160,0.5);box-shadow:0 0 0 2px rgba(0,255,160,0.08)}

        /* ── RANK BADGE ── */
        .adm-rank{display:inline-flex;align-items:center;justify-content:center;min-width:38px;height:26px;border-radius:2px;font-family:'Share Tech Mono',monospace;font-size:11px;font-weight:700;border:1px solid rgba(0,255,160,0.15);background:rgba(0,255,160,0.04);color:rgba(0,255,160,0.55);letter-spacing:0.04em}

        /* ── PTS CHIP ── */
        .adm-pts-chip{display:inline-block;padding:4px 14px;border-radius:2px;background:rgba(0,255,160,0.07);border:1px solid rgba(0,255,160,0.22);color:#00ffa0;font-weight:700;font-size:13px;font-family:'Share Tech Mono',monospace;letter-spacing:0.04em}

        /* ── NO DATA ── */
        .adm-empty{text-align:center;padding:52px 0;color:rgba(0,255,160,0.18);font-family:'Share Tech Mono',monospace;font-size:12px;letter-spacing:0.18em}

        /* ── FLASH ROWS ── */
        .flash-success td{background:rgba(0,220,100,0.1)!important;box-shadow:inset 0 0 20px rgba(0,220,100,0.12)}
        .flash-error td{background:rgba(255,50,50,0.1)!important;box-shadow:inset 0 0 20px rgba(255,50,50,0.12)}

        /* ── FOOTER ── */
        .adm-footer{text-align:center;padding-top:36px;border-top:1px solid rgba(0,255,160,0.07);margin-top:16px}

        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#000308}
        ::-webkit-scrollbar-thumb{background:rgba(0,255,160,0.18);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(0,255,160,0.4)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.7s cubic-bezier(0.34,1.2,0.64,1) both}
        .fu1{animation-delay:0.05s}.fu2{animation-delay:0.18s}.fu3{animation-delay:0.32s}.fu4{animation-delay:0.46s}
      `}</style>

      <div className="adm">
        <SpaceCanvas />
        <MatrixRain />

        <div className="adm-inner">

          <AdminHeader students={students} totalPts={totalPts} sorted={sorted} onLogout={handleLogout} />

          <AdminAddStudentForm
            form={form}
            setForm={setForm}
            submit={submit}
            inputSx={inputSx}
            focusSx={focusSx}
            blurSx={blurSx}
          />

          <AdminManageStudents
            filtered={filtered}
            search={search}
            setSearch={setSearch}
            pointsUpdate={pointsUpdate}
            setPointsUpdate={setPointsUpdate}
            linksUpdate={linksUpdate}
            setLinksUpdate={setLinksUpdate}
            expandedLinks={expandedLinks}
            toggleLinkEdit={toggleLinkEdit}
            updateLinks={updateLinks}
            updatePoints={updatePoints}
            handleDelete={handleDelete}
            flashRow={flashRow}
            rankColor={rankColor}
            inputSx={inputSx}
            focusSx={focusSx}
            blurSx={blurSx}
          />

          <AdminFooter />

        </div>
      </div>
    </>
  );
}