import React from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { notifications } from "../data/notifications";
import { evenements } from "../data/evenements";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  // Contacts (plus tard depuis BDD) - si null ou undefined, ne s'affiche pas
  const contacts = [
    {
      id: 1,
      role: "Maître d'apprentissage",
      nom: "Jane Doe",
      telephone: "06 12 34 56 78",
      email: "jane.doe@example.com"
    },
    {
      id: 2,
      role: "Tuteur pédagogique",
      nom: "John Smith",
      telephone: "06 98 76 54 32",
      email: "john.smith@example.com"
    },
    {
      id: 3,
      role: "Coordinatrice",
      nom: "Marie Dupont",
      telephone: "06 11 22 33 44",
      email: "marie.dupont@example.com"
    },
    // Exemple : si Jury 1 n'existe pas dans la BDD, on ne l'ajoute pas au tableau
    // ou on le met à null et on filtre
    {
      id: 4,
      role: "Jury 1",
      nom: "Pierre Martin",
      telephone: "06 55 66 77 88",
      email: "pierre.martin@example.com"
    },
    // null sera ignoré
  ];

  // Formulaires à compléter (plus tard depuis BDD)
  const formulaires = [
    {
      id: 1,
      nom: "Évaluation mi-parcours",
      dateOuverture: "2025-09-15",
      dateFermeture: "2025-10-15",
      signe: false
    },
    {
      id: 2,
      nom: "Bilan de compétences",
      dateOuverture: "2025-10-01",
      dateFermeture: "2025-10-31",
      signe: true   // déjà signé = ne s'affiche pas
    },
    {
      id: 3,
      nom: "Enquête de satisfaction",
      dateOuverture: "2025-10-01",
      dateFermeture: "2025-10-05",  // Ferme dans moins d'une semaine
      signe: false
    },
    {
      id: 4,
      nom: "Fiche de présence septembre",
      dateOuverture: "2025-09-01",
      dateFermeture: "2025-09-30",  // Déjà fermé
      signe: false
    },
    {
      id: 5,
      nom: "Auto-évaluation compétences",
      dateOuverture: "2025-09-20",
      dateFermeture: "2025-11-20",  // Encore largement ouvert
      signe: false
    },
    {
      id: 6,
      nom: "Formulaire futur",
      dateOuverture: "2025-11-01",  // Pas encore ouvert
      dateFermeture: "2025-11-30",
      signe: false
    },
  ];

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
  { label: "Evénements", path: "/evenements" },
  { label: "Notifications", path: "/notifications" },
  ];
  const Pages = [
    ...basePages,
    { label: "Gestion", path: "/gestion" }, // La page en plus
  ];
  const pagesToDisplay = userRole === 2 ? Pages : basePages;

  // Fonction pour calculer le statut automatiquement
  const getStatut = (dateOuverture, dateFermeture) => {
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0); // Réinitialise l'heure pour comparer uniquement les dates
    
    const ouverture = new Date(dateOuverture);
    ouverture.setHours(0, 0, 0, 0);
    
    const fermeture = new Date(dateFermeture);
    fermeture.setHours(0, 0, 0, 0);
    // Si pas encore ouvert
    if (aujourdhui < ouverture) {
      return 'pas_ouvert';
    }
    // Si déjà fermé
    if (aujourdhui > fermeture) {
      return 'ferme';
    }
    // Calcul du nombre de jours avant la fermeture
    const joursRestants = Math.ceil((fermeture - aujourdhui) / (1000 * 60 * 60 * 24));
    // Si moins de 7 jours avant fermeture
    if (joursRestants <= 7) {
      return 'bientot_ferme';
    }
    // Sinon, c'est ouvert normalement
    return 'ouvert';
  };
  // Ajoute le statut calculé à chaque formulaire et filtre
  const formulairesAfficher = formulaires
    .map(form => ({
      ...form,
      statut: getStatut(form.dateOuverture, form.dateFermeture)
    }))
    .filter(form => 
      !form.signe && 
      (form.statut === 'ouvert' || form.statut === 'bientot_ferme')
    );

