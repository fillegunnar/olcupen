import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Rules from "./Rules";
import Contact from "./Contact";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <NavLink className="nav-brand" to="/" onClick={() => setMenuOpen(false)}>
        <img src="/img/logga-olcupen.png" alt="Ölcupen" />
        <span>Ölcupen</span>
      </NavLink>

      <button
        className="nav-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Meny"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        <li>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            Hem
          </NavLink>
        </li>
        <li>
          <NavLink to="/rules" onClick={() => setMenuOpen(false)}>
            Regler
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
            Kontakt
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-socials">
        <a
          href="https://www.instagram.com/loaolcup/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/img/instagram.png" alt="Instagram" />
        </a>
        <a
          href="https://www.facebook.com/loaolcup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/img/facebook.png" alt="Facebook" />
        </a>
      </div>
      <p>© 2016–2025 Ölcupen. Est. 2016.</p>
    </footer>
  );
}

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
