import React from "react";
import "../style/style.css";
import logo from "../assets/logo.png";

function Home() {
  const pages = ["Journal de Formation", "Documents", "Evénements", "Notifications", "Livret" ]; // labels du bandeau

  return (
    <>
      <header className="site-header" role="banner">
        <div className="header-inner">
          <img src={logo} alt="Logo" className="site-logo" />
          <div className="center-block">
            <h1 className="site-title">Accueil</h1>
          </div>
        </div>
      </header>

      <nav className="topnav" aria-label="Navigation principale">
        <ul className="topnav-list">
          {pages.map((label) => (
            <li key={label} className="topnav-item">
              <a href="#" className="topnav-link" onClick={(e) => e.preventDefault()} /* empêche la navigation */>{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="bubbles-section" aria-label="Services">
        <div className="bubbles-column">
          <div className="bubble_left">
            <span className="bubble-icon">Coordonnées</span>
            <p className="bubble-label">Titre 1</p>
          </div>

          <div className="bubble_center">
            <span className="bubble-icon">Formulaires à remplir</span>
            <p className="bubble-label">Titre 2</p>
          </div>

          <div className="bubble_right">
            <span className="bubble-icon">Notifications</span>
            <p className="bubble-label">Titre 3</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;