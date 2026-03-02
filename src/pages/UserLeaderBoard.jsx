import { useEffect, useState } from "react";
import { api } from "../services/api";

/* ─── Podium Card ─────────────────────────────────────────── */
function PodiumCard({ student, position }) {
  const cfg = {
    1: {
      emoji: "🥇",
      glow: "#F97316",
      ring: "2px solid #F97316",
      label: "1ST",
      cardH: "180px",
      blockH: "90px",
      blockBg: "linear-gradient(180deg,#F97316,#c2410c)",
      textColor: "#F97316",
      order: 2,
      scale: "scale(1.08)",
      shadow: "0 0 30px #F9731666, 0 0 60px #F9731622",
    },
    2: {
      emoji: "🥈",
      glow: "#ef4444",
      ring: "2px solid #ef4444",
      label: "2ND",
      cardH: "148px",
      blockH: "64px",
      blockBg: "linear-gradient(180deg,#ef4444,#991b1b)",
      textColor: "#ef4444",
      order: 1,
      scale: "scale(1)",
      shadow: "0 0 20px #ef444444",
    },
    3: {
      emoji: "🥉",
      glow: "#dc2626",
      ring: "2px solid #dc2626",
      label: "3RD",
      cardH: "130px",
      blockH: "48px",
      blockBg: "linear-gradient(180deg,#dc2626,#7f1d1d)",
      textColor: "#fca5a5",
      order: 3,
      scale: "scale(1)",
      shadow: "0 0 20px #dc262644",
    },
  };

  const c = cfg[position];
  if (!student) return <div style={{ order: c.order }} />;

  const shortName = student.name.length > 13 ? student.name.split(" ")[0] : student.name;

  return (
    <div style={{ order: c.order, display: "flex", flexDirection: "column", alignItems: "center", transform: c.scale }}>
      <div style={{
        height: c.cardH, width: "clamp(100px,22vw,140px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
        borderRadius: 18, border: c.ring,
        background: "rgba(15,0,0,0.7)", backdropFilter: "blur(12px)",
        padding: "12px 8px", boxShadow: c.shadow,
        transition: "transform 0.3s",
        cursor: "default",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)" }} />
        <span style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1 }}>{c.emoji}</span>
        <p style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: "clamp(10px,2.5vw,13px)", color: c.textColor, textAlign: "center", lineHeight: 1.3, margin: 0 }}>
          {shortName}
        </p>
        <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(255,255,255,0.4)", fontSize: "clamp(9px,2vw,11px)", margin: 0 }}>
          {student.roll}
        </p>
        <div style={{ padding: "2px 10px", borderRadius: 99, background: "rgba(255,255,255,0.06)", border: `1px solid ${c.glow}55`, color: c.textColor, fontWeight: 700, fontSize: "clamp(10px,2.5vw,13px)", fontFamily: "'Share Tech Mono',monospace" }}>
          {student.points} pts
        </div>
      </div>
      <div style={{
        height: c.blockH, width: "clamp(100px,22vw,140px)",
        background: c.blockBg, borderRadius: "8px 8px 0 0",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 4px 20px ${c.glow}33`,
      }}>
        <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, color: "#fff", fontSize: "clamp(14px,3vw,22px)", letterSpacing: "0.1em" }}>{c.label}</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function UserLeaderboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    api.get("/students").then(res => setData(res.data));
  }, []);

  const handleEnter = () => {
    try {
      const speech = new SpeechSynthesisUtterance("Welcome to Ignite Club BugByte");
      window.speechSynthesis.speak(speech);
    } catch (_) {}
    setExiting(true);
    setTimeout(() => setShowWelcome(false), 650);
  };

  const sorted = [...data].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);
  const filtered = sorted.filter(s =>
    s.roll.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const medal = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : null;

  const rowBorder = r =>
    r === 1 ? "4px solid #F97316" :
    r === 2 ? "4px solid #ef4444" :
    r === 3 ? "4px solid #dc2626" :
    "4px solid transparent";

  const rowBg = r =>
    r === 1 ? "rgba(249,115,22,0.05)" :
    r === 2 ? "rgba(239,68,68,0.04)" :
    r === 3 ? "rgba(220,38,38,0.03)" :
    "rgba(255,255,255,0.02)";

  const mobileCardBorder = r =>
    r === 1 ? "rgba(249,115,22,0.55)" :
    r === 2 ? "rgba(239,68,68,0.45)" :
    r === 3 ? "rgba(220,38,38,0.4)" :
    "rgba(255,255,255,0.08)";

  const mobileCardGlow = r =>
    r === 1 ? "0 0 20px rgba(249,115,22,0.15)" :
    r === 2 ? "0 0 16px rgba(239,68,68,0.1)" :
    r === 3 ? "0 0 16px rgba(220,38,38,0.08)" :
    "none";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lb-wrap {
          font-family: 'Inter', sans-serif;
          background: #0a0a0a;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          color: #f5f5f5;
        }

        .lb-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 70% 50% at 15% 5%, rgba(185,28,28,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 85% 90%, rgba(194,65,12,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 50% 50%, rgba(10,0,0,0.9) 0%, transparent 100%);
        }
        .lb-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .lb-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: clamp(16px,4vw,48px) clamp(12px,3vw,32px) 48px; }

        /* Welcome */
        .welcome {
          position: fixed; inset: 0; z-index: 100;
          background: #0a0a0a;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .welcome.exit { opacity: 0; transform: scale(1.06); pointer-events: none; }
        .scanline {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.6), rgba(249,115,22,0.6), transparent);
          animation: scan 3.5s linear infinite;
          pointer-events: none;
        }
        @keyframes scan { from { top: -2px; } to { top: 100%; } }

        .enter-btn {
          font-family: 'Orbitron', monospace; font-weight: 700;
          letter-spacing: 0.12em; font-size: clamp(13px,2.5vw,15px);
          padding: 14px clamp(28px,5vw,44px);
          border-radius: 12px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #dc2626 0%, #F97316 100%);
          color: white;
          box-shadow: 0 0 30px rgba(239,68,68,0.55), 0 0 60px rgba(239,68,68,0.2);
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative; z-index: 1;
        }
        .enter-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 0 50px rgba(239,68,68,0.8), 0 0 90px rgba(249,115,22,0.3);
        }

        /* Typography */
        .orbitron { font-family: 'Orbitron', monospace; }
        .mono { font-family: 'Share Tech Mono', monospace; }
        .neon-red { color: #ef4444; text-shadow: 0 0 12px #ef444488, 0 0 32px #ef444433; }
        .neon-orange { color: #F97316; text-shadow: 0 0 12px #F9731688, 0 0 32px #F9731633; }

        @keyframes pulse { 0%,100% { opacity:0.55; } 50% { opacity:1; } }
        .pulse { animation: pulse 2.2s ease-in-out infinite; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        .fu { animation: fadeUp 0.6s ease both; }
        .fu1 { animation-delay: 0.05s; }
        .fu2 { animation-delay: 0.18s; }
        .fu3 { animation-delay: 0.32s; }
        .fu4 { animation-delay: 0.46s; }

        .divider {
          height: 1px; margin: 0 auto;
          background: linear-gradient(90deg, transparent, rgba(239,68,68,0.6), rgba(249,115,22,0.5), transparent);
        }

        /* Search */
        .search-wrap { display: flex; justify-content: center; position: sticky; top: 10px; z-index: 40; }
        .search-input {
          width: 100%; max-width: 500px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 14px;
          padding: 13px 22px;
          color: #f5f5f5; font-size: 14px; outline: none;
          backdrop-filter: blur(14px);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: rgba(245,245,245,0.25); }
        .search-input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.12), 0 0 24px rgba(239,68,68,0.15);
        }

        /* Table */
        .card-wrap {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(239,68,68,0.15);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 0 50px rgba(220,38,38,0.06), inset 0 1px 0 rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
        }
        .lb-table { width: 100%; border-collapse: separate; border-spacing: 0 5px; padding: 10px 12px; }
        .lb-table thead th {
          font-family: 'Orbitron', monospace; font-size: 10px; letter-spacing: 0.14em;
          color: rgba(239,68,68,0.6); padding: 10px 14px; text-align: left;
          border-bottom: 1px solid rgba(239,68,68,0.1);
        }
        .lb-table thead th.c { text-align: center; }
        .lb-table tbody td {
          padding: 14px 14px; font-size: 14px; vertical-align: middle;
          background: inherit;
          transition: background 0.2s;
        }
        .lb-table tbody td.c { text-align: center; }
        .lb-table tbody td:first-child { border-radius: 10px 0 0 10px; }
        .lb-table tbody td:last-child { border-radius: 0 10px 10px 0; }
        .lb-table tbody tr { transition: transform 0.15s; }
        .lb-table tbody tr:hover td { background: rgba(239,68,68,0.05); }
        .lb-table tbody tr:hover { transform: translateX(2px); }

        .rank-chip {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 38px; height: 28px; border-radius: 8px;
          font-family: 'Share Tech Mono', monospace; font-size: 12px; font-weight: 700;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(245,245,245,0.5);
        }
        .pts-chip {
          display: inline-block; padding: 3px 12px; border-radius: 99px;
          background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3);
          color: #F97316; font-weight: 700; font-size: 13px; font-family: 'Share Tech Mono', monospace;
        }
        .link-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 9px; font-size: 12px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.08); color: rgba(245,245,245,0.55);
          background: rgba(255,255,255,0.03); text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .link-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.4); color: #ef4444; }

        /* Mobile cards */
        .m-card {
          background: rgba(255,255,255,0.02);
          border-radius: 16px; padding: 16px;
          backdrop-filter: blur(8px);
          transition: box-shadow 0.2s, border-color 0.2s;
        }

        /* Footer */
        .lb-footer {
          text-align: center; padding: 28px 16px;
          border-top: 1px solid rgba(239,68,68,0.08);
          position: relative; z-index: 1; margin-top: 48px;
        }

        /* Responsive */
        .desktop-only { display: none; }
        .mobile-only { display: flex; flex-direction: column; gap: 10px; }
        @media (min-width: 768px) {
          .desktop-only { display: block; }
          .mobile-only { display: none; }
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(239,68,68,0.25); border-radius: 99px; }
      `}</style>

      <div className="lb-wrap">
        <div className="lb-bg" />
        <div className="lb-grid" />

        {/* Welcome */}
        {showWelcome && (
          <div className={`welcome${exiting ? " exit" : ""}`}>
            <div className="scanline" />
            <div style={{ textAlign: "center", padding: "0 24px", position: "relative", zIndex: 1 }}>
              <p className="mono pulse" style={{ color: "#ef4444", fontSize: 12, letterSpacing: "0.25em", marginBottom: 20 }}>
                SYSTEM INITIALIZING...
              </p>
              <h1 className="orbitron neon-red" style={{ fontSize: "clamp(32px,7vw,64px)", fontWeight: 900, lineHeight: 1.05, marginBottom: 8 }}>
                IGNITE CLUB
              </h1>
              <h2 className="orbitron neon-orange" style={{ fontSize: "clamp(20px,4vw,36px)", fontWeight: 700, marginBottom: 12 }}>
                BUGBYTE 🎉
              </h2>
              <p style={{ color: "rgba(245,245,245,0.3)", fontSize: 12, letterSpacing: "0.12em", marginBottom: 44 }}>
                VISHVESHWARYA GROUP OF INSTITUTION
              </p>
              <button className="enter-btn" onClick={handleEnter}>⚡ ENTER</button>
            </div>
          </div>
        )}

        {/* Main */}
        <div className="lb-inner">

          {/* Header */}
          <div className="fu fu1" style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="mono pulse" style={{ color: "rgba(239,68,68,0.5)", fontSize: 11, letterSpacing: "0.22em", marginBottom: 14 }}>
              VISHVESHWARYA GROUP OF INSTITUTION
            </p>
            <h1 className="orbitron neon-red" style={{ fontSize: "clamp(26px,6vw,52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 8 }}>
              IGNITE CLUB
            </h1>
            <h2 className="orbitron neon-orange" style={{ fontSize: "clamp(14px,3vw,26px)", fontWeight: 700, marginBottom: 22 }}>
              BUGBYTE — LEADERBOARD
            </h2>
            <div className="divider" style={{ maxWidth: 380 }} />
          </div>

          {/* Podium */}
          {top3.length > 0 && (
            <div className="fu fu2" style={{ marginBottom: 60 }}>
              <p className="orbitron pulse" style={{ textAlign: "center", color: "rgba(239,68,68,0.55)", fontSize: 10, letterSpacing: "0.22em", marginBottom: 34 }}>
                🏆 &nbsp; TOP PERFORMERS &nbsp; 🏆
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "clamp(8px,3vw,28px)" }}>
                <PodiumCard student={top3[1]} position={2} />
                <PodiumCard student={top3[0]} position={1} />
                <PodiumCard student={top3[2]} position={3} />
              </div>
            </div>
          )}

          {/* Search */}
          <div className="fu fu3 search-wrap" style={{ marginBottom: 24 }}>
            <input
              className="search-input"
              type="text"
              placeholder="🔍  Search by Roll No or Name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Desktop Table */}
          <div className="fu fu4 desktop-only">
            <div className="card-wrap">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th className="c" style={{ width: 68 }}>RANK</th>
                    <th className="c">ROLL NO</th>
                    <th>NAME</th>
                    <th className="c">POINTS</th>
                    <th className="c">LINKEDIN</th>
                    <th className="c">GITHUB</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(item => {
                    const m = medal(item.rank);
                    return (
                      <tr key={item._id} style={{ borderLeft: rowBorder(item.rank) }}>
                        <td className="c" style={{ background: rowBg(item.rank) }}>
                          {m ? <span style={{ fontSize: 22 }}>{m}</span> : <span className="rank-chip">#{item.rank}</span>}
                        </td>
                        <td className="c mono" style={{ color: "#F97316", fontSize: 13, background: rowBg(item.rank) }}>{item.roll}</td>
                        <td style={{ fontWeight: 600, background: rowBg(item.rank) }}>{item.name}</td>
                        <td className="c" style={{ background: rowBg(item.rank) }}><span className="pts-chip">{item.points}</span></td>
                        <td className="c" style={{ background: rowBg(item.rank) }}>
                          {item.linkedin
                            ? <a href={item.linkedin} target="_blank" rel="noreferrer" className="link-btn">🔗 LinkedIn</a>
                            : <span style={{ color: "rgba(255,255,255,0.12)" }}>—</span>}
                        </td>
                        <td className="c" style={{ background: rowBg(item.rank) }}>
                          {item.github
                            ? <a href={item.github} target="_blank" rel="noreferrer" className="link-btn">🐙 GitHub</a>
                            : <span style={{ color: "rgba(255,255,255,0.12)" }}>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-only">
            {filtered.map(item => {
              const m = medal(item.rank);
              return (
                <div
                  key={item._id}
                  className="m-card"
                  style={{ border: `1px solid ${mobileCardBorder(item.rank)}`, boxShadow: mobileCardGlow(item.rank) }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {m
                        ? <span style={{ fontSize: 26 }}>{m}</span>
                        : <span className="rank-chip" style={{ fontSize: 11 }}>#{item.rank}</span>}
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 15, color: "#f5f5f5" }}>{item.name}</p>
                        <p className="mono" style={{ color: "#F97316", fontSize: 12 }}>{item.roll}</p>
                      </div>
                    </div>
                    <span className="pts-chip">{item.points} pts</span>
                  </div>
                  {(item.linkedin || item.github) && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      {item.linkedin && <a href={item.linkedin} target="_blank" rel="noreferrer" className="link-btn" style={{ flex: 1, justifyContent: "center" }}>🔗 LinkedIn</a>}
                      {item.github && <a href={item.github} target="_blank" rel="noreferrer" className="link-btn" style={{ flex: 1, justifyContent: "center" }}>🐙 GitHub</a>}
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="mono" style={{ textAlign: "center", color: "rgba(245,245,245,0.2)", marginTop: 40, letterSpacing: "0.12em" }}>
                NO RESULTS FOUND
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="lb-footer">
          <p className="orbitron" style={{ color: "rgba(239,68,68,0.5)", fontSize: 11, letterSpacing: "0.22em" }}>IGNITE CLUB — BUGBYTE</p>
          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 12, marginTop: 6 }}>© 2026 BugByte</p>
        </footer>
      </div>
    </>
  );
}