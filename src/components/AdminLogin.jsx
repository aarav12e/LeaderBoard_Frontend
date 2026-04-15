import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { SpaceCanvas, MatrixRain } from "./AdminEffects";

const ADMINS = [
  { username: "aarav12ee", password: "waterbottle" },
  { username: "kajal", password: "kajal12kajal" },
];

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [typeText, setTypeText] = useState("");
  const fullText = "> VERIFYING ADMIN CREDENTIALS...\n> LOADING IGNITE_CLUB.DB... [OK]\n> AWAITING AUTHENTICATION... [READY]";

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTypeText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(iv);
    }, 22);
    return () => clearInterval(iv);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (ADMINS.some(a => a.username === username && a.password === password)) {
      sessionStorage.setItem("adminAuth", "true");
      onLogin();
      return;
    }
    setShake(true);
    toast.error("Access denied — invalid credentials!", {
      style: { background: "#000814", border: "1px solid rgba(0,255,160,0.2)", color: "#00ffa0", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
    });
    setTimeout(() => setShake(false), 600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .login-page{min-height:100vh;background:#000308;display:flex;align-items:center;justify-content:center;font-family:'Share Tech Mono',monospace;position:relative;overflow:hidden}
        .corner{position:absolute;width:28px;height:28px;border-color:#00ffcc44;border-style:solid;animation:cPulse 2s ease-in-out infinite}
        .corner.tl{top:18px;left:18px;border-width:2px 0 0 2px}
        .corner.tr{top:18px;right:18px;border-width:2px 2px 0 0}
        .corner.bl{bottom:18px;left:18px;border-width:0 0 2px 2px}
        .corner.br{bottom:18px;right:18px;border-width:0 2px 2px 0}
        @keyframes cPulse{0%,100%{border-color:#00ffcc22}50%{border-color:#00ffcc}}
        .login-sweep{position:fixed;left:0;right:0;height:2px;z-index:3;background:linear-gradient(90deg,transparent,#00ffcc66,#00aaff88,transparent);animation:sweep 3.5s linear infinite;pointer-events:none}
        @keyframes sweep{from{top:-2px}to{top:100%}}
        .login-card{position:relative;z-index:10;width:100%;max-width:420px;margin:24px;background:rgba(0,4,18,0.88);border:1px solid rgba(0,255,160,0.2);border-radius:4px;padding:44px 38px;backdrop-filter:blur(24px);box-shadow:0 0 60px rgba(0,255,160,0.06),0 25px 60px rgba(0,0,0,0.8),inset 0 1px 0 rgba(0,255,160,0.08);clip-path:polygon(16px 0%,100% 0%,calc(100% - 16px) 100%,0% 100%);animation:cardIn 0.7s cubic-bezier(0.34,1.2,0.64,1) both;}
        .login-card.shake{animation:shake 0.5s ease}
        @keyframes cardIn{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-7px)}80%{transform:translateX(7px)}}
        .login-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00ffcc99,#00aaff77,transparent)}
        .login-typewriter{font-size:11px;color:rgba(0,255,200,0.45);text-align:left;line-height:1.9;letter-spacing:0.06em;white-space:pre;min-height:56px;margin-bottom:36px}
        .login-cursor{display:inline-block;width:7px;height:13px;background:#00ffcc;animation:blink 0.75s step-end infinite;vertical-align:bottom}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .login-label{display:block;font-size:9px;letter-spacing:0.22em;color:rgba(0,255,160,0.5);margin-bottom:7px;text-transform:uppercase}
        .login-input{width:100%;padding:12px 16px;background:rgba(0,255,160,0.03);border:1px solid rgba(0,255,160,0.15);border-radius:2px;color:#e8fff4;font-size:14px;font-family:'Share Tech Mono',monospace;outline:none;letter-spacing:0.04em;transition:border-color 0.25s,box-shadow 0.25s;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);}
        .login-input::placeholder{color:rgba(0,255,160,0.18)}
        .login-input:focus{border-color:rgba(0,255,160,0.5);box-shadow:0 0 0 2px rgba(0,255,160,0.08),0 0 24px rgba(0,255,160,0.08)}
        .login-btn{width:100%;padding:14px;background:transparent;border:1px solid #00ffcc;border-radius:2px;color:#00ffcc;font-family:'Orbitron',monospace;font-weight:900;font-size:13px;letter-spacing:0.18em;cursor:pointer;position:relative;overflow:hidden;text-shadow:0 0 12px #00ffcc88;box-shadow:0 0 28px #00ffcc22,inset 0 0 20px #00ffcc06;transition:all 0.35s;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);animation:btnPulse 2.2s ease-in-out infinite;}
        @keyframes btnPulse{0%,100%{box-shadow:0 0 28px #00ffcc22,inset 0 0 20px #00ffcc06}50%{box-shadow:0 0 50px #00ffcc44,inset 0 0 28px #00ffcc12}}
        .login-btn::before{content:'';position:absolute;inset:0;background:#00ffcc;transform:translateX(-110%);transition:transform 0.4s ease;z-index:-1}
        .login-btn:hover{color:#000308;text-shadow:none;animation:none;box-shadow:0 0 60px #00ffcc88}
        .login-btn:hover::before{transform:translateX(0)}
      `}</style>

      <div className="login-page">
        <SpaceCanvas />
        <MatrixRain />
        <div className="login-sweep" />
        <div className="corner tl" /><div className="corner tr" />
        <div className="corner bl" /><div className="corner br" />

        <div className={`login-card${shake ? " shake" : ""}`}>
          <div className="login-typewriter">{typeText}<span className="login-cursor" /></div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(0,255,160,0.3)", marginBottom: 10 }}>
              ∥ VISHVESHWARYA GROUP OF INSTITUTION ∥
            </p>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(22px,4vw,30px)", color: "#00ffcc", textShadow: "0 0 24px #00ffcc66", lineHeight: 1.1 }}>
              IGNITE CLUB
            </h1>
            <p style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: "#00aaff", letterSpacing: "0.1em", textShadow: "0 0 14px #00aaff66", marginTop: 4 }}>
              BUGBYTE — ADMIN TERMINAL
            </p>
            <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#00ffcc55,#00aaff44,transparent)", margin: "20px 0" }} />
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label className="login-label">USERNAME</label>
              <input type="text" className="login-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" autoComplete="username" required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label className="login-label">PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} className="login-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" autoComplete="current-password" required style={{ paddingRight: 46 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 17, lineHeight: 1, color: "rgba(0,255,160,0.4)" }}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button type="submit" className="login-btn">⚡ AUTHENTICATE</button>
          </form>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 9, color: "rgba(0,255,160,0.22)", letterSpacing: "0.2em" }}>
            RESTRICTED ACCESS — ADMINS ONLY
          </p>
        </div>
      </div>
    </>
  );
}
