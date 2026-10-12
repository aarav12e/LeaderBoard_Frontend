import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import SeniorLeaderboardNav from "../components/SeniorLeaderboardNav";
import SeniorLeaderboardPodium from "../components/SeniorLeaderboardPodium";
import UserLeaderboardFooter from "../components/UserLeaderboardFooter";
import { SeniorTerminalRow, SeniorMobileCard } from "../components/SeniorTable";
import { SeniorSpaceCanvas, SeniorMatrixRain } from "../components/SeniorLeaderboardEffects";
import { useScrollReveal, Glitch, computeGameData } from "../components/SeniorLeaderboardHelpers";
import ProfileCard from "../components/ProfileCard";
import { playWelcomeVoice } from "../utils/voice";
import { ZapIcon } from "../components/Icons";

function SeniorLeaderboardSkeleton() {
  return (
    <div className="sr-skeleton" aria-label="Loading senior leaderboard" role="status">
      {Array.from({ length: 5 }, (_, i) => (
        <div className="sr-skeleton-row" key={i}>
          <span className="sr-skeleton-block sr-skeleton-rank" />
          <span className="sr-skeleton-block sr-skeleton-name" />
          <span className="sr-skeleton-block sr-skeleton-score" />
        </div>
      ))}
    </div>
  );
}

