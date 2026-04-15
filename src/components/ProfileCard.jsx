export default function ProfileCard({ student, badges, pos, onClose }) {
  if (!student) return null;
  const initials = student.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const rankCol = student.rank === 1 ? "#ffd700" : student.rank === 2 ? "#c0c8d8" : student.rank === 3 ? "#cd7f32" : student.rank <= 5 ? "#00aaff" : "#00ffa0";

  return (
    <div onClick={e => e.stopPropagation()} style={{
      position: "fixed", left: pos.x + 18, top: Math.min(pos.y - 10, window.innerHeight - 320),
      zIndex: 8000, width: 240,
      background: "linear-gradient(145deg,rgba(0,4,18,0.97),rgba(0,10,28,0.95))",
      border: "1px solid rgba(0,255,160,0.2)",
      borderRadius: 4, padding: "18px 18px 16px",
      boxShadow: "0 0 0 1px rgba(0,255,160,0.06),0 24px 64px rgba(0,0,0,0.85),0 0 40px rgba(0,255,160,0.08)",
      backdropFilter: "blur(24px)", pointerEvents: "auto",
      animation: "profIn 0.2s cubic-bezier(0.34,1.4,0.64,1) both",
    }}>
      <button onClick={onClose} style={{
        position: "absolute", right: 8, top: 8, width: 24, height: 24,
        border: "none", borderRadius: 4, background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", cursor: "pointer",
        fontSize: 14, lineHeight: 1, padding: 0
      }}>
        ✕
      </button>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(0,255,160,0.5),transparent)" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 3, flexShrink: 0,
          background: `linear-gradient(135deg,${rankCol}33,${rankCol}11)`,
          border: `1px solid ${rankCol}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 15,
          color: rankCol, boxShadow: `0 0 18px ${rankCol}33`,
        }}>{initials}</div>
        <div>
          <p style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 11, color: "#e8fff4", letterSpacing: "0.06em", lineHeight: 1.3 }}>{student.name}</p>
          <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(0,255,200,0.45)", marginTop: 3, letterSpacing: "0.08em" }}>{student.roll}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[{ label: "RANK", val: `#${student.rank}`, col: rankCol }, { label: "XP", val: student.points, col: "#00ffa0" }].map(s => (
          <div key={s.label} style={{ flex: 1, background: `${s.col}0d`, border: `1px solid ${s.col}22`, borderRadius: 3, padding: "7px 0", textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 16, color: s.col, textShadow: `0 0 12px ${s.col}66` }}>{s.val}</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: "rgba(255,255,255,0.22)", letterSpacing: "0.15em", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {badges.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {badges.map(b => (
            <span key={b.icon} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", background: "rgba(0,255,160,0.06)", border: "1px solid rgba(0,255,160,0.15)", fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(0,255,200,0.75)", letterSpacing: "0.06em", borderRadius: 2 }}>
              {b.icon} {b.label}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 7 }}>
        {student.linkedin && (
          <a href={student.linkedin} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", padding: "6px 0", background: "rgba(0,100,255,0.08)", border: "1px solid rgba(0,100,255,0.25)", fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(80,160,255,0.8)", textDecoration: "none", letterSpacing: "0.08em", pointerEvents: "auto", borderRadius: 2 }}>
            LINKEDIN ↗
          </a>
        )}
        {student.github && (
          <a href={student.github} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: "center", padding: "6px 0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(200,200,200,0.7)", textDecoration: "none", letterSpacing: "0.08em", pointerEvents: "auto", borderRadius: 2 }}>
            GITHUB ↗
          </a>
        )}
        {!student.linkedin && !student.github && (
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em" }}>NO LINKS</span>
        )}
      </div>
    </div>
  );
}
