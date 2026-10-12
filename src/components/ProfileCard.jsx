import { useState, useEffect, useRef } from "react";
import { CloseIcon, RenderBadge } from "./Icons";

export default function ProfileCard({ student, badges = [], pos = { x: 0, y: 0 }, onClose, theme = "cyan" }) {
  if (!student) return null;
  const isRed = theme === "red";
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const backdropTouchRef = useRef(false);
  const [mountedAt] = useState(() => Date.now());

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initials = (student.name || "NA").split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const rankCol = student.rank === 1 ? "#ffd700" : student.rank === 2 ? "#c0c8d8" : student.rank === 3 ? "#cd7f32" : student.rank <= 5 ? (isRed ? "#ff7744" : "#00aaff") : (isRed ? "#ff4422" : "#00ffa0");
  const accentCol = isRed ? "#ff5533" : "#00ffa0";
  const borderCol = isRed ? "rgba(255,80,0,0.3)" : "rgba(0,255,160,0.25)";
  const bgGrad = isRed
    ? "linear-gradient(145deg,rgba(18,4,0,0.98),rgba(28,10,0,0.96))"
    : "linear-gradient(145deg,rgba(0,4,18,0.98),rgba(0,10,28,0.96))";
  const glowShadow = isRed
    ? "0 0 0 1px rgba(255,80,0,0.1),0 24px 64px rgba(0,0,0,0.9),0 0 40px rgba(255,60,0,0.15)"
    : "0 0 0 1px rgba(0,255,160,0.06),0 24px 64px rgba(0,0,0,0.9),0 0 40px rgba(0,255,160,0.12)";

  const clampedX = typeof window !== "undefined" ? Math.max(12, Math.min(pos.x + 18, window.innerWidth - 290)) : pos.x;
  const clampedY = typeof window !== "undefined" ? Math.max(12, Math.min(pos.y - 10, window.innerHeight - 360)) : pos.y;

  const handleBackdropPointerDown = (e) => {
    if (e.target === e.currentTarget) {
      backdropTouchRef.current = true;
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target !== e.currentTarget) return;
    if (Date.now() - mountedAt < 350) return;
    if (!backdropTouchRef.current) return;
    backdropTouchRef.current = false;
    onClose?.();
  };

  const cardContent = (
    <div
      onClick={e => e.stopPropagation()}
      onPointerDown={e => e.stopPropagation()}
      style={{
        position: isMobile ? "relative" : "fixed",
        left: isMobile ? "auto" : clampedX,
        top: isMobile ? "auto" : clampedY,
        zIndex: 9999,
        width: "100%",
        maxWidth: 284,
        background: bgGrad,
        border: borderCol,
        borderRadius: 4,
        padding: "20px 18px 16px",
        boxShadow: glowShadow,
        backdropFilter: "blur(24px)",
        pointerEvents: "auto",
        animation: "profIn 0.2s cubic-bezier(0.34,1.4,0.64,1) both",
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close profile"
        style={{
          position: "absolute", right: 10, top: 10, width: 28, height: 28,
          border: "1px solid rgba(255,255,255,0.12)", borderRadius: 3,
          background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.85)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 0, touchAction: "manipulation",
        }}
      >
        <CloseIcon size={14} />
      </button>

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg,transparent,${accentCol}88,transparent)`,
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 3, flexShrink: 0,
          background: `linear-gradient(135deg,${rankCol}33,${rankCol}11)`,
          border: `1px solid ${rankCol}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 15,
          color: rankCol, boxShadow: `0 0 18px ${rankCol}33`,
        }}>{initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 12,
            color: isRed ? "#ffe8e0" : "#e8fff4", letterSpacing: "0.04em", lineHeight: 1.3,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{student.name}</p>
          <p style={{
            fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
            color: isRed ? "rgba(255,100,60,0.6)" : "rgba(0,255,200,0.55)",
            marginTop: 3, letterSpacing: "0.08em",
          }}>
            {student.roll} {student.year ? `· Y${student.year}` : ""}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[{ label: "RANK", val: `#${student.rank}`, col: rankCol }, { label: "XP", val: student.points, col: accentCol }].map(s => (
          <div key={s.label} style={{ flex: 1, background: `${s.col}0d`, border: `1px solid ${s.col}22`, borderRadius: 3, padding: "7px 0", textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 16, color: s.col, textShadow: `0 0 12px ${s.col}66` }}>{s.val}</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {(badges || []).length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
          {badges.map((b, bi) => (
            <RenderBadge key={bi} badge={b} theme={isRed ? "red" : "cyan"} />
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 7 }}>
        {student.linkedin ? (
          <a
            href={student.linkedin}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1, textAlign: "center", padding: "7px 0",
              background: "rgba(0,100,255,0.08)", border: "1px solid rgba(0,100,255,0.25)",
              fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(80,160,255,0.9)",
              textDecoration: "none", letterSpacing: "0.08em", pointerEvents: "auto", borderRadius: 2,
            }}
          >
            LINKEDIN ↗
          </a>
        ) : null}
        {student.github ? (
          <a
            href={student.github}
            target="_blank"
            rel="noreferrer"
            style={{
              flex: 1, textAlign: "center", padding: "7px 0",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(220,220,220,0.85)",
              textDecoration: "none", letterSpacing: "0.08em", pointerEvents: "auto", borderRadius: 2,
            }}
          >
            GITHUB ↗
          </a>
        ) : null}
        {!student.linkedin && !student.github && (
          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>NO LINKS</span>
        )}
      </div>
    </div>
  );

  return (
    <div
      onClick={handleBackdropClick}
      onPointerDown={handleBackdropPointerDown}
      style={{
        position: "fixed",
        inset: 0,
        background: isMobile ? "rgba(0, 3, 8, 0.82)" : "rgba(0, 0, 0, 0.25)",
        backdropFilter: isMobile ? "blur(8px)" : "blur(1px)",
        WebkitBackdropFilter: isMobile ? "blur(8px)" : "blur(1px)",
        zIndex: 9998,
        display: isMobile ? "flex" : "block",
        alignItems: isMobile ? "center" : undefined,
        justifyContent: isMobile ? "center" : undefined,
        padding: isMobile ? 16 : 0,
      }}
    >
      {cardContent}
    </div>
  );
}
