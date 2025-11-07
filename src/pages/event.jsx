import React from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { evenements } from "../data/evenements";
import { Link, useNavigate } from "react-router-dom";

function Event() {
  const navigate = useNavigate();

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
      console.error("Failed to parse user from localStorage", error);
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
  ];
  const Pages = [
    ...basePages,
    { label: "Gestion Apprentis", path: "/gestion-apprentis" }, // La page en plus
  ];
  const pagesToDisplay = userRole === 2 ? coordinateurPages : basePages;

  const evenementsAVenir = evenements
    .filter(event => {
      const eventDate = new Date(event.date);
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      return eventDate >= aujourdhui;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Fonction pour formater la date
  const formatDateComplete = (dateString) => {
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <>
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

      <main className="main-content">
        <section className="events-page-container">
          <h1 className="events-page-title">Prochains Événements & Ateliers</h1>
          
          <div className="events-grid">
            {evenementsAVenir.length > 0 ? (
              evenementsAVenir.map((event) => (
                <article key={event.id} className="event-full-card">
                  <div className="event-full-header">
                    <h2 className="event-full-title">{event.titre}</h2>
                    <span className={`event-full-type type-${event.type.toLowerCase().replace(/\s+/g, '-')}`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="event-full-infos">
                    <span>📅 {formatDateComplete(event.date)}</span>
                    <span>🕐 {event.heure}</span>
                    <span>📍 {event.lieu}</span>
                  </div>
                  
                  <p className="event-full-description">{event.description}</p>
                </article>
              ))
            ) : (
              <p className="no-events-message">Aucun événement à venir pour le moment.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Event;