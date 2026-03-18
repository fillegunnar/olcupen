import { useState } from "react";
import "./App.css";
import Home from "./Home";
import Rules from "./Rules";
import Contact from "./Contact";

type Page = "home" | "rules" | "contact";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <nav className="nav">
        <button className="nav-brand" onClick={() => navigate("home")}>
          <img src="/img/logga-olcupen.png" alt="Ölcupen" />
          <span>Ölcupen</span>
        </button>

        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meny"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          <li>
            <button
              className={page === "home" ? "active" : ""}
              onClick={() => navigate("home")}
            >
              Hem
            </button>
          </li>
          <li>
            <button
              className={page === "rules" ? "active" : ""}
              onClick={() => navigate("rules")}
            >
              Regler
            </button>
          </li>
          <li>
            <button
              className={page === "contact" ? "active" : ""}
              onClick={() => navigate("contact")}
            >
              Kontakt
            </button>
          </li>
        </ul>
      </nav>

      {page === "home" && <Home />}
      {page === "rules" && <Rules />}
      {page === "contact" && <Contact />}

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
    </div>
  );
}

export default App;
