import React from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
// Ce composant est un placeholder pour votre future page de gestion.
function Gestion() {
  const navigate = useNavigate();
  // --- On réutilise la même barre de navigation que sur les autres pages ---
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const getUser = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      return null;
    }
  };
  const currentUser = getUser();
  const userRole = currentUser ? currentUser.role : null;
  const basePages = [
    { label: "Journal de Formation", path: "/journal" },
    { label: "Documents", path: "/documents" },
    { label: "Evénements", path: "/evenements" },
    { label: "Notifications", path: "/notifications" },
    { label: "Livret", path: "/livret" }, 
  ];
  const coordinateurPages = [
    ...basePages,
    { label: "Gestion", path: "/gestion" },
  ];
  const pagesToDisplay = userRole === 2 ? coordinateurPages : basePages;
  // --- Fin de la logique de navigation ---
  return (
    <>
      {/* Barre de navigation réutilisée */}
      <header className="site-header" role="banner">
        <div className="header-inner">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Logo" className="site-logo" />
          </Link>
        </div>
      </header>
      <nav className="topnav" aria-label="Navigation principale">
        <ul className="topnav-list">
          {pagesToDisplay.map((page) => (
            <li key={page.path} className="topnav-item">
              <Link to={page.path} className="topnav-link">
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button type="button" className="logout-button" onClick={handleLogout}>Déconnexion</button>
    </>
  )
}

export default Gestion;