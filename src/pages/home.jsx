import React, { useMemo, useState, useEffect }  from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { notifications } from "../data/notifications";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  // --- ÉTAT POUR LES ÉVÉNEMENTS DE LA BDD ---
  const [events, setEvents] = React.useState([]);
  const [eventsError, setEventsError] = React.useState(null);
  const [eventsLoading, setEventsLoading] = React.useState(true);

  // --- ÉTAT POUR LES LIVRABLES DE LA BDD ---
  const [livrables, setLivrables] = React.useState([]);
  const [livrablesError, setLivrablesError] = React.useState(null);
  const [livrablesLoading, setLivrablesLoading] = React.useState(true);

  // --- ÉTAT POUR LES CONTACTS DE LA BDD ---
  const [contacts, setContacts] = React.useState([]);
  const [contactsError, setContactsError] = React.useState(null);
  const [contactsLoading, setContactsLoading] = React.useState(true);

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
  
  // Fonction pour obtenir le rôle en fonction de l'idRole
  const getRoleLabel = (idRole) => {
    const roles = {
      2: "Coordinatrice",
      3: "Tuteur pédagogique",
      4: "Jury",
      5: "Maître d'apprentissage"
    };
    return roles[idRole] || "Rôle inconnu";
  };
  
  const currentUser = getUser();
  const userRole = currentUser ? currentUser.idRole : null;

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

  // --- CHARGEMENT DES ÉVÉNEMENTS DEPUIS L'API ---
  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/searchAllEvenement", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          setEvents(data.evenements || []);
        } else {
          throw new Error(data.error || "Erreur lors du chargement des événements.");
        }
      } catch (err) {
        console.error("Erreur chargement événements Home:", err);
        setEventsError(err.message);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // --- CHARGEMENT DES LIVRABLES DEPUIS L'API ---
  React.useEffect(() => {
    const fetchLivrables = async () => {
      try {
        const idUtilisateur = currentUser?.id;
        if (!idUtilisateur) {
          setLivrables([]);
          setLivrablesLoading(false);
          return;
        }
        const response = await fetch("/api/searchLivrableApprenti", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idApprenti: idUtilisateur })
        });
        const data = await response.json();
        if (data.success) {
          setLivrables(data.evenement || []);
        } else {
          setLivrables([]);
        }
      } catch (err) {
        console.error("Erreur chargement livrables Home:", err);
        setLivrables([]);
        setLivrablesError(err.message);
      } finally {
        setLivrablesLoading(false);
      }
    };
    fetchLivrables();
  }, [currentUser]);

  // --- CHARGEMENT DES CONTACTS DEPUIS L'API ---
  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        const idUtilisateur = currentUser?.id;
        if (!idUtilisateur) {
          setContacts([]);
          setContactsLoading(false);
          return;
        }
        const response = await fetch("/api/searchContactApprenti", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idApprenti: idUtilisateur })
        });
        const data = await response.json();
        if (data.success) {
          setContacts(data.contacts || []);
        } else {
          setContacts([]);
        }
      } catch (err) {
        console.error("Erreur chargement contacts Home:", err);
        setContacts([]);
        setContactsError(err.message);
      } finally {
        setContactsLoading(false);
      }
    };
    fetchContacts();
  }, [currentUser]);

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
  // Ajoute le statut calculé à chaque livrable
  const livrablesAfficher = livrables
    .map(livrable => ({
      ...livrable,
      statut: getStatut(livrable.dateOuverture, livrable.dateFermeture)
    }));

// Filtre les événements à venir (pas encore passés), à partir de la BDD
  const evenementsAVenir = events
    .filter(event => {
      const eventDate = new Date(event.date || event.dateEvenement);
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      return eventDate >= aujourdhui;
    })
    .sort((a, b) => new Date(a.date || a.dateEvenement) - new Date(b.date || b.dateEvenement));
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


//Récupération des notifs depuis la BDD
const [notifications, setNotifications] = useState([]);
const [notificationsError, setNotificationsError] = useState(null);
const [notificationsLoading, setNotificationsLoading] = useState(true);
const [selectedId, setSelectedId] = useState(null);

const idUtilisateur = currentUser?.id;

