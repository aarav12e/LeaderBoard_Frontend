import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";
import UserLeaderboardHero from "../components/UserLeaderboardHero";
import UserLeaderboardPodium from "../components/UserLeaderboardPodium";
import UserLeaderboardFooter from "../components/UserLeaderboardFooter";
import { TerminalRow, MobileCard } from "../components/Table";
import ProfileCard from "../components/ProfileCard";
import { SpaceCanvas, MatrixRain, CursorTrail } from "../components/LeaderboardEffects";
import { useScrollReveal, computeGameData } from "../components/LeaderboardHelpers";

export default function UserLeaderboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [podiumVisible, setPodiumVisible] = useState(false);
  const [rankTrigger, setRankTrigger] = useState(false);
  const [badges, setBadges] = useState({});
  const [rankDeltas, setRankDeltas] = useState({});
  const [profileTarget, setProfileTarget] = useState(null);
  const [copied, setCopied] = useState("");
  const [typeText, setTypeText] = useState("");
  const podiumRef = useRef(null);

  const handleProfileClose = () => setProfileTarget(null);
  const handleProfileOpen = (student, pos) => setProfileTarget({ student, pos, badges: badges[student.roll] || [] });
  const [statsRef, statsVisible] = useScrollReveal(0.1);
  const fullText = "> ACCESSING IGNITE_CLUB.DB... [OK]\n> DECRYPTING BUGBYTE RANKINGS... [OK]\n> NEURAL LINK ESTABLISHED......... [GO]";

  useEffect(() => { api.get("/students").then(res => setData(res.data)); }, []);

  useEffect(() => {
    if (!data.length) return;
    const s = [...data].sort((a, b) => a.rank - b.rank);
    const { deltas, badges: b } = computeGameData(s);
    setRankDeltas(deltas);
    setBadges(b);
  }, [data]);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTypeText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(iv);
    }, 26);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setPodiumVisible(true);
        setTimeout(() => setRankTrigger(true), 400);
      }
    }, { threshold: 0.15 });
    if (podiumRef.current) obs.observe(podiumRef.current);
    return () => obs.disconnect();
  }, [data]);

  const handleEnter = () => {
    try { window.speechSynthesis.speak(new SpeechSynthesisUtterance("Welcome to Ignite Club BugByte")); } catch (_) {}
    setExiting(true);
    setTimeout(() => setShowWelcome(false), 720);
  };

  const shareRank = item => {
    const text = `I'm #${item.rank} on BugByte 2026 Leaderboard with ${item.points} XP! 🔥 ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(item.roll);
      setTimeout(() => setCopied(""), 1800);
    });
  };

  const sorted = [...data].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);
  const filtered = sorted.filter(s => s.roll.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));
  const medal = r => r === 1 ? "🥇" : r === 2 ? "🥈" : r === 3 ? "🥉" : null;
  const totalPts = sorted.reduce((sum, d) => sum + (d.points || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{cursor:none!important;background:#000308}

        .lb{font-family:'Share Tech Mono',monospace;background:#000308;min-height:100vh;overflow-x:hidden;color:#e0ffe8;position:relative}

        .wl{position:fixed;inset:0;z-index:200;background:#000308;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity 0.7s,transform 0.7s cubic-bezier(0.4,0,0.2,1)}
        .wl.exit{opacity:0;transform:scale(1.1) rotateX(10deg);pointer-events:none}
        .wl-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#00ffcc,#00aaff,transparent);animation:scan 2.5s linear infinite}
        @keyframes scan{from{top:-2px}to{top:100%}}
        .corner{position:absolute;width:28px;height:28px;border-color:#00ffcc44;border-style:solid;animation:cPulse 2s ease-in-out infinite}
        .corner.tl{top:18px;left:18px;border-width:2px 0 0 2px}
        .corner.tr{top:18px;right:18px;border-width:2px 2px 0 0}
        .corner.bl{bottom:18px;left:18px;border-width:0 0 2px 2px}
        .corner.br{bottom:18px;right:18px;border-width:0 2px 2px 0}
        @keyframes cPulse{0%,100%{border-color:#00ffcc22}50%{border-color:#00ffcc}}

        .enter-btn{font-family:'Orbitron',monospace;font-weight:900;font-size:clamp(11px,2vw,14px);letter-spacing:0.22em;padding:16px clamp(28px,5vw,60px);border-radius:2px;border:1px solid #00ffcc;background:transparent;color:#00ffcc;cursor:none;position:relative;overflow:hidden;z-index:1;text-shadow:0 0 12px #00ffcc;box-shadow:0 0 24px #00ffcc33,inset 0 0 24px #00ffcc08;transition:all 0.35s;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);animation:btnPulse 2s ease-in-out infinite}
        @keyframes btnPulse{0%,100%{box-shadow:0 0 24px #00ffcc33,inset 0 0 24px #00ffcc08}50%{box-shadow:0 0 48px #00ffcc66,inset 0 0 32px #00ffcc18}}
        .enter-btn::before{content:'';position:absolute;inset:0;background:#00ffcc;transform:translateX(-110%);transition:transform 0.4s ease;z-index:-1}
        .enter-btn:hover{color:#000308;text-shadow:none;box-shadow:0 0 50px #00ffcc99;animation:none}
        .enter-btn:hover::before{transform:translateX(0)}

        .typewriter{font-family:'Share Tech Mono',monospace;font-size:12px;color:rgba(0,255,200,0.55);text-align:left;line-height:2;letter-spacing:0.07em;white-space:pre;min-height:58px;margin-bottom:44px}
        .cursor{display:inline-block;width:8px;height:14px;background:#00ffcc;animation:blink 0.75s step-end infinite;vertical-align:bottom}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

        .lb-inner{position:relative;z-index:3;max-width:1160px;margin:0 auto;padding:clamp(16px,4vw,52px) clamp(12px,3vw,36px) 0}

        @keyframes g1{0%,90%,100%{opacity:0;transform:translateX(0)}91%{opacity:0.85;transform:translateX(-4px)}95%{opacity:0.5;transform:translateX(2px)}}
        @keyframes g2{0%,86%,100%{opacity:0;transform:translateX(0)}87%{opacity:0.75;transform:translateX(4px)}92%{opacity:0.4;transform:translateX(-2px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.8s cubic-bezier(0.34,1.2,0.64,1) both}
        .fu1{animation-delay:0.1s}.fu2{animation-delay:0.28s}.fu3{animation-delay:0.44s}.fu4{animation-delay:0.6s}
        @keyframes scanCard{0%{top:-4px}100%{top:105%}}
        @keyframes sparkOut{0%{opacity:1}100%{opacity:0;transform:translateX(80px) scale(0)}}
        @keyframes profIn{from{opacity:0;transform:translateY(8px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}

        .live{display:inline-flex;align-items:center;gap:7px;padding:5px 16px;border-radius:2px;background:rgba(0,255,160,0.05);border:1px solid rgba(0,255,160,0.22);font-size:9px;color:#00ffa0;letter-spacing:0.22em;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)}
        .live-dot{width:7px;height:7px;border-radius:50%;background:#00ffa0;animation:ldot 1.2s ease-in-out infinite;box-shadow:0 0 8px #00ffa0}
        @keyframes ldot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.7);opacity:0.4}}

        .ticker{overflow:hidden;border-top:1px solid rgba(0,255,160,0.07);border-bottom:1px solid rgba(0,255,160,0.07);padding:10px 0;background:rgba(0,255,160,0.018)}
        .ticker-t{display:flex;gap:72px;animation:tick 32s linear infinite;white-space:nowrap}
        @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .tick-i{font-size:11px;color:rgba(0,255,160,0.38);letter-spacing:0.12em;flex-shrink:0}

        .div{height:1px;background:linear-gradient(90deg,transparent,#00ffcc66,#00aaff44,transparent);margin:0 auto;animation:divGlow 3s ease-in-out infinite alternate}
        @keyframes divGlow{0%{opacity:0.5}100%{opacity:1;filter:blur(0.5px)}}

        .stats-bar{display:flex;justify-content:center;gap:clamp(20px,4vw,70px);padding:22px 32px;border-radius:2px;background:rgba(0,4,14,0.72);border:1px solid rgba(0,255,160,0.09);backdrop-filter:blur(14px);clip-path:polygon(14px 0%,100% 0%,calc(100% - 14px) 100%,0% 100%)}
        .stat-v{font-family:'Orbitron',monospace;font-size:clamp(20px,3vw,32px);font-weight:900;color:#00ffcc;text-shadow:0 0 24px #00ffcc66}
        .stat-l{font-size:8px;color:rgba(0,255,160,0.28);letter-spacing:0.2em;margin-top:4px}
        .stat-sep{width:1px;background:rgba(0,255,160,0.1);align-self:stretch}

        .search-wrap{display:flex;justify-content:center;position:sticky;top:12px;z-index:40}
        .search-input{width:100%;max-width:540px;background:rgba(0,4,14,0.88);border:1px solid rgba(0,255,160,0.16);border-radius:2px;padding:13px 20px 13px 46px;color:#e0ffe8;font-size:13px;outline:none;backdrop-filter:blur(20px);font-family:'Share Tech Mono',monospace;letter-spacing:0.05em;transition:all 0.3s;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)}
        .search-input::placeholder{color:rgba(0,255,160,0.18)}
        .search-input:focus{border-color:rgba(0,255,160,0.48);box-shadow:0 0 0 2px rgba(0,255,160,0.07),0 0 32px rgba(0,255,160,0.1);background:rgba(0,8,22,0.92)}
        .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(0,255,160,0.32);font-size:15px;pointer-events:none}

        .card-wrap{background:rgba(0,4,14,0.72);border:1px solid rgba(0,255,160,0.09);border-radius:2px;overflow:hidden;backdrop-filter:blur(18px);box-shadow:0 0 60px rgba(0,255,160,0.03),inset 0 1px 0 rgba(0,255,160,0.05);position:relative}
        .card-wrap::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(0,255,160,0.012) 26px,rgba(0,255,160,0.012) 27px);pointer-events:none;z-index:0}
        .lb-table{width:100%;border-collapse:separate;border-spacing:0 3px;padding:10px 14px;position:relative;z-index:1}
        .lb-table thead th{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:0.24em;color:rgba(0,255,160,0.32);padding:14px 18px;text-align:left;border-bottom:1px solid rgba(0,255,160,0.06)}
        .lb-table thead th.c{text-align:center}
        .lb-table tbody tr{transition:background 0.2s,transform 0.15s;cursor:none}
        .lb-table tbody tr:hover{transform:translateX(3px)}

        .lb-link{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:2px;font-size:11px;font-family:'Share Tech Mono',monospace;text-decoration:none;transition:all 0.22s;letter-spacing:0.06em;border:1px solid;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)}
        .lb-link-blue{border-color:rgba(0,170,255,0.2);color:rgba(0,170,255,0.6);background:rgba(0,170,255,0.04)}
        .lb-link-blue:hover{border-color:rgba(0,170,255,0.6);color:#00aaff;background:rgba(0,170,255,0.1);box-shadow:0 0 14px rgba(0,170,255,0.25)}
        .lb-link-green{border-color:rgba(0,255,160,0.2);color:rgba(0,255,160,0.6);background:rgba(0,255,160,0.04)}
        .lb-link-green:hover{border-color:rgba(0,255,160,0.6);color:#00ffa0;background:rgba(0,255,160,0.1);box-shadow:0 0 14px rgba(0,255,160,0.25)}
        .lb-dash{color:rgba(255,255,255,0.07);font-family:'Share Tech Mono',monospace;font-size:12px}

        .lb-share-btn{background:rgba(0,255,160,0.06);border:1px solid rgba(0,255,160,0.18);color:rgba(0,255,160,0.5);font-family:'Share Tech Mono',monospace;font-size:13px;padding:4px 9px;border-radius:3px;cursor:pointer;transition:all 0.2s;line-height:1}
        .lb-share-btn:hover{background:rgba(0,255,160,0.12);border-color:rgba(0,255,160,0.5);color:#00ffa0;box-shadow:0 0 10px rgba(0,255,160,0.25)}
        .lb-share-btn--ok{background:rgba(0,255,160,0.15);border-color:#00ffa0;color:#00ffa0;box-shadow:0 0 14px rgba(0,255,160,0.4)}

        .desktop{display:none}.mobile{display:flex;flex-direction:column;gap:10px}
        @media(min-width:768px){.desktop{display:block}.mobile{display:none}}

        .lb-footer{position:relative;z-index:3;margin-top:72px;border-top:1px solid rgba(0,255,160,0.08);background:rgba(0,2,10,0.85);backdrop-filter:blur(20px)}
        .footer-top{display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;padding:48px clamp(16px,5vw,72px) 36px}
        @media(max-width:640px){.footer-top{grid-template-columns:1fr;gap:28px;padding:36px 20px 28px}}
        .footer-brand h3{font-family:'Orbitron',monospace;font-weight:900;font-size:16px;color:#00ffcc;letter-spacing:0.14em;text-shadow:0 0 18px #00ffcc55;margin-bottom:6px}
        .footer-brand p{font-size:11px;color:rgba(0,255,160,0.35);letter-spacing:0.1em;line-height:1.8}
        .footer-col h4{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:0.22em;color:rgba(0,255,160,0.4);margin-bottom:14px;text-transform:uppercase}
        .footer-col a,.footer-col span{display:block;font-size:12px;color:rgba(0,255,160,0.5);text-decoration:none;padding:5px 0;border-bottom:1px solid rgba(0,255,160,0.06);transition:color 0.2s,padding-left 0.2s;letter-spacing:0.05em}
        .footer-col a:hover{color:#00ffcc;padding-left:8px}
        .footer-stat{display:flex;flex-direction:column;gap:10px}
        .footer-stat-item{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(0,255,160,0.04);border:1px solid rgba(0,255,160,0.09);border-radius:2px}
        .footer-stat-item .k{font-size:10px;color:rgba(0,255,160,0.4);letter-spacing:0.12em}
        .footer-stat-item .v{font-family:'Orbitron',monospace;font-size:13px;color:#00ffcc;font-weight:700}
        .footer-bottom{display:flex;align-items:center;justify-content:space-between;padding:16px clamp(16px,5vw,72px);border-top:1px solid rgba(0,255,160,0.06);flex-wrap:wrap;gap:12px}
        @media(max-width:640px){.footer-bottom{flex-direction:column;align-items:flex-start}}
        .footer-bottom p{font-size:11px;color:rgba(0,255,160,0.22);letter-spacing:0.1em}
        .footer-socials{display:flex;gap:10px}
        .footer-socials a{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border:1px solid rgba(0,255,160,0.15);border-radius:2px;font-size:10px;color:rgba(0,255,160,0.45);text-decoration:none;letter-spacing:0.1em;transition:all 0.2s;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)}
        .footer-socials a:hover{background:rgba(0,255,160,0.08);border-color:rgba(0,255,160,0.4);color:#00ffcc}

        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#000308}
        ::-webkit-scrollbar-thumb{background:rgba(0,255,160,0.18);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(0,255,160,0.4)}
      `}</style>

      <div className="lb" onMouseLeave={() => setProfileTarget(null)} onPointerDown={handleProfileClose}>
        <SpaceCanvas />
        <MatrixRain />
        <CursorTrail />

        <UserLeaderboardHero
          showWelcome={showWelcome}
          exiting={exiting}
          typeText={typeText}
          handleEnter={handleEnter}
          sorted={sorted}
          top3={top3}
          totalPts={totalPts}
          search={search}
          setSearch={setSearch}
          statsRef={statsRef}
          statsVisible={statsVisible}
        />

        <div className="lb-inner">
          <UserLeaderboardPodium top3={top3} podiumVisible={podiumVisible} podiumRef={podiumRef} />

          <div className="desktop">
            <div className="card-wrap">
              <svg style={{ position: "absolute", width: 0, height: 0 }}>
                <defs><filter id="lg"><feGaussianBlur stdDeviation="1.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
              </svg>
              <table className="lb-table">
                <thead>
                  <tr>
                    <th className="c" style={{ width: 72 }}>RANK</th>
                    <th className="c">NODE_ID</th>
                    <th>OPERATIVE</th>
                    <th className="c">XP_SCORE</th>
                    <th className="c">LINKS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, i) => (
                    <TerminalRow
                      key={item._id}
                      item={item}
                      index={i}
                      medal={medal(item.rank)}
                      topScore={sorted[0]?.points || 0}
                      badges={badges[item.roll] || []}
                      rankDeltas={rankDeltas}
                      rankTrigger={rankTrigger}
                      onNameHover={(student, pos) => handleProfileOpen(student, pos)}
                      onNameLeave={handleProfileClose}
                      onNameSelect={(student, pos) => handleProfileOpen(student, pos)}
                      onShare={shareRank}
                      copied={copied}
                    />
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "52px 0", color: "rgba(0,255,160,0.18)", fontFamily: "'Share Tech Mono',monospace", fontSize: 12, letterSpacing: "0.18em" }}>
                        ◈ NO SIGNAL DETECTED ◈
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mobile">
            {filtered.map((item, i) => (
              <MobileCard
                key={item._id}
                item={item}
                onNameSelect={(student, pos) => handleProfileOpen(student, pos)}
                index={i}
                medal={medal(item.rank)}
                topScore={sorted[0]?.points || 0}
                badges={badges[item.roll] || []}
                rankDeltas={rankDeltas}
                rankTrigger={rankTrigger}
                onShare={shareRank}
                copied={copied}
              />
            ))}
            {filtered.length === 0 && (
              <p style={{ textAlign: "center", color: "rgba(0,255,160,0.18)", marginTop: 52, letterSpacing: "0.18em", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 }}>
                ◈ NO SIGNAL DETECTED ◈
              </p>
            )}
          </div>
        </div>

        {profileTarget && <ProfileCard student={profileTarget.student} badges={profileTarget.badges} pos={profileTarget.pos} onClose={handleProfileClose} />}

        <UserLeaderboardFooter sorted={sorted} top3={top3} totalPts={totalPts} podiumRef={podiumRef} />
      </div>
    </>
  );
}
