import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { InstagramIcon, FacebookIcon } from "./icons";
import "./App.css";
import Home from "./pages/Home/Home";
import Rules from "./pages/Rules/Rules";
import Contact from "./pages/Contact/Contact";
import Olabladet from "./pages/Olabladet/Olabladet";
import Tournament from "./pages/Tournament/Tournament";

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
        <img
          src={import.meta.env.BASE_URL + "img/logga-olcupen-2.webp"}
          alt="Ölcupen"
        />
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
          <NavLink to="/tournament" onClick={() => setMenuOpen(false)}>
            Turnering
          </NavLink>
        </li>
        <li>
          <NavLink to="/olabladet" onClick={() => setMenuOpen(false)}>
            Ölabladet
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
          aria-label="Instagram"
        >
          <InstagramIcon size={28} />
        </a>
        <a
          href="https://www.facebook.com/loaolcup"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FacebookIcon size={28} />
        </a>
      </div>
      <p>Hörs hej!</p>
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
        <Route path="/tournament" element={<Tournament />} />
        <Route path="/olabladet" element={<Olabladet />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
