import { Counter } from "./AdminHelpers";

export default function AdminHeader({ students, totalPts, sorted, onLogout }) {
  return (
    <>
      <div className="adm-topbar fu fu1">
        <div>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: "0.3em", color: "rgba(0,255,160,0.3)", marginBottom: 8 }}>
            ∥ VISHVESHWARYA GROUP OF INSTITUTION ∥
          </p>
          <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(22px,4.5vw,36px)", color: "#00ffcc", textShadow: "0 0 24px #00ffcc55", lineHeight: 1 }}>
            IGNITE CLUB
          </h1>
          <p style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: "#00aaff", textShadow: "0 0 14px #00aaff66", letterSpacing: "0.1em", marginTop: 4 }}>
            ▸ BUGBYTE — ADMIN DASHBOARD
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="adm-live"><span className="adm-live-dot" />LIVE UPLINK</span>
          <button className="adm-logout" onClick={onLogout}>🚪 LOGOUT</button>
        </div>
      </div>

      <div className="adm-stats fu fu2">
        {[
          { label: "TOTAL OPERATIVES", val: students.length },
          { label: "TOTAL XP", val: totalPts },
          { label: "TOP SCORE", val: sorted[0]?.points ?? 0 },
          { label: "LEADER", val: sorted[0]?.name?.split(" ")[0] || "—", raw: true },
        ].map(({ label, val, raw }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div className="adm-stat-val">
              {raw ? val : <Counter value={val} visible={true} />}
            </div>
            <div className="adm-stat-lbl">{label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
