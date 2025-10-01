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
    </>
  );
}

export default Home;