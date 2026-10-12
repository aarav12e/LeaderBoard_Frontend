import { useState } from "react";

const links = [
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Founding Team", href: "#founding-team" },
  { label: "Batch 25-29", href: "#batch-25-29" },
];

export default function LeaderboardNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="leader-nav" aria-label="Primary navigation">
      <a className="leader-brand" href="#top" onClick={closeMenu} aria-label="Ignite Club home">
        <span className="leader-brand-mark">I</span>
        <span><strong>IGNITE</strong><small>CLUB / CodeCraft</small></span>
      </a>

      <button className={`leader-menu-button${menuOpen ? " is-open" : ""}`} type="button" onClick={() => setMenuOpen(open => !open)} aria-expanded={menuOpen} aria-controls="leader-nav-links">
        <span />
        <span />
        <span />
        <b>Menu</b>
      </button>

      <div id="leader-nav-links" className={`leader-nav-links${menuOpen ? " is-open" : ""}`}>
        {links.map(link => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>)}
      </div>
    </nav>
  );
}
