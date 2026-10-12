import { Glitch, Counter } from "./LeaderboardHelpers";
import UserLeaderboardPodium from "./UserLeaderboardPodium";
import { ZapIcon } from "./Icons";

export default function UserLeaderboardHero({
  showWelcome,
  exiting,
  typeText,
  handleEnter,
  sorted,
  top3,
  highestPts,
  totalPts,
  search,
  setSearch,
  sortBy,
  setSortBy,
  showTopOnly,
  setShowTopOnly,
  statsRef,
  statsVisible,
  podiumVisible,
  podiumRef,
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
              CodeCraft 2026
            </h2>
            <p style={{ color: "rgba(0,255,160,0.22)", fontSize: 9, letterSpacing: "0.3em", marginBottom: 52, fontFamily: "'Share Tech Mono',monospace" }}>
              VISHVESHWARYA GROUP OF INSTITUTION
            </p>
            <button className="enter-btn" onClick={handleEnter}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <ZapIcon size={16} /> BREACH SYSTEM
              </span>
            </button>
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

      <section className="hero-shell fu fu1">
        <div className="hero-kicker-wrap">
          <span className="live"><span className="live-dot" />LIVE UPLINK</span>
        </div>
        <p className="hero-eyebrow">∥ VISHVESHWARYA GROUP OF INSTITUTIONS ∥</p>
        <h1 className="hero-title">
          <Glitch style={{ color: "#00ffcc", textShadow: "0 0 22px #00ffcc77, 0 0 55px #00ffcc22" }}>IGNITE CLUB</Glitch>
        </h1>
        <h2 className="hero-subtitle">
          ▸ CodeCraft — NEURAL LEADERBOARD
        </h2>
        <UserLeaderboardPodium top3={top3} podiumVisible={podiumVisible} podiumRef={podiumRef} />
        {/* <p className="hero-description">A live snapshot of the club's builders, competitors, and rising problem-solvers.</p>
        <div className="div hero-divider" /> */}
      </section>

      <div className="fu fu2 stats-section">
        {/* <div className="stats-heading">
          <span>CLUB SNAPSHOT</span>
          <span className="stats-heading-status"><span className="stats-heading-dot" /> LIVE DATA</span>
        </div> */}
        <div ref={statsRef} className="stats-bar" style={{ opacity: statsVisible ? 1 : 0, transform: statsVisible ? "none" : "translateY(22px)", transition: "all 0.6s ease 0.1s" }}>
          <div className="stat-cell">
            {/* <div className="stat-v"><Counter value={sorted.length} visible={statsVisible} /></div>
            <div className="stat-l">ACTIVE MEMBERS</div> */}
          </div>
          <div className="stat-sep" />
          <div className="stat-cell stat-cell-highlight">
            {/* <div className="stat-v">{highestPts}</div>
            <div className="stat-l">HIGHEST XP</div> */}
          </div>
          <div className="stat-sep" />
          <div className="stat-cell">
            {/* <div className="stat-v">{totalPts}</div>
            <div className="stat-l">TOTAL XP</div> */}
          </div>
        </div>
      </div>

      <div className="leaderboard-tools">
        <div className="sort-control">
          <span>Sort</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="rank">RANK</option>
            <option value="xp">XP SCORE</option>
            <option value="name">NAME</option>
          </select>
        </div>

        <button
          className={`top-toggle${showTopOnly ? " is-active" : ""}`}
          type="button"
          onClick={() => setShowTopOnly(prev => !prev)}
        >
          {showTopOnly ? "SHOW ALL" : "TOP 10"}
        </button>
      </div>

      <div className="fu fu4 search-wrap">
        <div className="search-box">
          <span className="search-icon">⬡</span>
          {/* <input className="search-input" type="text" placeholder="SCAN BY ROLL / NAME..." value={search} onChange={e => setSearch(e.target.value)} /> */}
        </div>
      </div>
    </>
  );
}
