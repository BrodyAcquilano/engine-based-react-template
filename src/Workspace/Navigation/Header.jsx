import { useState } from "react";
import { NavLink } from "react-router";

import "./Header.css";

function Header({ pagesConfig = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-title">
        React Engine Template
      </div>

      <button
        type="button"
        className="header-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="header-navigation"
        aria-label="Toggle navigation menu"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        ☰
      </button>

      <nav
        id="header-navigation"
        className={`header-navigation ${menuOpen ? "open" : ""}`}
        aria-label="Navigation"
      >
        <NavLink
          to="/"
          end
          onClick={closeMenu}
        >
          Workspace 1
        </NavLink>

        {pagesConfig.map(({ key, path, label }) => (
          <NavLink
            key={key}
            to={`/${path}`}
            onClick={closeMenu}
          >
            {label}
          </NavLink>
        ))}

        <NavLink
          to="/workspace2"
          onClick={closeMenu}
        >
          Workspace 2
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;