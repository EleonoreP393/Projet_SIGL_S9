import React from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { evenements } from "../data/evenements";

function Event() {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.replace("/login");
  };

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
              <li className="topnav-item"><Link to="/journal" className="topnav-link">Journal de Formation</Link></li>
              <li className="topnav-item"><Link to="/evenements" className="topnav-link">Événements</Link></li>
              <li className="topnav-item"><Link to="/documents" className="topnav-link">Documents</Link></li>
              <li className="topnav-item"><Link to="/notifications" className="topnav-link">Notifications</Link></li>
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