export default function SeniorLeaderBoard() {
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
  const [isLoading, setIsLoading] = useState(true);
  const podiumRef = useRef(null);
  const [statsRef, statsVisible] = useScrollReveal(0.1);
  const fullText = "> ACCESSING SENIOR_IGNITE.DB... [OK]\n> DECRYPTING SENIOR RANKINGS... [OK]\n> NEURAL LINK ESTABLISHED... [GO]";

  const fetchStudents = () => {
    setIsLoading(true);
    api.get("/senior-students")
      .then(res => setData(res.data.map(student => {
        const points = Number(student.points);
        return { ...student, points: Number.isFinite(points) ? points : 0 };
      })))
      .catch(() => setData([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

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
    playWelcomeVoice();
    setExiting(true);
    setTimeout(() => setShowWelcome(false), 720);
  };

  const [profilePinned, setProfilePinned] = useState(false);

  const handleProfileClose = () => {
    setProfileTarget(null);
    setProfilePinned(false);
  };
  const handleProfileHover = (student, pos) => {
    if (profilePinned) return;
    setProfileTarget({ student, pos, badges: badges[student.roll] || [] });
  };
  const handleProfileLeave = () => {
    if (profilePinned) return;
    setProfileTarget(null);
  };
  const handleProfileSelect = (student, pos) => {
    setProfilePinned(true);
    setProfileTarget({ student, pos, badges: badges[student.roll] || [] });
  };

  const shareRank = async item => {
    const text = `I'm #${item.rank} on Senior Leaderboard 2026 with ${item.points} XP! ${window.location.href}`;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopied(item.roll);
      setTimeout(() => setCopied(""), 1800);
    } catch {
      window.prompt("Copy your leaderboard result:", text);
    }
  };

  const sorted = [...data].sort((a, b) => a.rank - b.rank);
  const top3 = sorted.slice(0, 3);
  const searchLower = search.toLowerCase();
  const searched = sorted.filter(s =>
    s.roll.toLowerCase().includes(searchLower) ||
    s.name.toLowerCase().includes(searchLower)
  );
  const filtered = searched;
  const medal = r => (r <= 3 ? r : null);
  const highestPts = sorted.length ? sorted.reduce((h, s) => Math.max(h, Number(s.points) || 0), Number.NEGATIVE_INFINITY) : 0;
  const totalPts = sorted.reduce((sum, s) => sum + (Number(s.points) || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:#080003}

        .sr-lb{font-family:'Share Tech Mono',monospace;background:#080003;min-height:100vh;overflow-x:hidden;color:#ffe8e0;position:relative}
        .sr-lb::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:1;background:linear-gradient(rgba(255,60,0,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,80,0,0.015) 1px,transparent 1px);background-size:64px 64px;mask-image:linear-gradient(to bottom,rgba(0,0,0,0.8),transparent 72%)}
        .sr-lb::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(circle at 50% 0%,rgba(167,40,0,0.16),transparent 36%),radial-gradient(circle at 88% 72%,rgba(255,60,0,0.06),transparent 24%)}

        /* Welcome overlay */
        .sr-wl{position:fixed;inset:0;z-index:200;background:#080003;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity 0.7s,transform 0.7s cubic-bezier(0.4,0,0.2,1);overflow-y:auto;padding:24px 16px;-webkit-overflow-scrolling:touch}
        .sr-wl.exit{opacity:0;transform:scale(1.1) rotateX(10deg);pointer-events:none}
        .sr-wl-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#ff4400,#ff8800,transparent);animation:srScan 2.5s linear infinite;pointer-events:none}
        @keyframes srScan{from{top:-2px}to{top:100%}}
        .sr-corner{position:absolute;width:28px;height:28px;border-color:#ff440044;border-style:solid;animation:srCPulse 2s ease-in-out infinite}
        .sr-corner.tl{top:18px;left:18px;border-width:2px 0 0 2px}
        .sr-corner.tr{top:18px;right:18px;border-width:2px 2px 0 0}
        .sr-corner.bl{bottom:18px;left:18px;border-width:0 0 2px 2px}
        .sr-corner.br{bottom:18px;right:18px;border-width:0 2px 2px 0}
        @keyframes srCPulse{0%,100%{border-color:#ff440022}50%{border-color:#ff4400}}

        .sr-enter-btn{font-family:'Orbitron',monospace;font-weight:900;font-size:clamp(11px,2vw,14px);letter-spacing:0.22em;padding:16px clamp(28px,5vw,60px);border-radius:2px;border:1px solid #ff4400;background:transparent;color:#ff4400;cursor:pointer;position:relative;overflow:hidden;z-index:1;text-shadow:0 0 12px #ff4400;box-shadow:0 0 24px #ff440033,inset 0 0 24px #ff440008;transition:all 0.35s;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);animation:srBtnPulse 2s ease-in-out infinite}
        @keyframes srBtnPulse{0%,100%{box-shadow:0 0 24px #ff440033,inset 0 0 24px #ff440008}50%{box-shadow:0 0 48px #ff440066,inset 0 0 32px #ff440018}}
        .sr-enter-btn::before{content:'';position:absolute;inset:0;background:#ff4400;transform:translateX(-110%);transition:transform 0.4s ease;z-index:-1}
        .sr-enter-btn:hover{color:#080003;text-shadow:none;box-shadow:0 0 50px #ff440099;animation:none}
        .sr-enter-btn:hover::before{transform:translateX(0)}

        .sr-typewriter{font-family:'Share Tech Mono',monospace;font-size:12px;color:rgba(255,100,60,0.55);text-align:left;line-height:2;letter-spacing:0.07em;white-space:pre;min-height:58px;margin-bottom:44px}
        .sr-cursor{display:inline-block;width:8px;height:14px;background:#ff4400;animation:srBlink 0.75s step-end infinite;vertical-align:bottom}
        @media(max-width:767px){.sr-cursor{display:none!important}}
        @keyframes srBlink{0%,100%{opacity:1}50%{opacity:0}}

        .sr-lb-inner{position:relative;z-index:3;max-width:1160px;margin:0 auto;padding:0 clamp(12px,3vw,36px)}

        /* Nav */
        .sr-leader-nav{position:sticky;top:14px;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:20px;max-width:1160px;margin:0 auto;padding:10px clamp(14px,3vw,24px);background:rgba(23,4,0,0.78);border:1px solid rgba(255,60,0,0.16);backdrop-filter:blur(20px);box-shadow:0 12px 36px rgba(0,0,0,0.22)}
        .sr-leader-brand{display:flex;align-items:center;gap:10px;color:#ffe8e0;text-decoration:none;min-width:max-content}
        .sr-leader-brand-mark{display:grid;place-items:center;width:30px;height:30px;border:1px solid #ff4400;color:#ff4400;font-family:'Orbitron',monospace;font-weight:900;font-size:16px;box-shadow:0 0 14px rgba(255,68,0,0.22)}
        .sr-leader-brand strong{display:block;color:#ff4400;font-family:'Orbitron',monospace;font-size:12px;letter-spacing:0.16em;line-height:1}
        .sr-leader-brand small{display:block;margin-top:4px;color:rgba(255,220,200,0.4);font-size:8px;letter-spacing:0.12em}
        .sr-leader-nav-links{display:flex;align-items:center;gap:clamp(14px,2.6vw,30px)}
        .sr-leader-nav-links a{color:rgba(255,220,200,0.6);font-size:11px;letter-spacing:0.08em;text-decoration:none;transition:color 0.2s}
        .sr-leader-nav-links a:hover{color:#ff4400}
        .sr-nav-switch-link{padding:6px 14px!important;border:1px solid rgba(255,60,0,0.3)!important;border-radius:2px;background:rgba(255,60,0,0.05)!important;color:rgba(255,120,60,0.7)!important;transition:all 0.2s!important}
        .sr-nav-switch-link:hover{background:rgba(255,60,0,0.12)!important;border-color:rgba(255,60,0,0.6)!important;color:#ff6644!important}
        .sr-leader-menu-button{display:none;background:transparent;border:1px solid rgba(255,60,0,0.25);color:#ff4400;padding:8px;cursor:pointer}
        .sr-leader-menu-button span{display:block;width:17px;height:1px;margin:3px;background:currentColor;transition:transform 0.2s}
        .sr-leader-menu-button b{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}

        /* Hero */
        .sr-hero-shell{text-align:center;margin-bottom:0}
        .sr-hero-kicker-wrap{display:flex;justify-content:center;margin-bottom:22px}
        .sr-hero-eyebrow{color:rgba(255,80,0,0.38);font-size:clamp(8px,1.1vw,10px);letter-spacing:0.28em;margin-bottom:16px}
        .sr-hero-title{font-family:'Orbitron',monospace;font-weight:900;font-size:clamp(30px,6.5vw,58px);line-height:1.05;margin-bottom:10px;letter-spacing:0.04em}
        .sr-hero-subtitle{font-family:'VT323',monospace;font-size:clamp(18px,3.5vw,28px);color:#ff8844;text-shadow:0 0 18px #ff884466;margin-bottom:14px;letter-spacing:0.1em}

        /* Live badge */
        .sr-live{display:inline-flex;align-items:center;gap:7px;padding:5px 16px;border-radius:2px;background:rgba(255,60,0,0.05);border:1px solid rgba(255,60,0,0.22);font-size:9px;color:#ff6644;letter-spacing:0.22em;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)}
        .sr-live-dot{width:7px;height:7px;border-radius:50%;background:#ff4400;animation:srLdot 1.2s ease-in-out infinite;box-shadow:0 0 8px #ff4400}
        @keyframes srLdot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.7);opacity:0.4}}

        /* Ticker */
        .sr-ticker{overflow:hidden;border-top:1px solid rgba(255,60,0,0.07);border-bottom:1px solid rgba(255,60,0,0.07);padding:10px 0;background:rgba(255,60,0,0.018)}
        .sr-ticker-t{display:flex;gap:72px;animation:srTick 32s linear infinite;white-space:nowrap}
        @keyframes srTick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .sr-tick-i{font-size:11px;color:rgba(255,80,0,0.38);letter-spacing:0.12em;flex-shrink:0}

        /* Divider */
        .sr-div{height:1px;background:linear-gradient(90deg,transparent,#ff440066,#ff880044,transparent);margin:0 auto;animation:srDivGlow 3s ease-in-out infinite alternate}
        @keyframes srDivGlow{0%{opacity:0.5}100%{opacity:1;filter:blur(0.5px)}}

        /* Tools */
        .sr-leaderboard-tools{display:flex;justify-content:center;align-items:stretch;flex-wrap:wrap;gap:10px;margin-bottom:18px}
        .sr-sort-control{display:flex;align-items:center;gap:10px;padding:8px 10px;background:rgba(8,0,3,0.78);border:1px solid rgba(255,60,0,0.13);border-radius:4px}
        .sr-sort-control>span{font-size:10px;letter-spacing:0.18em;color:rgba(255,80,0,0.5);text-transform:uppercase}
        .sr-sort-select{min-width:130px;background:#160600;border:1px solid rgba(255,60,0,0.22);color:#ffe8e0;padding:8px 10px;border-radius:3px;font-family:'Share Tech Mono',monospace;font-size:12px;outline:none}
        .sr-sort-select:focus{border-color:rgba(255,60,0,0.55);box-shadow:0 0 0 3px rgba(255,60,0,0.08)}
        .sr-top-toggle{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 16px;border-radius:3px;border:1px solid rgba(255,60,0,0.2);background:rgba(255,60,0,0.08);color:#ff6644;font-family:'Share Tech Mono',monospace;font-weight:700;letter-spacing:0.12em;cursor:pointer;transition:all 0.2s}
        .sr-top-toggle:hover,.sr-top-toggle.is-active{background:#ff4400;color:#080003;box-shadow:0 0 20px rgba(255,68,0,0.22)}

        /* Rankings heading */
        .sr-rankings-heading{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:0 0 22px;padding:0 2px}
        .sr-rankings-heading .sr-hero-kicker{margin:0 0 4px;line-height:1}
        .sr-rankings-heading h2{font-family:'Orbitron',monospace;font-size:clamp(15px,2vw,21px);letter-spacing:0.1em;color:#ffe8e0}
        .sr-rankings-heading p{color:rgba(255,80,0,0.38);font-size:10px;letter-spacing:0.1em;text-align:right}

        /* Skeleton */
        .sr-skeleton{display:flex;flex-direction:column;gap:8px;padding:16px 14px;background:rgba(8,0,3,0.72);border:1px solid rgba(255,60,0,0.1);border-radius:3px}
        .sr-skeleton-row{display:grid;grid-template-columns:72px 1fr 100px;align-items:center;gap:18px;min-height:64px;padding:12px 16px;border-bottom:1px solid rgba(255,60,0,0.06)}
        .sr-skeleton-row:last-child{border-bottom:0}
        .sr-skeleton-block{display:block;height:12px;background:linear-gradient(90deg,rgba(255,60,0,0.06),rgba(255,80,0,0.18),rgba(255,60,0,0.06));background-size:220% 100%;animation:srSkeletonPulse 1.4s ease-in-out infinite;border-radius:2px}
        .sr-skeleton-rank{width:30px;justify-self:center}.sr-skeleton-name{max-width:250px}.sr-skeleton-score{width:70px;justify-self:end}
        @keyframes srSkeletonPulse{0%{background-position:200% 0}100%{background-position:-20% 0}}

        /* Animations */
        @keyframes g1{0%,90%,100%{opacity:0;transform:translateX(0)}91%{opacity:0.85;transform:translateX(-4px)}95%{opacity:0.5;transform:translateX(2px)}}
        @keyframes g2{0%,86%,100%{opacity:0;transform:translateX(0)}87%{opacity:0.75;transform:translateX(4px)}92%{opacity:0.4;transform:translateX(-2px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.8s cubic-bezier(0.34,1.2,0.64,1) both}
        .fu1{animation-delay:0.1s}.fu2{animation-delay:0.28s}.fu3{animation-delay:0.44s}.fu4{animation-delay:0.6s}
        @keyframes sr-scanCard{0%{top:-4px}100%{top:105%}}
        @keyframes sr-sparkOut{0%{opacity:1}100%{opacity:0;transform:translateX(80px) scale(0)}}
        @keyframes profIn{from{opacity:0;transform:translateY(8px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}

        /* Table */
        .sr-card-wrap{background:rgba(8,0,3,0.72);border:1px solid rgba(255,60,0,0.09);border-radius:2px;overflow:hidden;backdrop-filter:blur(18px);box-shadow:0 0 60px rgba(255,60,0,0.03),inset 0 1px 0 rgba(255,60,0,0.05);position:relative}
        .sr-card-wrap::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 26px,rgba(255,60,0,0.01) 26px,rgba(255,60,0,0.01) 27px);pointer-events:none;z-index:0}
        .sr-lb-table{width:100%;border-collapse:separate;border-spacing:0 3px;padding:10px 14px;position:relative;z-index:1}
        .sr-lb-table thead th{font-family:'Orbitron',monospace;font-size:8px;letter-spacing:0.24em;color:rgba(255,60,0,0.32);padding:14px 18px;text-align:left;border-bottom:1px solid rgba(255,60,0,0.06)}
        .sr-lb-table thead th.c{text-align:center}
        .sr-lb-table tbody tr{transition:background 0.2s,transform 0.15s;cursor:auto}
        .sr-lb-table tbody tr:hover{transform:translateX(3px)}

        /* Links */
        .sr-lb-link{display:inline-flex;align-items:center;gap:5px;padding:5px 13px;border-radius:2px;font-size:11px;font-family:'Share Tech Mono',monospace;text-decoration:none;transition:all 0.22s;letter-spacing:0.06em;border:1px solid;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)}
        .sr-lb-link-orange{border-color:rgba(255,140,0,0.2);color:rgba(255,140,0,0.6);background:rgba(255,140,0,0.04)}
        .sr-lb-link-orange:hover{border-color:rgba(255,140,0,0.6);color:#ff8800;background:rgba(255,140,0,0.1);box-shadow:0 0 14px rgba(255,140,0,0.25)}
        .sr-lb-link-red{border-color:rgba(255,60,0,0.2);color:rgba(255,60,0,0.6);background:rgba(255,60,0,0.04)}
        .sr-lb-link-red:hover{border-color:rgba(255,60,0,0.6);color:#ff4400;background:rgba(255,60,0,0.1);box-shadow:0 0 14px rgba(255,60,0,0.25)}
        .sr-lb-dash{color:rgba(255,255,255,0.07);font-family:'Share Tech Mono',monospace;font-size:12px}

        /* Share btn / score chip */
        .sr-share-btn{background:rgba(255,60,0,0.06);border:1px solid rgba(255,60,0,0.18);color:rgba(255,80,0,0.5);font-family:'Share Tech Mono',monospace;font-size:13px;padding:4px 9px;border-radius:3px;cursor:pointer;transition:all 0.2s;line-height:1}
        .sr-share-btn:hover{background:rgba(255,60,0,0.12);border-color:rgba(255,60,0,0.5);color:#ff4400;box-shadow:0 0 10px rgba(255,60,0,0.25)}
        .sr-share-btn--ok{background:rgba(255,60,0,0.15);border-color:#ff4400;color:#ff4400;box-shadow:0 0 14px rgba(255,60,0,0.4)}
        .sr-score-chip{display:inline-block;padding:3px 14px;border-radius:2px;background:rgba(255,60,0,0.06);border:1px solid rgba(255,60,0,0.2);color:#ff6644;font-weight:700;font-size:13px;font-family:'Share Tech Mono',monospace;letter-spacing:0.05em;transition:all 0.3s}
        .sr-score-chip-negative{background:rgba(255,82,105,0.1);border-color:rgba(255,105,125,0.42);color:#ff8d9e}

        /* Desktop/mobile toggle */
        .desktop{display:none}.mobile{display:flex;flex-direction:column;gap:10px}
        @media(min-width:768px){.desktop{display:block}.mobile{display:none}}

        /* Full footer styling matching original structure with red accents */
        .lb-footer{position:relative;z-index:3;margin-top:42px;border-top:1px solid rgba(255,60,0,0.08);background:rgba(8,0,3,0.85);backdrop-filter:blur(20px)}
        .footer-top{display:grid;grid-template-columns:1.35fr 1fr 1.2fr;gap:clamp(20px,4vw,48px);padding:34px clamp(16px,5vw,72px) 26px}
        @media(max-width:980px){.footer-top{grid-template-columns:1fr 1fr;gap:32px}.footer-brand{grid-column:1 / -1}}
        @media(max-width:640px){.footer-top{grid-template-columns:1fr;gap:20px;padding:26px 20px 20px}}
        .footer-brand h3{font-family:'Orbitron',monospace;font-weight:900;font-size:16px;color:#ff4400;letter-spacing:0.14em;text-shadow:0 0 18px #ff440055;margin-bottom:6px}
        .footer-brand p{font-size:11px;color:rgba(255,80,0,0.35);letter-spacing:0.1em;line-height:1.8}
        .footer-brand-note{max-width:230px;margin-top:18px;color:rgba(255,220,200,0.54)!important;letter-spacing:0.03em!important;line-height:1.65!important}
        .footer-col h4{font-family:'Orbitron',monospace;font-size:9px;letter-spacing:0.22em;color:rgba(255,80,0,0.4);margin-bottom:14px;text-transform:uppercase}
        .footer-col a,.footer-col span{display:block;font-size:12px;color:rgba(255,80,0,0.5);text-decoration:none;padding:5px 0;border-bottom:1px solid rgba(255,60,0,0.06);transition:color 0.2s,padding-left 0.2s;letter-spacing:0.05em}
        .footer-col a:hover{color:#ff4400;padding-left:8px}
        .footer-founders{padding:24px clamp(16px,5vw,72px) 28px;border-top:1px solid rgba(255,60,0,0.07);background:linear-gradient(180deg,rgba(255,60,0,0.025),transparent)}
        .founder-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:18px}
        .founder-heading h4{font-family:'Orbitron',monospace;font-size:clamp(13px,1.7vw,17px);letter-spacing:0.16em;color:#ffe8e0;margin-top:6px;text-transform:uppercase}
        .founder-toggle{display:flex;align-items:center;gap:12px;padding:0;border:0;background:transparent;color:inherit;cursor:pointer;text-align:left;touch-action:manipulation}
        .founder-toggle:hover h4,.founder-toggle.is-open h4{color:#ff4400;text-shadow:0 0 16px rgba(255,68,0,0.35)}
        .founder-toggle .batch-toggle-icon{font-size:20px}
        .founder-toggle.is-open .batch-toggle-icon{transform:rotate(180deg)}
        .founder-kicker{font-family:'Share Tech Mono',monospace;font-size:9px;color:rgba(255,80,0,0.42);letter-spacing:0.22em}
        .founder-intro{margin:0;color:rgba(255,220,200,0.42)!important;font-size:10px!important;letter-spacing:0.04em!important}
        .founder-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:clamp(10px,1.4vw,18px)}
        .founder-card{position:relative;min-width:0;padding:9px;background:rgba(255,60,0,0.035);border:1px solid rgba(255,60,0,0.12);transition:transform 0.22s,border-color 0.22s,background 0.22s}
        .founder-card:hover{transform:translateY(-3px);border-color:rgba(255,60,0,0.48);background:rgba(255,60,0,0.08)}
        .founder-portrait-link{display:block;text-decoration:none}
        .founder-avatar{display:block;width:100%;aspect-ratio:1 / 1;flex:0 0 auto;object-fit:cover;object-position:center 28%;border-radius:2px;border:1px solid rgba(255,60,0,0.38);box-shadow:0 0 14px rgba(255,60,0,0.1)}
        .founder-avatar-fallback{display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#3d0707,#2e0606);color:#ff9e88;font-family:'Orbitron',monospace;font-size:9px;font-weight:700}
        .founder-copy{display:flex;flex-direction:column;gap:4px;min-width:0;padding:10px 2px 2px}
        .founder-copy strong{font-family:'Share Tech Mono',monospace;color:#ffe8e0;font-size:12px;font-weight:400;letter-spacing:0.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .founder-copy span{border:0;padding:0;font-size:9px;color:rgba(255,80,0,0.4);letter-spacing:0.1em;text-transform:uppercase}
        .founder-link{position:absolute;top:12px;right:12px;display:inline-flex!important;align-items:center;justify-content:center;width:22px;height:22px;padding:0!important;border:1px solid rgba(255,140,0,0.5)!important;background:rgba(18,4,0,0.8);color:#ff8800!important;font-size:13px!important}
        .founder-link:hover{padding:0!important;background:rgba(255,140,0,0.18);box-shadow:0 0 12px rgba(255,140,0,0.3)}
        .batch-links{display:flex;gap:6px;margin-top:9px}
        .batch-links a{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:22px;padding:0 6px;border:1px solid rgba(255,140,0,0.3);background:rgba(255,140,0,0.05);color:rgba(255,200,120,0.78);font-family:'Share Tech Mono',monospace;font-size:8px;letter-spacing:0.04em;text-decoration:none;transition:all 0.2s}
        .batch-links a:hover{border-color:#ff8800;background:rgba(255,140,0,0.16);color:#fff;box-shadow:0 0 12px rgba(255,140,0,0.22)}
        .batch-section{padding:0 clamp(16px,5vw,72px) 26px;background:linear-gradient(180deg,transparent,rgba(255,140,0,0.025));border-bottom:1px solid rgba(255,60,0,0.07)}
        .batch-toggle{width:100%;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:18px 20px;border:1px solid rgba(255,140,0,0.2);background:rgba(255,140,0,0.045);color:#ffe8e0;text-align:left;cursor:pointer;touch-action:manipulation;transition:background 0.25s,border-color 0.25s,box-shadow 0.25s}
        .batch-toggle:hover,.batch-toggle.is-open{border-color:rgba(255,140,0,0.5);background:rgba(255,140,0,0.09);box-shadow:0 0 24px rgba(255,140,0,0.08)}
        .batch-toggle small{display:block;margin-bottom:6px;color:rgba(255,140,0,0.62);font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:0.2em}
        .batch-toggle strong{display:block;font-family:'Orbitron',monospace;font-size:clamp(14px,2vw,19px);letter-spacing:0.1em}
        .batch-toggle-icon{font-size:24px;color:#ff8800;line-height:1;transition:transform 0.3s}
        .batch-toggle.is-open .batch-toggle-icon{transform:rotate(180deg)}
        .batch-content{display:block;max-height:0;overflow:hidden;opacity:0;visibility:hidden;transition:max-height 0.45s ease,opacity 0.3s ease,visibility 0s linear 0.45s}
        .batch-content.is-open{max-height:1200px;opacity:1;visibility:visible;transition:max-height 0.45s ease,opacity 0.3s ease,visibility 0s linear 0s}
        .batch-intro{padding-top:18px;color:rgba(255,220,200,0.45);font-size:10px;letter-spacing:0.06em}
        .batch-grid{padding-top:14px;grid-template-columns:repeat(6,minmax(0,1fr));max-width:none}
        @media(max-width:980px){.founder-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:640px){.founder-heading{display:block}.founder-intro{margin-top:8px}.founder-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.founder-card{padding:7px}.founder-copy strong{font-size:11px}.founder-copy span{font-size:8px;letter-spacing:0.06em}.batch-section{padding-left:20px;padding-right:20px}.batch-toggle{padding:15px 14px}.batch-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        .footer-stat{display:flex;flex-direction:column;gap:10px}
        .footer-stat-item{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(255,60,0,0.04);border:1px solid rgba(255,60,0,0.09);border-radius:2px}
        .footer-stat-item .k{font-size:10px;color:rgba(255,80,0,0.4);letter-spacing:0.12em}
        .footer-stat-item .v{font-family:'Orbitron',monospace;font-size:13px;color:#ff4400;font-weight:700}
        .footer-bottom{display:flex;align-items:center;justify-content:space-between;padding:13px clamp(16px,5vw,72px);border-top:1px solid rgba(255,60,0,0.06);flex-wrap:wrap;gap:12px}
        @media(max-width:640px){.footer-bottom{flex-direction:column;align-items:flex-start;padding-top:11px;padding-bottom:11px}}
        .footer-bottom p{font-size:11px;color:rgba(255,60,0,0.22);letter-spacing:0.1em}
        .footer-socials{display:flex;gap:10px}
        .footer-socials a{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border:1px solid rgba(255,60,0,0.15);border-radius:2px;font-size:10px;color:rgba(255,80,0,0.45);text-decoration:none;letter-spacing:0.1em;transition:all 0.2s;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%)}
        .footer-socials a:hover{background:rgba(255,60,0,0.08);border-color:rgba(255,60,0,0.4);color:#ff4400}

        /* Scrollbar */
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#080003}
        ::-webkit-scrollbar-thumb{background:rgba(255,60,0,0.18);border-radius:99px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,60,0,0.4)}

        /* Mobile nav */
        @media(max-width:640px){
          .sr-leader-nav{top:6px;margin:0 8px;padding:8px 12px;border-radius:4px}
          .sr-leader-brand strong{font-size:11px}
          .sr-leader-brand small{font-size:7px}
          .sr-leader-brand-mark{width:26px;height:26px;font-size:14px}
          .sr-leader-menu-button{display:flex;align-items:center;justify-content:center;flex-direction:column;width:34px;height:34px;padding:6px;border-radius:3px}
          .sr-leader-menu-button span{width:18px;height:2px;margin:2px 0;border-radius:1px}
          .sr-leader-nav-links{position:absolute;top:calc(100% + 6px);left:0;right:0;display:none;flex-direction:column;align-items:stretch;gap:0;padding:6px;background:rgba(23,4,0,0.98);border:1px solid rgba(255,60,0,0.22);border-radius:4px;box-shadow:0 16px 36px rgba(0,0,0,0.5)}
          .sr-leader-nav-links.is-open{display:flex}
          .sr-leader-nav-links a{padding:12px 10px;font-size:11px;border-bottom:1px solid rgba(255,60,0,0.08)}
          .sr-lb-inner{padding-left:12px;padding-right:12px}
          .sr-hero-eyebrow{letter-spacing:0.14em;line-height:1.5;font-size:8px;margin-bottom:10px}
          .sr-hero-title{font-size:clamp(26px,7vw,42px);letter-spacing:0.02em;line-height:1.1;margin-bottom:6px}
          .sr-hero-subtitle{font-size:16px;letter-spacing:0.08em;margin-bottom:8px}
          .sr-typewriter{font-size:10px;line-height:1.6;margin-bottom:24px;min-height:auto;white-space:pre-wrap;word-break:break-word}
          .sr-enter-btn{width:100%;max-width:280px;padding:14px 20px;font-size:12px;letter-spacing:0.16em}
          .sr-corner{width:18px;height:18px}
          .sr-corner.tl{top:10px;left:10px}
          .sr-corner.tr{top:10px;right:10px}
          .sr-corner.bl{bottom:10px;left:10px}
          .sr-corner.br{bottom:10px;right:10px}
          .sr-leaderboard-tools{display:grid;grid-template-columns:1fr 1fr;width:100%;gap:8px;margin-bottom:14px}
          .sr-sort-control{min-width:0;justify-content:space-between;grid-column:1 / -1;padding:6px 10px}
          .sr-sort-select{flex:1;min-width:0;padding:6px 8px;font-size:11px}
          .sr-top-toggle{width:100%;min-height:38px;padding:8px 12px;font-size:11px}
          .sr-rankings-heading{align-items:flex-start;flex-direction:column;margin-bottom:14px;gap:6px}
          .sr-rankings-heading p{text-align:left}
          .sr-card-wrap{border-radius:4px}
        }
      `}</style>

      <div id="top" className="sr-lb">
        <SeniorSpaceCanvas />
        <SeniorMatrixRain />
        <SeniorLeaderboardNav />

        {/* Welcome Screen */}
        {showWelcome && (
          <div className={`sr-wl${exiting ? " exit" : ""}`}>
            <div className="sr-wl-scan" />
            <div className="sr-corner tl" /><div className="sr-corner tr" />
            <div className="sr-corner bl" /><div className="sr-corner br" />
            <div style={{ textAlign: "center", padding: "0 28px", position: "relative", zIndex: 1 }}>
              <div className="sr-typewriter">{typeText}<span className="sr-cursor" /></div>
              <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(30px,8vw,68px)", lineHeight: 1, marginBottom: 10, letterSpacing: "0.06em" }}>
                <Glitch style={{ color: "#ff4400", textShadow: "0 0 30px #ff440088, 0 0 80px #ff440022" }}>SENIOR BOARD</Glitch>
              </h1>
              <h2 style={{ fontFamily: "'VT323',monospace", fontSize: "clamp(22px,5vw,42px)", color: "#ff8844", textShadow: "0 0 20px #ff884477", marginBottom: 10, letterSpacing: "0.1em" }}>
                CodeCraft 2026
              </h2>
              <p style={{ color: "rgba(255,80,0,0.22)", fontSize: 9, letterSpacing: "0.3em", marginBottom: 52, fontFamily: "'Share Tech Mono',monospace" }}>
                VISHVESHWARYA GROUP OF INSTITUTION
              </p>
              <button className="sr-enter-btn" onClick={handleEnter}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <ZapIcon size={16} /> BREACH SYSTEM
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Ticker */}
        {!showWelcome && sorted.length > 0 && (
          <div className="sr-ticker">
            <div className="sr-ticker-t">
              {[...Array(2)].flatMap((_, ri) =>
                sorted.map((s, si) => (
                  <span key={`${ri}-${si}`} className="sr-tick-i">
                    #{s.rank} {s.name} <span style={{ color: "rgba(255,140,0,0.45)" }}>◈</span> {s.points} XP <span style={{ color: "rgba(255,80,0,0.28)" }}>∥</span>
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="sr-hero-shell fu fu1">
          <div className="sr-hero-kicker-wrap">
            <span className="sr-live"><span className="sr-live-dot" />LIVE UPLINK</span>
          </div>
          <p className="sr-hero-eyebrow">∥ VISHVESHWARYA GROUP OF INSTITUTIONS — SENIOR DIVISION ∥</p>
          <h1 className="sr-hero-title">
            <Glitch style={{ color: "#ff4400", textShadow: "0 0 22px #ff440077, 0 0 55px #ff440022" }}>SENIOR BOARD</Glitch>
          </h1>
          <h2 className="sr-hero-subtitle">▸ CodeCraft — SENIOR LEADERBOARD</h2>
          <SeniorLeaderboardPodium top3={top3} podiumVisible={podiumVisible} podiumRef={podiumRef} />
        </section>

        {/* Leaderboard Table */}
        <div id="leaderboard" className="sr-lb-inner">
          {isLoading ? (
            <SeniorLeaderboardSkeleton />
          ) : (
            <>
              <div className="sr-rankings-heading">
                <div>
                  <p className="sr-hero-kicker" style={{ fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,80,0,0.4)", marginBottom: 4 }}>LIVE STANDINGS</p>
                  <h2>Senior Leaderboard</h2>
                </div>
                <p>{filtered.length} operatives ranked</p>
              </div>

              <div className="desktop">
                <div className="sr-card-wrap">
                  <svg style={{ position: "absolute", width: 0, height: 0 }}>
                    <defs><filter id="lg"><feGaussianBlur stdDeviation="1.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                  </svg>
                  <table className="sr-lb-table">
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
                        <SeniorTerminalRow
                          key={item._id}
                          item={item}
                          index={i}
                          medal={medal(item.rank)}
                          topScore={sorted[0]?.points || 0}
                          badges={badges[item.roll] || []}
                          rankDeltas={rankDeltas}
                          rankTrigger={rankTrigger}
                          onNameHover={handleProfileHover}
                          onNameLeave={handleProfileLeave}
                          onNameSelect={handleProfileSelect}
                          onShare={shareRank}
                          copied={copied}
                        />
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: "center", padding: "52px 0", color: "rgba(255,60,0,0.18)", fontFamily: "'Share Tech Mono',monospace", fontSize: 12, letterSpacing: "0.18em" }}>
                            {data.length === 0 ? "◈ NO SENIOR OPERATIVES REGISTERED ◈" : "◈ NO MATCHES FOUND ◈"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mobile">
                {filtered.map((item, i) => (
                  <SeniorMobileCard
                    key={item._id}
                    item={item}
                    onNameSelect={handleProfileSelect}
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
                  <p style={{ textAlign: "center", color: "rgba(255,60,0,0.18)", marginTop: 52, letterSpacing: "0.18em", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 }}>
                    {data.length === 0 ? "◈ NO SENIOR OPERATIVES REGISTERED ◈" : "◈ NO MATCHES FOUND ◈"}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {profileTarget && (
          <ProfileCard
            student={profileTarget.student}
            badges={profileTarget.badges}
            pos={profileTarget.pos}
            onClose={handleProfileClose}
            theme="red"
          />
        )}

        {/* Footer */}
        <UserLeaderboardFooter sorted={sorted} top3={top3} totalPts={totalPts} podiumRef={podiumRef} />
      </div>
    </>
  );
}
