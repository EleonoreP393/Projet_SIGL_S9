import React from "react";
import "../style/style.css";
import logo from "../assets/logo.png";

function Home() {
  const pages = ["Journal de Formation", "Documents", "Evénements", "Notifications", "Livret" ]; // labels du bandeau

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
  ].filter(contact => contact !== null); // filtre les valeurs null

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

  // Notifications exemple (plus tard depuis BDD)
  const notifications = [
    { id: 1, message: "Nouvelle évaluation disponible pour le module React", isNew: false },
    { id: 2, message: "Réunion prévue le 15 octobre à 14h avec votre tuteur", isNew: false },
    { id: 3, message: "Document administratif à signer avant vendredi", isNew: false },
    { id: 4, message: "Rappel : compléter votre journal de formation", isNew: true },
    { id: 5, message: "Votre livret d'apprentissage a été validé par le coordinateur pédagogique", isNew: true},
  ];

  // Événements musicaux à venir (plus tard depuis BDD)
const evenements = [
  {
    id: 1,
    titre: "Scène Ouverte - Jazz & Blues",
    date: "2025-10-08",
    heure: "18:00",
    lieu: "Salle de concert",
    type: "Scène Ouverte",
    description: "Venez jouer et partager vos morceaux préférés"
  },
  {
    id: 2,
    titre: "Atelier Improvisation Vocale",
    date: "2025-10-12",
    heure: "14:00",
    lieu: "Studio A",
    type: "Atelier",
    description: "Atelier pratique ouvert à tous niveaux"
  },
  {
    id: 3,
    titre: "Audition Concert de Fin d'Année",
    date: "2025-10-20",
    heure: "16:00",
    lieu: "Auditorium",
    type: "Audition",
    description: "Présentez votre morceau pour le concert annuel"
  },
  {
    id: 4,
    titre: "Jam Session - Rock",
    date: "2025-10-05",
    heure: "19:30",
    lieu: "Salle de répétition B",
    type: "Jam Session",
    description: "Session collective, apportez vos instruments !"
  },
  {
    id: 5,
    titre: "Concert des Élèves",
    date: "2025-10-25",
    heure: "20:00",
    lieu: "Auditorium Municipal",
    type: "Concert",
    description: "Présentez vos talents devant le public"
  },
  {
    id: 6,
    titre: "Master Class - Guitare Classique",
    date: "2025-10-15",
    heure: "17:00",
    lieu: "Grande salle",
    type: "Master Class",
    description: "Avec le professeur Jean Dupuis"
  },
];

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
      <main className="main-content">
        <section className="cards-row">
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
              {notifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${notif.isNew ? 'new' : ''}`} title={notif.message}>
                  <span className="notification-text">{notif.message}</span>
                </div>
              ))}
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