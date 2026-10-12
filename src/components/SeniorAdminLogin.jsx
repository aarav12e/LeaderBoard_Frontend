import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { SeniorSpaceCanvas, SeniorMatrixRain } from "./SeniorLeaderboardEffects";
import { EyeIcon, EyeOffIcon, ShieldAlertIcon, ZapIcon } from "./Icons";

export default function SeniorAdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeText, setTypeText] = useState("");
  const fullText = "> VERIFYING SENIOR ADMIN CREDENTIALS...\n> LOADING SENIOR_IGNITE.DB... [OK]\n> AWAITING AUTHENTICATION... [READY]";

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setTypeText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(iv);
    }, 22);
    return () => clearInterval(iv);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    setLoading(true);
    try {
      const res = await api.post("/auth/senior-login", { username: cleanUsername, password: cleanPassword });
      sessionStorage.setItem("seniorAdminAuth", "true");
      sessionStorage.setItem("seniorAdminToken", res.data.token);
      onLogin();
    } catch (err) {
      setShake(true);
      toast.error(err.response?.data?.message || "Access denied — invalid credentials!", {
        style: { background: "#080003", border: "1px solid rgba(255,60,0,0.2)", color: "#ff6644", fontFamily: "'Share Tech Mono',monospace", fontSize: 12 },
      });
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .sr-login-page{min-height:100vh;background:#080003;display:flex;align-items:center;justify-content:center;font-family:'Share Tech Mono',monospace;position:relative;overflow:hidden}
        .sr-corner{position:absolute;width:28px;height:28px;border-color:#ff440044;border-style:solid;animation:srCPulse 2s ease-in-out infinite}
        .sr-corner.tl{top:18px;left:18px;border-width:2px 0 0 2px}
        .sr-corner.tr{top:18px;right:18px;border-width:2px 2px 0 0}
        .sr-corner.bl{bottom:18px;left:18px;border-width:0 0 2px 2px}
        .sr-corner.br{bottom:18px;right:18px;border-width:0 2px 2px 0}
        @keyframes srCPulse{0%,100%{border-color:#ff440022}50%{border-color:#ff4400}}
        .sr-login-sweep{position:fixed;left:0;right:0;height:2px;z-index:3;background:linear-gradient(90deg,transparent,#ff440066,#ff880088,transparent);animation:srSweep 3.5s linear infinite;pointer-events:none}
        @keyframes srSweep{from{top:-2px}to{top:100%}}

        .sr-login-card{position:relative;z-index:10;width:100%;max-width:420px;margin:24px;background:rgba(18,4,0,0.88);border:1px solid rgba(255,60,0,0.2);border-radius:4px;padding:44px 38px;backdrop-filter:blur(24px);box-shadow:0 0 60px rgba(255,60,0,0.06),0 25px 60px rgba(0,0,0,0.8),inset 0 1px 0 rgba(255,60,0,0.08);clip-path:polygon(16px 0%,100% 0%,calc(100% - 16px) 100%,0% 100%);animation:srCardIn 0.7s cubic-bezier(0.34,1.2,0.64,1) both}
        .sr-login-card.shake{animation:srShake 0.5s ease}
        @keyframes srCardIn{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
        @keyframes srShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-7px)}80%{transform:translateX(7px)}}
        .sr-login-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#ff440099,#ff880077,transparent)}

        .sr-login-typewriter{font-size:11px;color:rgba(255,100,60,0.45);text-align:left;line-height:1.9;letter-spacing:0.06em;white-space:pre;min-height:56px;margin-bottom:36px}
        .sr-login-cursor{display:inline-block;width:7px;height:13px;background:#ff4400;animation:srBlink 0.75s step-end infinite;vertical-align:bottom}
        @keyframes srBlink{0%,100%{opacity:1}50%{opacity:0}}

        .sr-login-label{display:block;font-size:9px;letter-spacing:0.22em;color:rgba(255,80,40,0.5);margin-bottom:7px;text-transform:uppercase}
        .sr-login-input{width:100%;padding:12px 16px;background:rgba(255,60,0,0.03);border:1px solid rgba(255,60,0,0.15);border-radius:2px;color:#ffe8e0;font-size:14px;font-family:'Share Tech Mono',monospace;outline:none;letter-spacing:0.04em;transition:border-color 0.25s,box-shadow 0.25s;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)}
        .sr-login-input::placeholder{color:rgba(255,60,0,0.18)}
        .sr-login-input:focus{border-color:rgba(255,60,0,0.5);box-shadow:0 0 0 2px rgba(255,60,0,0.08),0 0 24px rgba(255,60,0,0.08)}

        .sr-login-btn{width:100%;padding:14px;background:transparent;border:1px solid #ff4400;border-radius:2px;color:#ff4400;font-family:'Orbitron',monospace;font-weight:900;font-size:13px;letter-spacing:0.18em;cursor:pointer;position:relative;overflow:hidden;text-shadow:0 0 12px #ff440088;box-shadow:0 0 28px #ff440022,inset 0 0 20px #ff440006;transition:all 0.35s;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);animation:srBtnPulse 2.2s ease-in-out infinite}
        @keyframes srBtnPulse{0%,100%{box-shadow:0 0 28px #ff440022,inset 0 0 20px #ff440006}50%{box-shadow:0 0 50px #ff440044,inset 0 0 28px #ff440012}}
        .sr-login-btn::before{content:'';position:absolute;inset:0;background:#ff4400;transform:translateX(-110%);transition:transform 0.4s ease;z-index:-1}
        .sr-login-btn:hover{color:#080003;text-shadow:none;animation:none;box-shadow:0 0 60px #ff440088}
        .sr-login-btn:hover::before{transform:translateX(0)}

        .sr-badge{display:inline-block;padding:4px 14px;border:1px solid rgba(255,80,0,0.3);border-radius:2px;font-size:9px;letter-spacing:0.18em;color:rgba(255,100,50,0.6);margin-bottom:18px;background:rgba(255,60,0,0.05)}
      `}</style>

      <div className="sr-login-page">
        <SeniorSpaceCanvas />
        <SeniorMatrixRain />
        <div className="sr-login-sweep" />
        <div className="sr-corner tl" /><div className="sr-corner tr" />
        <div className="sr-corner bl" /><div className="sr-corner br" />

        <div className={`sr-login-card${shake ? " shake" : ""}`}>
          <div className="sr-login-typewriter">{typeText}<span className="sr-login-cursor" /></div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,60,0,0.3)", marginBottom: 10 }}>
              ∥ VISHVESHWARYA GROUP OF INSTITUTION ∥
            </p>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(22px,4vw,30px)", color: "#ff4400", textShadow: "0 0 24px #ff440066", lineHeight: 1.1 }}>
              IGNITE CLUB
            </h1>
            <p style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: "#ff8844", letterSpacing: "0.1em", textShadow: "0 0 14px #ff884466", marginTop: 4 }}>
              SENIOR — ADMIN TERMINAL
            </p>
            <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#ff440055,#ff880044,transparent)", margin: "20px 0" }} />
            <div className="sr-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ShieldAlertIcon size={12} color="#ff6644" /> RESTRICTED SENIOR BOARD ACCESS
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 18 }}>
              <label className="sr-login-label">USERNAME</label>
              <input type="text" className="sr-login-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" autoComplete="username" required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label className="sr-login-label">PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="sr-login-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  style={{ paddingRight: 46 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,80,40,0.6)" }}>
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="sr-login-btn" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <ZapIcon size={16} /> {loading ? "AUTHENTICATING..." : "AUTHENTICATE"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 22, fontSize: 9, color: "rgba(255,60,0,0.22)", letterSpacing: "0.2em" }}>
            RESTRICTED ACCESS — SENIOR ADMINS ONLY
          </p>
        </div>
      </div>
    </>
  );
}

