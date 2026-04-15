export default function UserLeaderboardFooter({ sorted, top3, totalPts, podiumRef }) {
  return (
    <footer className="lb-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h3>IGNITE_CLUB</h3>
          <p>BUGBYTE 2026<br />NEURAL LEADERBOARD<br />VISHVESHWARYA GROUP OF INSTITUTION</p>
          <div style={{ marginTop: 16, height: 1, background: "linear-gradient(90deg,rgba(0,255,160,0.3),transparent)" }} />
          <p style={{ marginTop: 12, fontSize: 10, color: "rgba(0,255,160,0.2)", letterSpacing: "0.08em" }}>TRACKING {sorted.length} OPERATIVES · {totalPts} TOTAL XP</p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>↑ Top of Leaderboard</a>
          <a href="#" onClick={e => { e.preventDefault(); podiumRef.current?.scrollIntoView({ behavior: "smooth" }); }}>◈ Elite Podium</a>
          <span style={{ cursor: "default" }}>⬡ Search Operatives</span>
          <a href="https://www.linkedin.com/in/aarav-kumar-77494030a/" target="_blank" rel="noreferrer">✉ Contact Admin</a>
        </div>

        <div className="footer-col">
          <h4>Live Stats</h4>
          <div className="footer-stat">
            <div className="footer-stat-item"><span className="k">OPERATIVES</span><span className="v">{sorted.length}</span></div>
            <div className="footer-stat-item"><span className="k">TOP SCORE</span><span className="v">{top3[0]?.points || 0}</span></div>
            <div className="footer-stat-item"><span className="k">TOTAL XP</span><span className="v">{totalPts}</span></div>
            <div className="footer-stat-item"><span className="k">LEADER</span><span className="v" style={{ fontSize: 10 }}>{top3[0]?.name?.split(" ")[0] || "—"}</span></div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 IGNITE CLUB — BUGBYTE · ALL NODES SECURED</p>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/aarav-kumar-77494030a/" target="_blank" rel="noreferrer">⬡ LINKEDIN</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">⬡ GITHUB</a>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>↑ BACK TO TOP</a>
        </div>
      </div>
    </footer>
  );
}
