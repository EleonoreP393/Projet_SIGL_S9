import React, { useState, useEffect } from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

function Event() {
  const navigate = useNavigate();

  // --- ÉTATS ---
  const [events, setEvents] = useState([]); // liste vide
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // États pour le mode de suppression
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState(new Set());
  
  // État pour le fichier à joindre
  const [filesToUpload, setFilesToUpload] = useState({});
  
  // État pour les promotions
  const [promotions, setPromotions] = useState([]);

  // États pour le dropdown des apprentis (pour les tuteurs)
  const [apprentis, setApprentis] = useState([]);
  const [selectedApprentiId, setSelectedApprentiId] = useState(null);

  // L'état du formulaire correspond aux champs du frontend
  const [newLivrable, setNewLivrable] = useState({
    nom: "", description: "", dateOuverture: "", dateFermeture: "", idPromotion: ""
  });
  const [error, setError] = useState("");

  // --- useEffect pour appeler l'API au chargement ---
  const fetchLivrables = async (idApprenti = null) => {
    try {
      const currentUser = getUser();
      if (!currentUser || !currentUser.id) {
        console.error("Utilisateur non connecté");
        return;
      }

      // Si c'est un tuteur et un apprenti est sélectionné, on charge ses livrables
      const apprentiToUse = idApprenti || currentUser.id.toString();

      const response = await fetch("/api/searchLivrableApprenti", { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idApprenti: apprentiToUse })
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.evenement || []);
      } else {
        throw new Error(data.error || "Erreur chargement livrables.");
      }
    } catch (err) {
      console.error("Impossible de charger les livrables:", err);
    }
  };

  const fetchApprentisForTuteur = async () => {
    try {
      const currentUser = getUser();
      if (!currentUser || !currentUser.id) {
        console.error("Utilisateur non connecté");
        return;
      }

      const userRole = currentUser.idRole;

      const response = await fetch("/api/searchApprentisForTuteur", { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUtilisateur: currentUser.id.toString(), userRole: userRole })
      });
      const data = await response.json();
      console.log("Réponse apprentis:", data);
      if (data.success) {
        console.log("Apprentis chargés:", data.apprentis);
        setApprentis(data.apprentis || []);
      } else {
        console.error("Erreur chargement apprentis:", data.error);
      }
    } catch (err) {
      console.error("Impossible de charger les apprentis:", err);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch("/api/searchAllPromotion", { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setPromotions(data.promotions || []);
      } else {
        console.error("Erreur chargement promotions");
      }
    } catch (err) {
      console.error("Impossible de charger les promotions:", err);
    }
  };

  useEffect(() => {
    const currentUser = getUser();
    const userRole = currentUser ? currentUser.idRole : null;
    
    fetchLivrables();
    fetchPromotions();
    
    // Si c'est un tuteur (rôle 3), jury (rôle 4) ou maître d'apprentissage (rôle 5), charger les apprentis disponibles
    if (userRole === 3 || userRole === 4 || userRole === 5) {
      fetchApprentisForTuteur();
    }
  }, []);

  // --- LOGIQUE DE NAVIGATION ET DE RÔLE ---
  const handleAddLivrable = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Récupérer l'utilisateur actuel depuis le localStorage
      const currentUser = getUser();
      if (!currentUser || !currentUser.id) {
        throw new Error("Utilisateur non connecté.");
      }

      if (!newLivrable.idPromotion) {
        throw new Error("Veuillez sélectionner une promotion.");
      }

      // Vérifie si on est en mode modification
      if (newLivrable.idLivrable) {
        // Mode modification
        const LivrableToUpdate = {
          idLivrable: newLivrable.idLivrable,
          titre: newLivrable.nom,
          description: newLivrable.description,
          dateOuverture: newLivrable.dateOuverture,
          dateFermeture: newLivrable.dateFermeture,
          idPromotion: newLivrable.idPromotion
        };
        const response = await fetch("/api/updateLivrable", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(LivrableToUpdate),
        });
        const text = await response.text();
        const data = JSON.parse(text);
        if (!data.success) throw new Error(data.error || "Erreur modification.");
      } else {
        // Mode création
        const LivrableToSend = {
          idApprenti: currentUser.id.toString(),
          titre: newLivrable.nom,
          description: newLivrable.description,
          dateOuverture: newLivrable.dateOuverture,
          dateFermeture: newLivrable.dateFermeture,
          idPromotion: newLivrable.idPromotion
        };
        console.log("Envoi du livrable:", LivrableToSend);
        const response = await fetch("/api/createLivrable", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(LivrableToSend),
        });
        const text = await response.text();
        console.log("Réponse brute:", text, "Status:", response.status);
        const data = JSON.parse(text);
        if (!data.success) throw new Error(data.error || "Erreur création.");
      }
      
      await fetchLivrables();
      setIsModalOpen(false);
      setNewLivrable({ nom: "", description: "", dateOuverture: "", dateFermeture: "", idPromotion: "" });
    } catch (err) {
      console.error("Erreur création/modification livrable:", err);
      setError(err.message);
    }
    };

  const handleDeleteSelected = async () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedEvents.size} livrable(s) ?`)) {
      try {
        // On exécute toutes les suppressions en parallèle pour plus d'efficacité
        const deletePromises = Array.from(selectedEvents).map(id =>
          fetch("/api/deleteLivrable", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idLivrable: id }),
          }).then(res => res.json())
        );
        const results = await Promise.all(deletePromises);
        // On vérifie si une des suppressions a échoué
        if (results.some(res => !res.success)) {
          throw new Error("Certaines suppressions ont échoué.");
        }
        // Si tout réussit, on met à jour l'état local
        setEvents(prevEvents => prevEvents.filter(event => !selectedEvents.has(event.idLivrable)));
        setIsDeleteMode(false);
        setSelectedEvents(new Set());
      } catch (err) {
        alert(err.message);
      }
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
  const userRole = currentUser ? currentUser.idRole : null;

  // Debug
  console.log("Current User:", currentUser);
  console.log("User Role:", userRole);

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

  // --- LOGIQUE DU FORMULAIRE ET DE L'AJOUT ---

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setNewLivrable(prev => ({ ...prev, fichier: files[0] || null }));
    } else {
      setNewLivrable(prev => ({ ...prev, [name]: value }));
    }
  };

  const evenementsAVenir = events
    .sort((a, b) => new Date(a.dateFermeture) - new Date(b.dateFermeture));

  // Fonction pour formater la date
  const formatDateComplete = (dateString) => {
    const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleApprentiChange = (e) => {
    const idApprenti = e.target.value;
    setSelectedApprentiId(idApprenti || null);
    if (idApprenti) {
      fetchLivrables(idApprenti);
    } else {
      fetchLivrables();
    }
  };

  const handleSelectionChange = (eventId) => {
    setSelectedEvents(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const handleFileChange = (livrableId, file) => {
    try {
      setFilesToUpload(prev => ({
        ...prev,
        [livrableId]: file
      }));
    } catch (err) {
      console.error("Erreur lors de la sélection du fichier:", err);
    }
  };

  const handleSubmitFile = async (livrableId) => {
    const file = filesToUpload[livrableId];
    if (!file) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("idLivrable", livrableId);
      formData.append("fichier", file);

      const response = await fetch("/api/uploadFileLivrable", {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Fichier ajouté avec succès !");
        setFilesToUpload(prev => {
          const newState = { ...prev };
          delete newState[livrableId];
          return newState;
        });
        await fetchLivrables();
      } else {
        throw new Error(data.error || "Erreur lors de l'ajout du fichier.");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("❌ Erreur : " + err.message);
    }
  };

  // Fonction pour formater la date au format YYYY-MM-DD pour les inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEditLivrable = (livrable) => {
    // Remplit le formulaire avec les données du livrable à modifier
    setNewLivrable({
      nom: livrable.titre,
      description: livrable.description,
      dateOuverture: formatDateForInput(livrable.dateOuverture),
      dateFermeture: formatDateForInput(livrable.dateFermeture),
      idPromotion: livrable.idPromotion,
      idLivrable: livrable.idLivrable // On stocke l'ID pour savoir qu'on est en mode modification
    });
    setIsModalOpen(true);
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
            <div>
              <h1 className="events-page-title">Vos Livrables</h1>
              {/* Dropdown pour les tuteurs pédagogiques, jurys et maîtres d'apprentissage */}
              {(userRole === 3 || userRole === 4 || userRole === 5) && (
                <div className="apprenti-selector" style={{marginTop: '10px'}}>
                  <select 
                    id="apprenti-select" 
                    value={selectedApprentiId || ''} 
                    onChange={handleApprentiChange}
                    className="apprenti-dropdown"
                  >
                    <option value=""></option>
                    {apprentis.map((apprenti) => (
                      <option key={apprenti.idUtilisateur} value={apprenti.idUtilisateur}>
                        {apprenti.nomUtilisateur} {apprenti.prenomUtilisateur}
                      </option>
                    ))}
                  </select>
                  {apprentis.length === 0 && <p style={{color: '#999', marginTop: '5px'}}>Aucun apprenti assigné</p>}
                </div>
              )}
            </div>
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
              <span>{selectedEvents.size} livrable(s) sélectionné(s)</span>
              <button onClick={handleDeleteSelected}>Confirmer la Suppression</button>
            </div>
          )}
          <div className="events-grid">
            {evenementsAVenir.length > 0 ? (
              evenementsAVenir.map((livrable) => (

                // On ajoute une classe 'selectable' et un écouteur de clic sur la carte entière
                <article 
                  key={livrable.idLivrable} 
                  className={`event-full-card ${isDeleteMode ? 'selectable' : ''}`}
                  onClick={() => isDeleteMode && handleSelectionChange(livrable.idLivrable)} // Permet de cliquer sur la carte pour cocher
                >

                  {/* --- CASE À COCHER --- */}
                  {/* Ne s'affiche qu'en mode suppression */}
                  {isDeleteMode && (
                    <input
                      type="checkbox"
                      className="event-selection-checkbox"
                      checked={selectedEvents.has(livrable.idLivrable)}
                      readOnly // On la met en lecture seule car le clic est géré par la carte
                    />
                  )}
                  <div className="event-full-header">
                    <h2 className="event-full-title">{livrable.titre}</h2>
                  </div>
                  <div className="event-full-infos">
                    <span>📅 Ouverture : {formatDateComplete(livrable.dateOuverture)}</span>
                    <span>📅 Fermeture : {formatDateComplete(livrable.dateFermeture)}</span>
                  </div>
                  <p className="event-full-description">{livrable.description}</p>
                  <div className="file-upload-section">
                    {livrable.fichier ? (
                      <div className="file-display">
                        <span>📎 Fichier : <a href={`http://localhost:3001/uploads/${livrable.fichier}`} target="_blank" rel="noopener noreferrer">{livrable.fichier}</a></span>
                      </div>
                    ) : (
                      userRole === 1 && (
                        <>
                          <input 
                            type="file" 
                            onChange={(e) => handleFileChange(livrable.idLivrable, e.target.files[0])} 
                            className="file-input"
                          />
                          <button 
                            type="button"
                            className="submit-file-button"
                            onClick={() => handleSubmitFile(livrable.idLivrable)}
                          >
                            Ajouter le fichier
                          </button>
                        </>
                      )
                    
                    )}
                  </div>
                  {userRole === 2 && (
                    <div className="event-actions">
                      <button 
                        type="button"
                        className="edit-button"
                        onClick={() => handleEditLivrable(livrable)}
                      >
                        Modifier
                      </button>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <p className="no-events-message">Aucun livrable.</p>
            )}
          </div>
        </section>
      </main>
      {/* --- FORMULAIRE MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{newLivrable.idLivrable ? "Modifier le livrable" : "Nouveau livrable"}</h2>
            <form onSubmit={handleAddLivrable} className="modal-form">
              <input name="nom" value={newLivrable.nom} onChange={handleInputChange} placeholder="Nom du livrable" required />
              {newLivrable.idLivrable ? (
                <div className="promotion-display">
                  <strong>Promotion :</strong> {promotions.find(p => p.idPromotion == newLivrable.idPromotion)?.nomPromotion || "Non sélectionnée"}
                </div>
              ) : (
                <select name="idPromotion" value={newLivrable.idPromotion} onChange={handleInputChange} required>
                  <option value="">Sélectionner une promotion</option>
                  {promotions.map((promotion) => (
                    <option key={promotion.idPromotion} value={promotion.idPromotion}>
                      {promotion.nomPromotion}
                    </option>
                  ))}
                </select>
              )}
              <input name="dateOuverture" type="date" value={newLivrable.dateOuverture} onChange={handleInputChange} required />
              <input name="dateFermeture" type="date" value={newLivrable.dateFermeture} onChange={handleInputChange} required />
              <textarea name="description" value={newLivrable.description} onChange={handleInputChange} placeholder="Description..."></textarea>
              
              {/* Affichage des erreurs */}
              {error && <p className="modal-error">{error}</p>}
              
              <div className="modal-actions">
                <button type="button" onClick={() => { setIsModalOpen(false); setNewLivrable({ nom: "", description: "", dateOuverture: "", dateFermeture: "", idPromotion: "" }); setError(""); }}>Annuler</button>
                <button type="submit">{newLivrable.idLivrable ? "Modifier" : "Sauvegarder"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Event;