import { useState } from "react";
import { useScrollReveal, SlotRank, rankGlow, LightningBorder } from "./SeniorLeaderboardHelpers";
import { RenderBadge, CopyIcon, CheckIcon, TrophyIcon, MedalIcon } from "./Icons";

// Red-themed terminal table row for desktop
export function SeniorTerminalRow({ item, index, medal, topScore, badges, rankDeltas, rankTrigger, onNameHover, onNameLeave, onNameSelect, onShare, copied }) {
  const [ref, visible] = useScrollReveal(0.04);
  const [hov, setHov] = useState(false);
  const rg = rankGlow(item.rank);
  const xpPct = topScore > 0 ? Math.max(0, Math.min(100, Math.round((item.points / topScore) * 100))) : 0;
  const delta = rankDeltas[item.roll];
  const hasDelta = delta?.hadPrev && delta.delta !== 0;

  return (
    <tr ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-36px)",
        transition: `opacity 0.5s ease ${index * 0.04}s, transform 0.6s cubic-bezier(0.34,1.2,0.64,1) ${index * 0.04}s`,
        background: hov ? "rgba(255,30,0,0.03)" : rg.bg, cursor: "default",
      }}
    >
      <td style={{ padding: "14px 16px", textAlign: "center", borderLeft: `3px solid ${hov ? rg.border : (item.rank <= 10 ? rg.border : "transparent")}`, transition: "border-color 0.3s" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          {medal ? (
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              {item.rank === 1 ? <TrophyIcon size={18} color="#ffd700" /> : <MedalIcon size={18} color={item.rank === 2 ? "#c0c8d8" : "#cd7f32"} />}
            </span>
          ) : (
            <SlotRank rank={item.rank} trigger={rankTrigger && visible} />
          )}
          {hasDelta && <span style={{ fontSize: 9, fontFamily: "'Share Tech Mono',monospace", color: delta.delta > 0 ? "#ff6644" : "#ff4466", textShadow: delta.delta > 0 ? "0 0 6px #ff664488" : "0 0 6px #ff446688" }}>{delta.delta > 0 ? `▲${delta.delta}` : `▼${Math.abs(delta.delta)}`}</span>}
        </div>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "center", fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: hov ? "#ff6644" : "rgba(255,100,60,0.45)", letterSpacing: "0.06em", transition: "color 0.2s" }}>{item.roll}</td>
      <td style={{ padding: "14px 16px" }}>
        <span
          onMouseEnter={e => onNameHover?.(item, { x: e.clientX, y: e.clientY })}
          onMouseMove={e => onNameHover?.(item, { x: e.clientX, y: e.clientY })}
          onMouseLeave={onNameLeave}
          onClick={e => { e.stopPropagation(); onNameSelect?.(item, { x: e.clientX, y: e.clientY }); }}
          style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: 600, fontSize: 14, color: hov ? "#ffe8e0" : "rgba(255,220,200,0.8)", transition: "color 0.2s", letterSpacing: "0.03em", cursor: "pointer", touchAction: "manipulation" }}
        >{item.name}</span>
        {(badges || []).length > 0 && (
          <span style={{ display: "inline-flex", gap: 5, marginLeft: 8, verticalAlign: "middle" }}>
            {(badges || []).map((b, bi) => <RenderBadge key={bi} badge={b} theme="red" />)}
          </span>
        )}
        {item.year && (
          <span style={{ display: "inline-block", marginLeft: 8, padding: "1px 7px", border: "1px solid rgba(255,80,0,0.25)", borderRadius: 2, fontSize: 9, color: "rgba(255,120,60,0.6)", fontFamily: "'Share Tech Mono',monospace", letterSpacing: "0.1em", verticalAlign: "middle" }}>Y{item.year}</span>
        )}
        <div style={{ marginTop: 5, height: 3, width: "100%", background: "rgba(255,60,0,0.07)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: visible ? `${xpPct}%` : "0%", background: `linear-gradient(90deg,${rg.bar},${rg.bar}88)`, borderRadius: 2, transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${index * 0.04 + 0.3}s`, boxShadow: `0 0 6px ${rg.bar}88` }} />
        </div>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <span className={item.points < 0 ? "sr-score-chip sr-score-chip-negative" : "sr-score-chip"}>{item.points}</span>
      </td>
      <td style={{ padding: "14px 16px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          {item.linkedin ? <a href={item.linkedin} target="_blank" rel="noreferrer" className="sr-lb-link sr-lb-link-orange">⬡ LI</a> : <span className="sr-lb-dash">—</span>}
          {item.github ? <a href={item.github} target="_blank" rel="noreferrer" className="sr-lb-link sr-lb-link-red">⬡ GH</a> : <span className="sr-lb-dash">—</span>}
          <button onClick={() => onShare(item)} className={`sr-share-btn${copied === item.roll ? " sr-share-btn--ok" : ""}`} title={copied === item.roll ? "Copied" : "Share"} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {copied === item.roll ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          </button>
        </div>
      </td>
    </tr>
  );
}

// Red-themed mobile card
export function SeniorMobileCard({ item, index, medal, topScore, badges, rankDeltas, rankTrigger, onNameSelect, onShare, copied }) {
  const [ref, visible] = useScrollReveal(0.04);
  const [hov, setHov] = useState(false);
  const rg = rankGlow(item.rank);
  const xpPct = topScore > 0 ? Math.max(0, Math.min(100, Math.round((item.points / topScore) * 100))) : 0;
  const delta = rankDeltas[item.roll];
  const hasDelta = delta?.hadPrev && delta.delta !== 0;

  return (
    <div ref={ref} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "rgba(14,4,0,0.88)", borderRadius: 4, padding: "14px 14px 12px",
        border: `1px solid ${hov ? rg.border + "88" : rg.border + "33"}`,
        boxShadow: hov ? `0 0 28px ${rg.bar}22,inset 0 0 24px ${rg.bar}08` : "none",
        backdropFilter: "blur(18px)", position: "relative", overflow: "hidden",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)",
        transition: `opacity 0.55s ease ${index * 0.05}s, transform 0.65s cubic-bezier(0.34,1.3,0.64,1) ${index * 0.05}s, box-shadow 0.3s`,
      }}
    >
      <LightningBorder active={hov} color={rg.bar} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, flexShrink: 0, minWidth: 28 }}>
            {medal ? (
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 24 }}>
                {item.rank === 1 ? <TrophyIcon size={20} color="#ffd700" /> : <MedalIcon size={20} color={item.rank === 2 ? "#c0c8d8" : "#cd7f32"} />}
              </span>
            ) : (
              <SlotRank rank={item.rank} trigger={rankTrigger && visible} />
            )}
            {hasDelta && <span style={{ fontSize: 9, fontFamily: "'Share Tech Mono',monospace", color: delta.delta > 0 ? "#ff6644" : "#ff4466" }}>{delta.delta > 0 ? `▲${delta.delta}` : `▼${Math.abs(delta.delta)}`}</span>}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              onClick={e => { e.stopPropagation(); onNameSelect?.(item, { x: e.clientX, y: e.clientY }); }}
              style={{ fontWeight: 700, fontSize: 14, color: "#ffe8e0", fontFamily: "'Share Tech Mono',monospace", cursor: "pointer", touchAction: "manipulation", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0 }}
            >
              {item.name}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 3 }}>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", color: "rgba(255,100,60,0.45)", fontSize: 11, letterSpacing: "0.06em" }}>{item.roll} {item.year ? `· Y${item.year}` : ""}</span>
              {(badges || []).length > 0 && (
                <span style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
                  {(badges || []).map((b, bi) => <RenderBadge key={bi} badge={b} theme="red" />)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0, marginLeft: 8 }}>
          <span className={item.points < 0 ? "sr-score-chip sr-score-chip-negative" : "sr-score-chip"} style={{ padding: "3px 10px", fontSize: 12 }}>
            {item.points} XP
          </span>
          <button onClick={() => onShare(item)} className={`sr-share-btn${copied === item.roll ? " sr-share-btn--ok" : ""}`} style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 10px", minHeight: 28, touchAction: "manipulation" }}>
            {copied === item.roll ? <><CheckIcon size={12} /> Copied</> : <><CopyIcon size={12} /> Share</>}
          </button>
        </div>
      </div>
      <div style={{ marginTop: 10, height: 3, background: "rgba(255,60,0,0.07)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: visible ? `${xpPct}%` : "0%", background: `linear-gradient(90deg,${rg.bar},${rg.bar}88)`, transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${index * 0.05 + 0.3}s`, boxShadow: `0 0 6px ${rg.bar}88` }} />
      </div>
      {(item.linkedin || item.github) && (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {item.linkedin && <a href={item.linkedin} target="_blank" rel="noreferrer" className="sr-lb-link sr-lb-link-orange" style={{ flex: 1, justifyContent: "center", minHeight: 34, touchAction: "manipulation" }}>⬡ LINKEDIN</a>}
          {item.github && <a href={item.github} target="_blank" rel="noreferrer" className="sr-lb-link sr-lb-link-red" style={{ flex: 1, justifyContent: "center", minHeight: 34, touchAction: "manipulation" }}>⬡ GITHUB</a>}
        </div>
      )}
    </div>
  );
}

