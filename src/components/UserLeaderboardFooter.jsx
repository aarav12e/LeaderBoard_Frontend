import { useState } from "react";
import { MailIcon } from "./Icons";

const foundingMembers = [
  { name: "Aarav Kumar", role: "President", image: "/members/aarav.jpeg", link: "https://www.linkedin.com/in/aarav12e/" },
  { name: "Aakash Mandal", role: "Vice President", image: "/members/aakash.jpeg", link: "https://www.linkedin.com/in/aakash-mandal-012444372/" },
  { name: "Archana Kumari", role: "Secretary", image: "/members/archana.jpeg", link: "https://www.linkedin.com/in/archana-kumari-601306328/" },
  { name: "Kajal", role: "Media Head", image: "/members/kajal.jpeg", link: "https://www.linkedin.com/in/kajal-singh-59a20b362/" },
  { name: "Ishant Raj", role: "Technical Head", image: "/members/ishant.jpeg", link: "https://www.linkedin.com/in/ishant-raj-b82901219/" },
  { name: "Sudhanshu Kumar", role: "Data Scientist", image: "/members/sudhanshu.jpeg", link: "https://www.linkedin.com/in/sudhanshu015/" },
  { name: "Tanya Kumari", role: "Frontend wizard", image: "/members/tanya.jpeg", link: "https://www.linkedin.com/in/tanya-kumari-067362367/" },
  { name: "Ekta Sharma", role: "Event coordinator", image: "/members/ekta.jpeg", link: "https://www.linkedin.com/in/ekta-sharma-171381382/" },
  { name: "Priyanshu Priyesh", role: "Manager", image: "/members/priyanshu.jpeg", link: "https://www.linkedin.com/in/priyanshu-priyesh-82038a328?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
];

const batchMembers = [
  { name: "Anupam", role: "President", image: "/Batch25-29/anupam.jpeg", github: "https://github.com/anupamguptaji123-droid", link: "https://www.linkedin.com/in/anupam-kumari-8167aa3a8" },
  { name: "Nikhil", role: "Technical Head", image: "/Batch25-29/nikhil.jpeg", github: "https://github.com/nikhilkumar95f", link: "https://www.linkedin.com/in/nikhil-kumar-0n7" },
  { name: "Kavyansh", role: "Lead Organizer", image: "/Batch25-29/kavyansh.jpeg", github: "https://github.com/kavyanshsharma423-beep", link: "https://www.linkedin.com/in/kavyansh-sharma-6a6bb9381/" },
  { name: "Mungesh", role: "Operations & Execution Lead", image: "/Batch25-29/mungesh.jpeg", github: "https://github.com/mungesh2006", link: "https://www.linkedin.com/in/mungesh-jaiswal-54a7b2381" },
  { name: "Abhishek singh", role: "Media head", image: "/Batch25-29/Abhishek.jpeg", github: "https://github.com/abhisheksingh831895-dev", link: "https://www.linkedin.com/in/abhishek-singh-b69001382/" }
];

function MemberCard({ member, isBatch }) {
  const primaryLink = member.link || member.github;
  const [imageFailed, setImageFailed] = useState(false);

  const handleCardClick = (e) => {
    // If user specifically clicked an inner button like GH or LI, let that link navigate directly
    if (e.target.closest(".batch-links a") || e.target.closest(".founder-link")) return;
    if (primaryLink) {
      window.open(primaryLink, "_blank", "noopener,noreferrer");
    }
  };

  const portrait = imageFailed ? (
    <span className="founder-avatar founder-avatar-fallback" aria-hidden="true">
      {member.name.slice(0, 2).toUpperCase()}
    </span>
  ) : (
    <img
      className="founder-avatar"
      src={member.image}
      alt={`${member.name}, ${member.role}`}
      loading="lazy"
      onError={() => setImageFailed(true)}
    />
  );

  return (
    <div
      className="founder-card marquee-card"
      onClick={handleCardClick}
      style={{ cursor: primaryLink ? "pointer" : "default" }}
      role={primaryLink ? "link" : undefined}
      tabIndex={primaryLink ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === "Enter" && primaryLink) {
          window.open(primaryLink, "_blank", "noopener,noreferrer");
        }
      }}
    >
      <div className="founder-portrait-wrap">
        {primaryLink ? (
          <a
            className="founder-portrait-link"
            href={primaryLink}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${member.name}'s profile`}
            onClick={(e) => e.stopPropagation()}
          >
            {portrait}
          </a>
        ) : (
          portrait
        )}

        {primaryLink && (
          <a
            className="founder-link"
            href={primaryLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Open ${member.name}'s profile`}
            title={`View ${member.name}'s profile`}
          >
            ↗
          </a>
        )}
      </div>

      <div className="founder-copy">
        <strong>{member.name}</strong>
        <span>{member.role}</span>
      </div>

      {isBatch && (
        <div className="batch-links" onClick={(e) => e.stopPropagation()}>
          {member.link && (
            <a
              href={member.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${member.name}'s LinkedIn profile`}
            >
              LI
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${member.name}'s GitHub profile`}
            >
              GH
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function HorizontalMemberScroller({ items, isBatch = false, duration = 48, direction = "rtl", isHovered, onHoverChange }) {
  // Repeating list twice ensures seamless infinite loop
  const displayItems = [...items, ...items];

  return (
    <div
      className={`horizontal-marquee-viewport${isHovered ? " is-paused" : ""}`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      title="Hover to pause · Click any image to open profile"
    >
      <div
        className={`horizontal-marquee-track direction-${direction}`}
        style={{
          animationDuration: `${duration}s`,
          animationPlayState: isHovered ? "paused" : "running",
        }}
      >
        <div className="horizontal-marquee-group">
          {displayItems.map((member, i) => (
            <MemberCard key={`${member.name}-h1-${i}`} member={member} isBatch={isBatch} />
          ))}
        </div>
        <div className="horizontal-marquee-group" aria-hidden="true">
          {displayItems.map((member, i) => (
            <MemberCard key={`${member.name}-h2-${i}`} member={member} isBatch={isBatch} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UserLeaderboardFooter({ sorted, top3, totalPts, podiumRef }) {
  const [foundersOpen, setFoundersOpen] = useState(true);
  const [batchOpen, setBatchOpen] = useState(true);
  const [foundersHovered, setFoundersHovered] = useState(false);
  const [batchHovered, setBatchHovered] = useState(false);

  return (
    <footer className="lb-footer">
      <style>{`
        /* Right-to-Left Scroll (Founding Team) */
        @keyframes marqueeRightToLeft {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Left-to-Right Scroll (Batch 25-29) */
        @keyframes marqueeLeftToRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .horizontal-marquee-viewport {
          position: relative;
          width: 100%;
          overflow: hidden;
          margin-top: 14px;
          padding: 8px 0;
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
          touch-action: manipulation;
        }

        .horizontal-marquee-track {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          width: max-content;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        .horizontal-marquee-track.direction-rtl {
          animation-name: marqueeRightToLeft;
        }

        .horizontal-marquee-track.direction-ltr {
          animation-name: marqueeLeftToRight;
        }

        .horizontal-marquee-viewport:hover .horizontal-marquee-track,
        .horizontal-marquee-viewport.is-paused .horizontal-marquee-track {
          animation-play-state: paused !important;
        }

        .horizontal-marquee-group {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: clamp(10px, 1.4vw, 16px);
          padding-right: clamp(10px, 1.4vw, 16px);
          flex-shrink: 0;
        }

        .marquee-card {
          flex: 0 0 auto;
          width: clamp(160px, 20vw, 210px);
          position: relative;
          padding: 10px;
          border-radius: 4px;
          background: rgba(0, 255, 160, 0.035);
          border: 1px solid rgba(0, 255, 160, 0.12);
          transition: transform 0.22s, border-color 0.22s, background 0.22s, box-shadow 0.22s;
          touch-action: manipulation;
          -webkit-tap-highlight-color: rgba(0, 255, 200, 0.2);
          cursor: pointer;
          user-select: none;
        }

        .marquee-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 255, 160, 0.48);
          background: rgba(0, 255, 160, 0.08);
          box-shadow: 0 0 20px rgba(0, 255, 160, 0.12);
        }

        .founder-portrait-wrap {
          position: relative;
          width: 100%;
        }

        .founder-portrait-link {
          display: block;
          text-decoration: none;
          cursor: pointer;
        }

        .founder-avatar {
          display: block;
          width: 100%;
          aspect-ratio: 1 / 1;
          object-fit: cover;
          object-position: center 28%;
          border-radius: 2px;
          border: 1px solid rgba(0, 255, 160, 0.38);
          box-shadow: 0 0 14px rgba(0, 255, 160, 0.1);
          transition: transform 0.25s, border-color 0.25s;
        }

        .marquee-card:hover .founder-avatar {
          border-color: rgba(0, 255, 160, 0.75);
        }

        .founder-link {
          position: absolute;
          top: 8px;
          right: 8px;
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          padding: 0 !important;
          border: 1px solid rgba(0, 170, 255, 0.5) !important;
          background: rgba(0, 4, 14, 0.85);
          color: #00aaff !important;
          font-size: 13px !important;
          border-radius: 3px;
          text-decoration: none;
          transition: all 0.2s;
          z-index: 2;
        }

        .founder-link:hover {
          background: rgba(0, 170, 255, 0.25);
          box-shadow: 0 0 12px rgba(0, 170, 255, 0.4);
        }

        .founder-copy {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          padding: 10px 2px 2px;
        }

        .founder-copy strong {
          font-family: 'Share Tech Mono', monospace;
          color: #e0ffe8;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .founder-copy span {
          font-family: 'Share Tech Mono', monospace;
          border: 0;
          padding: 0;
          font-size: 9px;
          color: rgba(0, 255, 160, 0.5);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .scroller-status-pill {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          padding: 3px 8px;
          border-radius: 2px;
          border: 1px solid rgba(0, 255, 160, 0.25);
          background: rgba(0, 255, 160, 0.06);
          color: rgba(0, 255, 160, 0.85);
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.2s;
        }

        .scroller-status-pill.is-paused {
          border-color: rgba(255, 200, 0, 0.4);
          background: rgba(255, 200, 0, 0.1);
          color: #ffd700;
        }

        .batch-toggle-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .marquee-card {
            width: 145px;
            padding: 8px;
          }
          .founder-copy strong {
            font-size: 11px;
          }
          .founder-copy span {
            font-size: 8px;
          }
        }
      `}</style>

      <div className="footer-top">
        <div className="footer-brand">
          <h3>IGNITE_CLUB</h3>
          <p>CodeCraft 2026<br />NEURAL LEADERBOARD<br />VISHVESHWARYA GROUP OF INSTITUTIONS</p>
          <p className="footer-brand-note">A student-led space for builders, problem-solvers, and curious minds.</p>
          <div style={{ marginTop: 16, height: 1, background: "linear-gradient(90deg,rgba(0,255,160,0.3),transparent)" }} />
          <p style={{ marginTop: 12, fontSize: 10, color: "rgba(0,255,160,0.2)", letterSpacing: "0.08em" }}>TRACKING {sorted.length} OPERATIVES · {totalPts} TOTAL XP</p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>↑ Top of Leaderboard</a>
          <a href="#" onClick={e => { e.preventDefault(); podiumRef.current?.scrollIntoView({ behavior: "smooth" }); }}>◈ Elite Podium</a>
          <span style={{ cursor: "default" }}>⬡ Search Operatives</span>
          <a href="https://www.linkedin.com/in/aarav12e/" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <MailIcon size={13} /> Contact Admin
          </a>
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

      <section id="founding-team" className="footer-founders" aria-labelledby="founding-team-title">
        <div className="founder-heading">
          <div>
            <p className="founder-kicker">THE PEOPLE BEHIND THE SIGNAL</p>
            <button className={`founder-toggle${foundersOpen ? " is-open" : ""}`} type="button" onClick={() => setFoundersOpen(open => !open)} aria-expanded={foundersOpen}>
              <h4 id="founding-team-title">Founding Team</h4>
              <span className="batch-toggle-icon" aria-hidden="true">⌄</span>
            </button>
          </div>
          <p className="founder-intro">Built by students. Driven by curiosity.</p>
        </div>
        <div className={`batch-content${foundersOpen ? " is-open" : ""}`}>
          <HorizontalMemberScroller
            items={foundingMembers}
            isBatch={false}
            duration={54}
            direction="rtl"
            isHovered={foundersHovered}
            onHoverChange={setFoundersHovered}
          />
        </div>
      </section>

      <section id="batch-25-29" className="batch-section" aria-labelledby="batch-team-title">
        <button className={`batch-toggle${batchOpen ? " is-open" : ""}`} type="button" onClick={() => setBatchOpen(open => !open)} aria-expanded={batchOpen}>
          <span>
            <small>NEW MEMBER DIRECTORY</small>
            <strong id="batch-team-title">Batch 25-29</strong>
          </span>
          <span className="batch-toggle-icon" aria-hidden="true">⌄</span>
        </button>
        <div className={`batch-content${batchOpen ? " is-open" : ""}`}>
          <p className="batch-intro">Meet the next wave of Ignite Club members.</p>
          <HorizontalMemberScroller
            items={batchMembers}
            isBatch={true}
            duration={44}
            direction="ltr"
            isHovered={batchHovered}
            onHoverChange={setBatchHovered}
          />
        </div>
      </section>

      <div className="footer-bottom">
        <p>© 2026 IGNITE CLUB — CodeCraft · ALL NODES SECURED</p>
        <div className="footer-socials">
          <a href="https://www.linkedin.com/in/aarav12e/" target="_blank" rel="noreferrer">⬡ LINKEDIN</a>
          <a href="https://github.com" target="_blank" rel="noreferrer">⬡ GITHUB</a>
          <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>↑ BACK TO TOP</a>
        </div>
      </div>
    </footer>
  );
}