// Filtre les événements à venir (pas encore passés)
const evenementsAVenir = evenements
  .filter(event => {
    const eventDate = new Date(event.date);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    return eventDate >= aujourdhui;
  })
  .sort((a, b) => new Date(a.date) - new Date(b.date)); // Trie par date
// Fonction pour formater les dates
const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};
// Fonction pour formater date avec jour de la semaine
const formatDateComplete = (dateString) => {
  const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const READ_KEY = "readNotificationIds_v1";
function getReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}
// Filtrer uniquement les nouvelles (isNew ET pas dans lus)
const readIds = getReadIds();
const newNotifications = notifications
  .map(n => ({ ...n, isNew: n.isNew && !readIds.has(n.id) }))
  .filter(n => n.isNew);

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
      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
        aria-label="Se déconnecter"
        title="Se déconnecter"
      > Déconnexion </button>

      <main className="main-content">
        <section className="cards-grid">
          {userRole !== 2 && (
            <article className="card card--coordonnees">
              <h2 className="card-title">Coordonnées</h2>
              <div className="contacts-container">
                {contacts.map((contact) => (
                  <div key={contact.id} className="contact-card">
                    <h3 className="contact-role">{contact.role}</h3>
                    <ul className="contact-details">
                      <li><strong>Nom:</strong> {contact.nom}</li>
                      <li><strong>Téléphone:</strong> {contact.telephone}</li>
                      <li><strong>Email:</strong> {contact.email}</li>
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          )}

          <article className="card card--formulaires">
            <h2 className="card-title">Formulaires à compléter</h2>
            <div className="formulaires-list">
              {formulairesAfficher.length > 0 ? (
                formulairesAfficher.map((form) => (
                  <div key={form.id} className={`formulaire-item status-${form.statut}`}>
                    <div className="formulaire-header">
                      <h3 className="formulaire-nom">{form.nom}</h3>
                      <span className={`formulaire-badge badge-${form.statut}`}>
                        {form.statut === 'ouvert' ? 'Ouvert' : 'Bientôt fermé'}
                      </span>
                    </div>
                    <div className="formulaire-dates">
                      <span className="date-info">
                        <strong>Ouverture:</strong> {formatDate(form.dateOuverture)}
                      </span>
                      <span className="date-info">
                        <strong>Fermeture:</strong> {formatDate(form.dateFermeture)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-formulaires">Aucun formulaire à compléter pour le moment.</p>
              )}
            </div>
          </article>

          <article className="card card--notifications">
            <h2 className="card-title">Notifications</h2>
            <div className="notifications-list">
              {newNotifications.length > 0 ? (
                newNotifications.map((notif) => (
                  <div key={notif.id} className="notification-item new" title={notif.message}>
                    <span className="notification-text">{notif.message}</span>
                  </div>
                ))
              ) : (
                <p className="no-notifications">Aucune nouvelle notification.</p>
              )}
            </div>
          </article>

          <article className="card card--evenements">
            <h2 className="card-title">Événements & Ateliers</h2>
            <div className="evenements-list">
              {evenementsAVenir.length > 0 ? (
                evenementsAVenir.map((event) => (
                  <div key={event.id} className="evenement-item">
                    <div className="evenement-date-block">
                      <span className="evenement-jour">{new Date(event.date).getDate()}</span>
                      <span className="evenement-mois">
                        {new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                    </div>
                    <div className="evenement-details">
                      <div className="evenement-header">
                        <h3 className="evenement-titre">{event.titre}</h3>
                        <span className={`evenement-type type-${event.type.toLowerCase().replace(/\s+/g, '-')}`}>
                          {event.type}
                        </span>
                      </div>
                      <p className="evenement-description">{event.description}</p>
                      <div className="evenement-infos">
                        <span className="evenement-info">
                          <strong>📅</strong> {formatDateComplete(event.date)}
                        </span>
                        <span className="evenement-info">
                          <strong>🕐</strong> {event.heure}
                        </span>
                        <span className="evenement-info">
                          <strong>📍</strong> {event.lieu}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-evenements">Aucun événement prévu pour le moment.</p>
              )}
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export default Home;