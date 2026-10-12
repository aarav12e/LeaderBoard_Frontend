import { useState } from "react";

const links = [
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "Founding Team", href: "#founding-team" },
  { label: "Batch 25-29", href: "#batch-25-29" },
];

export default function SeniorLeaderboardNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sr-leader-nav" aria-label="Senior leaderboard navigation">
      <a className="sr-leader-brand" href="#top" onClick={closeMenu} aria-label="Ignite Club Senior home">
        <span className="sr-leader-brand-mark">S</span>
        <span><strong>SENIOR</strong><small>IGNITE CLUB / CodeCraft</small></span>
      </a>

      <button
        className={`sr-leader-menu-button${menuOpen ? " is-open" : ""}`}
        type="button"
        onClick={() => setMenuOpen(open => !open)}
        aria-expanded={menuOpen}
        aria-controls="sr-leader-nav-links"
      >
        <span /><span /><span />
        <b>Menu</b>
      </button>

      <div id="sr-leader-nav-links" className={`sr-leader-nav-links${menuOpen ? " is-open" : ""}`}>
        {links.map(link => <a key={link.href} href={link.href} onClick={closeMenu}>{link.label}</a>)}
      </div>
    </nav>
  );
}
