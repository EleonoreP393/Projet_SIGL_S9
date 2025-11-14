import React, { useState, useEffect } from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { evenements } from "../data/evenements";
import { Link, useNavigate } from "react-router-dom";

function Event() {
  const navigate = useNavigate();

  // --- GESTION DES DONNÉES ET DES ÉTATS ---
  const [events, setEvents] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    titre: "", date: "", heure: "", lieu: "", type: "Atelier", description: ""
  });
  const [error, setError] = useState(""); // Pour afficher les erreurs du formulaire

  // --- RÉCUPÉRATION DES ÉVÉNEMENTS DEPUIS L'API AU CHARGEMENT ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/evenements"); // Assurez-vous d'avoir une route GET
        const data = await response.json();
        if (data.success) {
          setEvents(data.evenements);
        }
      } catch (err) {
        console.error("Impossible de charger les événements:", err);
      }
    };
    // fetchEvents(); // Décommentez ceci quand votre route GET /api/evenements sera prête
  }, []);

  // --- LOGIQUE DE NAVIGATION ET DE RÔLE ---
  const handleSelectionChange = (eventId) => {
  const newSelection = new Set(selectedEvents);
    if (newSelection.has(eventId)) {
      newSelection.delete(eventId);
    } else {
      newSelection.add(eventId);
    }
    setSelectedEvents(newSelection);
  };
  const handleDeleteSelected = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedEvents.size} événement(s) ?`)) {
      setEvents(prevEvents => prevEvents.filter(event => !selectedEvents.has(event.id)));
      setIsDeleteMode(false);
      setSelectedEvents(new Set());
    }
  };

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
    { label: "Gestion", path: "/gestion" }, // La page en plus
  ];
  const pagesToDisplay = userRole === 2 ? Pages : basePages;

  // --- LOGIQUE DU FORMULAIRE ET DE L'AJOUT ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  const handleAddEvent = async (e) => {
    e.preventDefault();
    setError(""); // Réinitialise les erreurs
    try {
      const response = await fetch("/api/evenements", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Une erreur est survenue.");
      }
      // Ajoute le nouvel événement à la liste pour une mise à jour instantanée
      // L'idéal est de récupérer l'événement complet renvoyé par l'API
      setEvents(prevEvents => [...prevEvents, { ...newEvent, id: data.insertedId }]);
      
      // Ferme le modal et réinitialise le formulaire
      setIsModalOpen(false);
      setNewEvent({ titre: "", date: "", heure: "", lieu: "", type: "Atelier", description: "" });
    } catch (err) {
      setError(err.message);
    }
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
          {/* On groupe le titre et les boutons pour un meilleur alignement */}
          <div className="page-header-actions">
            <h1 className="events-page-title">Prochains Événements & Ateliers</h1>
            {/* Conteneur pour les boutons d'administration */}
            {userRole === 2 && (
              <div className="admin-actions">
                <button className="add-event-button" onClick={() => setIsModalOpen(true)}>Ajouter</button>
                <button className="delete-mode-button" onClick={() => { setIsDeleteMode(!isDeleteMode); setSelectedEvents(new Set());}}>
                  {isDeleteMode ? 'Annuler' : 'Supprimer'}
                </button>
              </div>
            )}
          </div>
          {/* --- BARRE DE CONFIRMATION --- */}
          {/* Ne s'affiche que si on est en mode suppression ET qu'au moins 1 élément est coché */}
          {isDeleteMode && selectedEvents.size > 0 && (
            <div className="delete-confirmation-bar">
              <span>{selectedEvents.size} événement(s) sélectionné(s)</span>
              <button onClick={handleDeleteSelected}>Confirmer la Suppression</button>
            </div>
          )}
          <div className="events-grid">
            {evenementsAVenir.length > 0 ? (
              evenementsAVenir.map((event) => (

                // On ajoute une classe 'selectable' et un écouteur de clic sur la carte entière
                <article 
                  key={event.id} 
                  className={`event-full-card ${isDeleteMode ? 'selectable' : ''}`}
                  onClick={() => isDeleteMode && handleSelectionChange(event.id)} // Permet de cliquer sur la carte pour cocher
                >

                  {/* --- CASE À COCHER --- */}
                  {/* Ne s'affiche qu'en mode suppression */}
                  {isDeleteMode && (
                    <input
                      type="checkbox"
                      className="event-selection-checkbox"
                      checked={selectedEvents.has(event.id)}
                      readOnly // On la met en lecture seule car le clic est géré par la carte
                    />
                  )}
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
      {/* --- FORMULAIRE MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nouvel Événement</h2>
            <form onSubmit={handleAddEvent} className="modal-form">
              <input name="titre" value={newEvent.titre} onChange={handleInputChange} placeholder="Titre de l'événement" required />
              <input name="date" type="date" value={newEvent.date} onChange={handleInputChange} required />
              <input name="heure" type="time" value={newEvent.heure} onChange={handleInputChange} required />
              <input name="lieu" value={newEvent.lieu} onChange={handleInputChange} placeholder="Lieu" required />
              <select name="type" value={newEvent.type} onChange={handleInputChange}>
                <option>Atelier</option>
                <option>Concert</option>
                <option>Audition</option>
                <option>Scène Ouverte</option>
                <option>Jam Session</option>
                <option>Master Class</option>
              </select>
              <textarea name="description" value={newEvent.description} onChange={handleInputChange} placeholder="Description..."></textarea>
              
              {/* Affichage des erreurs */}
              {error && <p className="modal-error">{error}</p>}
              
              <div className="modal-actions">
                <button type="button" onClick={() => { setIsModalOpen(false); setError(""); }}>Annuler</button>
                <button type="submit">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Event;