// Récupération des notifications
useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/searchNotificationsParUtilisateur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUtilisateur })
      });
      const strResponse = (await response.text()).toString();
      const data = JSON.parse(strResponse);
      if (data.success) {
        setNotifications(data.notifications);
      } else {
        throw new Error(data.error || "Erreur lors du chargement des notifications.");
      }
    } catch (err) {
      console.error("Erreur chargement notifications:", err);
      setNotificationsError(err.message);
    } finally {
      setNotificationsLoading(false);
    }
  };
  fetchNotifications();
}, [idUtilisateur]);


// Filtrer uniquement les nouvelles
  const readIds = getReadIds();
  const newNotifications = notifications
    .map(n => ({ ...n, lue: !readIds.has(n.idNotification) }))
    .filter(n => n.lue);

    localStorage.setItem("STARAC_DEBUG", JSON.stringify(newNotifications));

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
                  <div key={contact.idContact} className="contact-card">
                    <h3 className="contact-role">{getRoleLabel(contact.idRole)}</h3>
                    <ul className="contact-details">
                      <li><strong>Nom:</strong> {contact.nomContact || "N/A"} {contact.prenomContact || "N/A"}</li>
                      <li><strong>Téléphone:</strong> {contact.telephoneContact || "N/A"}</li>
                      <li><strong>Email:</strong> {contact.emailContact || "N/A"}</li>
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          )}

          <article className="card card--formulaires">
            <h2 className="card-title">Livrables à compléter</h2>
            <div className="formulaires-list">
              {livrablesAfficher.length > 0 ? (
                livrablesAfficher.map((livrable) => (
                  <div key={livrable.idLivrable} className={`formulaire-item status-${livrable.statut}`}>
                    <div className="formulaire-header">
                      <h3 className="formulaire-nom">{livrable.titre}</h3>
                      <span className={`formulaire-badge badge-${livrable.statut}`}>
                        {livrable.statut === 'ouvert' ? 'Ouvert' : livrable.statut === 'bientot_ferme' ? 'Bientôt fermé' : livrable.statut === 'pas_ouvert' ? 'Pas encore ouvert' : 'Fermé'}
                      </span>
                    </div>
                    <p className="formulaire-description">{livrable.description}</p>
                    <div className="formulaire-dates">
                      <span className="date-info">
                        <strong>Ouverture:</strong> {formatDate(livrable.dateOuverture)}
                      </span>
                      <span className="date-info">
                        <strong>Fermeture:</strong> {formatDate(livrable.dateFermeture)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-formulaires">Aucun livrable à compléter pour le moment.</p>
              )}
            </div>
          </article>

          <article className="card card--notifications">
            <h2 className="card-title">Notifications</h2>
            <div className="notifications-list">
              {newNotifications.length > 0 ? (
                newNotifications.map((notif) => (
                  <div key={notif.idNotification} className="notification-item new" title={notif.descriptionCourte}>
                    <li key={'/notifications?id=${notif.idNotification}'} className="topnav-item">
                      <Link to={`/notifications?id=${notif.idNotification}`} className="topnav-link">
                        {notif.descriptionCourte}
                      </Link>
                    </li>
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
                  <div key={event.idEvenement} className="evenement-item">
                    <div className="evenement-date-block">
                      <span className="evenement-jour">
                        {new Date(event.date || event.dateEvenement).getDate()}
                      </span>
                      <span className="evenement-mois">
                        {new Date(event.date || event.dateEvenement).toLocaleDateString('fr-FR', { month: 'short' })}
                      </span>
                    </div>
                    <div className="evenement-details">
                      <div className="evenement-header">
                        <h3 className="evenement-titre">{event.titre || event.nom}</h3>
                        <span
                          className={`evenement-type type-${(event.type || event.typeEvenement || '').toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {event.type || event.typeEvenement}
                        </span>
                      </div>
                      <p className="evenement-description">{event.description}</p>
                      <div className="evenement-infos">
                        <span className="evenement-info">
                          <strong>📅</strong> {formatDateComplete(event.date || event.dateEvenement)}
                        </span>
                        <span className="evenement-info">
                          <strong>🕐</strong>{" "}
                          {event.heure !== undefined && event.minutes !== undefined
                            ? `${event.heure.toString().padStart(2, "0")}:${event.minutes
                                .toString()
                                .padStart(2, "0")}`
                            : event.heure || ""}
                        </span>
                        <span className="evenement-info">
                          <strong>📍</strong> {event.lieu}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
                ) : (<p className="no-evenements">Aucun événement prévu pour le moment.</p>)}
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export default Home;
