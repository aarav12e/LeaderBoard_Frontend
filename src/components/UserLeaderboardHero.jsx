import { Glitch, Counter } from "./LeaderboardHelpers";

export default function UserLeaderboardHero({
  showWelcome,
  exiting,
  typeText,
  handleEnter,
  sorted,
  top3,
  totalPts,
  search,
  setSearch,
  sortBy,
  setSortBy,
  showTopOnly,
  setShowTopOnly,
  statsRef,
  statsVisible,
}) {
  return (
    <>
      {showWelcome && (
        <div className={`wl${exiting ? " exit" : ""}`}>
          <div className="wl-scan" />
          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />
          <div style={{ textAlign: "center", padding: "0 28px", position: "relative", zIndex: 1 }}>
            <div className="typewriter">{typeText}<span className="cursor" /></div>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(30px,8vw,68px)", lineHeight: 1, marginBottom: 10, letterSpacing: "0.06em" }}>
              <Glitch style={{ color: "#00ffcc", textShadow: "0 0 30px #00ffcc88, 0 0 80px #00ffcc22" }}>IGNITE CLUB</Glitch>
            </h1>
            <h2 style={{ fontFamily: "'VT323',monospace", fontSize: "clamp(22px,5vw,42px)", color: "#00aaff", textShadow: "0 0 20px #00aaff77", marginBottom: 10, letterSpacing: "0.1em" }}>
              BUGBYTE 2026 🎉
            </h2>
            <p style={{ color: "rgba(0,255,160,0.22)", fontSize: 9, letterSpacing: "0.3em", marginBottom: 52, fontFamily: "'Share Tech Mono',monospace" }}>
              VISHVESHWARYA GROUP OF INSTITUTION
            </p>
            <button className="enter-btn" onClick={handleEnter}><span>⚡ BREACH SYSTEM</span></button>
          </div>
        </div>
      )}

      {!showWelcome && sorted.length > 0 && (
        <div className="ticker">
          <div className="ticker-t">
            {[...Array(2)].flatMap((_, ri) =>
              sorted.map((s, si) => (
                <span key={`${ri}-${si}`} className="tick-i">
                  #{s.rank} {s.name} <span style={{ color: "rgba(0,170,255,0.45)" }}>◈</span> {s.points} XP <span style={{ color: "rgba(0,255,100,0.28)" }}>∥</span>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      <div className="fu fu1" style={{ textAlign: "center", marginBottom: 46 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <span className="live"><span className="live-dot" />LIVE UPLINK</span>
        </div>
        <p style={{ color: "rgba(0,255,160,0.2)", fontSize: 9, letterSpacing: "0.32em", marginBottom: 18, fontFamily: "'Share Tech Mono',monospace" }}>∥ VISHVESHWARYA GROUP OF INSTITUTION ∥</p>
        <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(26px,6.5vw,58px)", lineHeight: 1.05, marginBottom: 12 }}>
          <Glitch style={{ color: "#00ffcc", textShadow: "0 0 22px #00ffcc77, 0 0 55px #00ffcc22" }}>IGNITE CLUB</Glitch>
        </h1>
        <h2 style={{ fontFamily: "'VT323',monospace", fontSize: "clamp(16px,3.5vw,28px)", color: "#00aaff", textShadow: "0 0 18px #00aaff66", marginBottom: 24, letterSpacing: "0.1em" }}>
          ▸ BUGBYTE — NEURAL LEADERBOARD
        </h2>
        <div className="div" style={{ maxWidth: 460 }} />
      </div>

      <div className="fu fu2" style={{ marginBottom: 50 }}>
        <div ref={statsRef} className="stats-bar" style={{ opacity: statsVisible ? 1 : 0, transform: statsVisible ? "none" : "translateY(22px)", transition: "all 0.6s ease 0.1s" }}>
          <div style={{ textAlign: "center" }}>
            <div className="stat-v"><Counter value={sorted.length} visible={statsVisible} /></div>
            <div className="stat-l">OPERATIVES</div>
          </div>
          <div className="stat-sep" />
          <div style={{ textAlign: "center" }}>
            <div className="stat-v"><Counter value={top3[0]?.points || 0} visible={statsVisible} /></div>
            <div className="stat-l">TOP SCORE</div>
          </div>
          <div className="stat-sep" />
          <div style={{ textAlign: "center" }}>
            <div className="stat-v"><Counter value={totalPts} visible={statsVisible} /></div>
            <div className="stat-l">TOTAL XP</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(0,4,14,0.78)", border: "1px solid rgba(0,255,160,0.12)", borderRadius: 4, padding: "10px 12px" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.18em", color: "rgba(0,255,160,0.35)", textTransform: "uppercase" }}>Sort</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ background: "transparent", border: "1px solid rgba(0,255,160,0.15)", color: "#e8fff4", padding: "8px 10px", borderRadius: 3, fontFamily: "'Share Tech Mono',monospace", fontSize: 12, outline: "none", minWidth: 130 }}
          >
            <option value="rank">RANK</option>
            <option value="xp">XP SCORE</option>
            <option value="name">NAME</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowTopOnly(prev => !prev)}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "10px 16px", borderRadius: 3, border: "1px solid rgba(0,255,160,0.18)", background: showTopOnly ? "#00ffcc" : "rgba(0,255,160,0.08)", color: showTopOnly ? "#000308" : "#00ffcc", fontFamily: "'Share Tech Mono',monospace", fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer", transition: "all 0.2s" }}
        >
          {showTopOnly ? "SHOW ALL" : "TOP 10"}
        </button>
      </div>

      <div className="fu fu4 search-wrap" style={{ marginBottom: 30 }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 540 }}>
          <span className="search-icon">⬡</span>
          <input className="search-input" type="text" placeholder="SCAN BY ROLL / NAME..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
    </>
  );
}
