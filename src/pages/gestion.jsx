import React, { useState, useEffect } from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const roleIdToName = {
    1: 'Apprenti',
    2: 'Coordinatrice',
    3: 'Tuteur',
    4: 'Jury',
    5: 'Maitre Apprentissage'
};
const roleNameToId = {
    'Apprenti': 1,
    'Coordinatrice': 2,
    'Tuteur': 3,
    'Jury': 4,
    'Maitre Apprentissage': 5
};

function Gestion() {
  const navigate = useNavigate();

  // --- ÉTATS POUR LES DONNÉES ET L'AFFICHAGE ---
  const [users, setUsers] = useState([]);
  const [groupedUsers, setGroupedUsers] = useState({}); // Un objet pour stocker les utilisateurs groupés
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le formulaire d'ajout
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ prenomUtilisateur: '', nomUtilisateur: '', email: '', motDePasse: '', roleName: 'Apprenti' });

  // --- États pour les PROMOTIONS ---
  const [promotions, setPromotions] = useState([]);
  const [isAddPromoModalOpen, setIsAddPromoModalOpen] = useState(false);
  const [newPromo, setNewPromo] = useState({
    nomPromotion: "",
    annee: "",
    idEcole: "",
  });

  // --- États pour les ECOLES ---
  const [ecoles, setEcoles] = useState([]);
  const [isAddEcoleModalOpen, setIsAddEcoleModalOpen] = useState(false);
  const [newEcole, setNewEcole] = useState({
    nomEcole: "",
    adresseEcole: "",
  });

  // --- États pour les ENTREPRISES ---
  const [entreprises, setEntreprises] = useState([]);
  const [isAddEntrepriseModalOpen, setIsAddEntrepriseModalOpen] = useState(false);
  const [newEntreprise, setNewEntreprise] = useState({
    nom: "",
    siret: "",
    adresse: "",
  });

  // Données app spécifiques si le nouveau compte est un Apprenti
  const [newApprenti, setNewApprenti] = useState({
    idPromotion: "",
    idEntreprise: "",
    idMa: "",
    idJury: "",
    idTp: "",
  });
  // Données spécifiques si le nouveau compte est un Maître d'apprentissage
  const [newMaitre, setNewMaitre] = useState({
    idUtilisateur: "",
    idEntreprise: "",
  });
  const [jurys, setJurys] = useState([]);
  const [maitre, setMaitres] = useState([]);
  const [tps, setTps] = useState([]);

  // --- RÉCUPÉRATION ET GROUPEMENT DES DONNÉES ---
  useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/searchAllCompte', { method: 'POST' });
                const data = await response.json();
                
                if (data.success) {
                    setUsers(data.utilisateurs || []); 
                } else {
                    throw new Error(data.error || "Impossible de charger les utilisateurs.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

  useEffect(() => {
        const groups = users.reduce((acc, user) => {
            // On traduit l'idRole en nom de rôle
            const role = roleIdToName[user.idRole] || "Sans Rôle";
            if (!acc[role]) acc[role] = [];
            acc[role].push(user);
            return acc;
        }, {});
        setGroupedUsers(groups);
    }, [users]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/searchAllCompte', { method: 'POST' });
        const data = await response.json();
        if (data.success) {
          setUsers(data.utilisateurs || []); 
        } else {
          throw new Error(data.error || "Impossible de charger les utilisateurs.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPromotions = async () => {
      try {
        const response = await fetch("/api/searchAllPromotion", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          setPromotions(data.promotions || []);
        }
      } catch (err) {
        console.error("Erreur chargement promotions:", err);
      }
    };

    const fetchEcoles = async () => {
      try {
        const response = await fetch("/api/searchAllEcole", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        if (data.success) {
          setEcoles(data.ecoles || []);
        }
      } catch (err) {
        console.error("Erreur chargement écoles:", err);
      }
    };

    const fetchEntreprises = async () => {
      try {
        const response = await fetch("/api/searchAllEntreprise", { method: "POST" });
        const data = await response.json();
        if (data.success) {
          setEntreprises(data.entreprises || []);
        }
      } catch (err) {
        console.error("Erreur chargement entreprises:", err);
      }
    };

    const fetchMaitres = async () => {
    try {
      const res = await fetch("/api/searchAllMA", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setMaitres(data.maitreApprentissage || []);
      } else {
        console.error("Erreur chargement maîtres d'apprentissage:", data.error);
      }
    } catch (err) {
      console.error("Erreur chargement maîtres:", err);
    }
  };
  const fetchJurys = async () => {
    try {
      const res = await fetch("/api/searchAllJury", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) setJurys(data.jurys || []);
    } catch (err) {
      console.error("Erreur chargement jurys:", err);
    }
  };
  const fetchTps = async () => {
    try {
      const res = await fetch("/api/searchAllTuteur", {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) setTps(data.tps || []);
    } catch (err) {
      console.error("Erreur chargement TPs:", err);
    }
  };

    fetchUsers();
    fetchPromotions();
    fetchEcoles();
    fetchEntreprises();
    fetchMaitres();
    fetchJurys();
    fetchTps();
  }, []);

  // --- LOGIQUE POUR LES ACTIONS ---
  const handleDeleteUser = async (userIdToDelete) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      try {
        const response = await fetch(`/api/deleteCompteComplet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idUtilisateur: userIdToDelete }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.error || "Suppression échouée.");

        // Si tout va bien, on met à jour l'affichage
        setUsers(currentUsers =>
          currentUsers.filter(user => user.idUtilisateur !== userIdToDelete)
        );
      } catch (err) {
        alert(`Erreur lors de la suppression: ${err.message}`);
      }
    }
  };

  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUserSubmit = async (e) => {
    e.preventDefault();

    const userToCreate = {
      prenomUtilisateur: newUser.prenomUtilisateur,
      nomUtilisateur: newUser.nomUtilisateur,
      email: newUser.email,
      motDePasse: newUser.motDePasse,
      idRole: roleNameToId[newUser.roleName],
    };

    try {
      // 1) Créer le compte utilisateur
      const response = await fetch("/api/createCompte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userToCreate),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Erreur création compte.");

      const newUserId = data.idUtilisateur; // <-- récupère l'ID retourné par le back
      if (!newUserId) {
        throw new Error("L'API createCompte n'a pas renvoyé idUtilisateur.");
      }

      // 2) En fonction du rôle, créer l'entrée dans la table spécialisée
      const roleName = newUser.roleName;
      if (roleName === "Apprenti") {
        const apprentiPayload = {
          idUtilisateur: newUserId,
          idPromotion: newApprenti.idPromotion,
          idEntreprise: newApprenti.idEntreprise,
          idMa: newApprenti.idMa,
          idJury: newApprenti.idJury,
          idTp: newApprenti.idTp,
        };

        console.log(">>> payload createApprenti:", apprentiPayload);
        const resApprenti = await fetch("/api/createApprenti", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apprentiPayload),
        });
        const dataApprenti = await resApprenti.json();
        if (!dataApprenti.success) {
          throw new Error(dataApprenti.error || "Erreur lors de la création de l'apprenti.");
        }
      } else if (roleName === "Jury") {
        const juryPayload = {
          idUtilisateur: newUserId,
        };
        await fetch("/api/createJury", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(juryPayload),
        });
      } else if (roleName === "Tuteur") {
        const tuteurPayload = {
          idUtilisateur: newUserId,
        };
        await fetch("/api/createTuteur", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tuteurPayload),
        });
      } else if (roleName === "Coordinatrice") {
        const coordinatricePayload = {
          idUtilisateur: newUserId,
        };
        await fetch("/api/createCoordinatrice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(coordinatricePayload),
        });
      } else if (roleName === "Maitre Apprentissage") {
        const maitreapprentissagePayload = {
          idUtilisateur: newUserId,
          idEntreprise: newMaitre.idEntreprise,
        };
        const resMA = await fetch("/api/createMA", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idUtilisateur: newUserId, idEntreprise: newMaitre.idEntreprise }),
        });
        const dataMA = await resMA.json();
        if (!dataMA.success) {
          throw new Error(dataMA.error || "Erreur lors de la création du maître d'apprentissage")
        }
      }

      // 3) Recharger la liste des comptes
      setLoading(true);
      const refreshResponse = await fetch("/api/searchAllCompte", { method: "POST" });
      const refreshData = await refreshResponse.json();
      if (refreshData.success) setUsers(refreshData.utilisateurs || []);
      setLoading(false);

      // 4) Fermer le modal + reset du form
      setIsAddModalOpen(false);
      setNewUser({
        prenomUtilisateur: "",
        nomUtilisateur: "",
        email: "",
        motDePasse: "",
        roleName: "Apprenti",
      });
      setNewApprenti({
        idPromotion: "",
        idEntreprise: "",
        idMa: "",
        idJury: "",
        idTp: "",
      });
      setNewMaitre({
        idEntreprise: "",
      });
    } catch (err) {
      alert(`Erreur lors de la création: ${err.message}`);
    }
  };

  // --- PROMOTIONS ---

  const handleNewPromoChange = (e) => {
    const { name, value } = e.target;
    setNewPromo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPromoSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nomPromotion: newPromo.nomPromotion,
      annee: newPromo.annee,
      idEcole: newPromo.idEcole,
    };

    try {
      const response = await fetch("/api/createPromotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomPromotion: newPromo.nomPromotion,
          annee: newPromo.annee,
          idEcole: newPromo.idEcole,
        }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Erreur création promotion.");

      // Recharger les promotions
      const refresh = await fetch("/api/searchAllPromotion", { method: "POST" , headers: { "Content-Type": "application/json" },body: JSON.stringify({}),});
      const refreshData = await refresh.json();
      if (refreshData.success) setPromotions(refreshData.promotions || []);

      // Reset + fermer le modal
      setNewPromo({ nomPromotion: "", annee: "", idEcole: "" });
      setIsAddPromoModalOpen(false);
    } catch (err) {
      alert(`Erreur lors de la création de la promotion: ${err.message}`);
    }
  };

  const handleDeletePromo = async (idPromotionToDelete) => {
    if (!window.confirm("Supprimer cette promotion ?")) return;

    try {
      const response = await fetch("/api/deletePromotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPromotion: idPromotionToDelete }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Suppression échouée.");

      setPromotions(prev => prev.filter(p => p.idPromotion !== idPromotionToDelete));
    } catch (err) {
      alert(`Erreur lors de la suppression de la promotion: ${err.message}`);
    }
  };

  // --- ECOLES ---
  const handleNewEcoleChange = (e) => {
    const { name, value } = e.target;
    setNewEcole(prev => ({ ...prev, [name]: value }));
  };
  const handleAddEcoleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nomEcole: newEcole.nomEcole,
      adresseEcole: newEcole.adresseEcole,
    };
    try {
      const response = await fetch("/api/createEcole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Erreur création école.");
      const refresh = await fetch("/api/searchAllEcole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const refreshData = await refresh.json();
      if (refreshData.success) setEcoles(refreshData.ecoles || []);
      setNewEcole({ nomEcole: "", adresseEcole: ""});
      setIsAddEcoleModalOpen(false);
    } catch (err) {
      alert(`Erreur lors de la création de l'école: ${err.message}`);
    }
  };
  const handleDeleteEcole = async (idEcoleToDelete) => {
    if (!window.confirm("Supprimer cette école ?")) return;
    try {
      const response = await fetch("/api/deleteEcole", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEcole: idEcoleToDelete }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Suppression échouée.");
      setEcoles(prev => prev.filter(e => e.idEcole !== idEcoleToDelete));
    } catch (err) {
      alert(`Erreur lors de la suppression de l'école: ${err.message}`);
    }
  };
  const getEcoleNameById = (idEcole) => {
    const ecole = ecoles.find(e => e.idEcole === idEcole || e.idEcole === Number(idEcole));
    return ecole ? ecole.nomEcole : idEcole; // fallback: affiche l'id si pas trouvée
  };

  // --- ENTREPRISES ---

  const handleNewEntrepriseChange = (e) => {
    const { name, value } = e.target;
    setNewEntreprise(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEntrepriseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nom: newEntreprise.nom,
      siret: newEntreprise.siret,
      adresse: newEntreprise.adresse,
    };

    try {
      const response = await fetch("/api/createEntreprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Erreur création entreprise.");

      const refresh = await fetch("/api/searchAllEntreprise", { method: "POST" });
      const refreshData = await refresh.json();
      if (refreshData.success) setEntreprises(refreshData.entreprises || []);

      setNewEntreprise({ nom: "", siret: "", adresse: "" });
      setIsAddEntrepriseModalOpen(false);
    } catch (err) {
      alert(`Erreur lors de la création de l'entreprise: ${err.message}`);
    }
  };

  const handleDeleteEntreprise = async (idEntrepriseToDelete) => {
    if (!window.confirm("Supprimer cette entreprise ?")) return;

    try {
      const response = await fetch("/api/deleteEntreprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEntreprise: idEntrepriseToDelete }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Suppression échouée.");

      setEntreprises(prev => prev.filter(e => e.idEntreprise !== idEntrepriseToDelete));
    } catch (err) {
      alert(`Erreur lors de la suppression de l'entreprise: ${err.message}`);
    }
  };

  const handleNewApprentiChange = (e) => {
    const { name, value } = e.target;
    setNewApprenti(prev => ({ ...prev, [name]: value }));
  };

  const handleNewMaitreChange = (e) => {
    const { name, value } = e.target;
    setNewMaitre(prev => ({ ...prev, [name]: value }));
  };


  // --- LOGIQUE DE NAVIGATION ---

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
    { label: "Evénements", path: "/evenements" },
    { label: "Notifications", path: "/notifications" },
  ];
  const coordinateurPages = [
    ...basePages,
    { label: "Gestion", path: "/gestion" },
  ];
  const pagesToDisplay = userRole === 2 ? coordinateurPages : basePages;

  // --- AFFICHAGE ---
  if (loading) {
    return <div>Chargement de la liste des utilisateurs...</div>;
  }
  if (error) {
    return <div>Erreur : {error}</div>;
  }

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
        <section className="gestion-page-container">
          <div className="page-header-actions">
            <h1 className="gestion-page-title">Gestion des Comptes</h1>
            <button className="add-account-button" onClick={() => setIsAddModalOpen(true)}>
              + Ajouter un Compte
            </button>
          </div>
          <div className="roles-container">
            {Object.keys(groupedUsers).map(roleName => (
              <div key={roleName} className="role-group-card">
                <h2 className="role-group-title">{roleName}</h2>
                <div className="users-list">
                  {groupedUsers[roleName].map(user => (
                    <Link key={user.idUtilisateur} to={`/gestion/edit/${user.idUtilisateur}`} className="user-card-link" state={{ user: user }}>
                      <div key={user.idUtilisateur} className="user-details-card">
                        <div className="user-card-header">
                          <button className="delete-user-btn" onClick={(e) => {e.preventDefault(); // Annule la navigation du <Link>
                            handleDeleteUser(user.idUtilisateur);}}>
                            ✕
                          </button>
                        </div>
                        <p><strong>Login:</strong> {user.nomUtilisateur}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Mot de passe:</strong> ********</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- GESTION DES PROMOTIONS --- */}
        <section className="gestion-page-container">
          <div className="page-header-actions">
            <h1 className="gestion-page-title">Gestion des Promotions</h1>
            <button
              className="add-account-button"
              onClick={() => setIsAddPromoModalOpen(true)}
            >
              + Ajouter une Promotion
            </button>
          </div>

          <div className="list-container">
            {promotions.length > 0 ? (
              <div className="users-list">
                {promotions.map(promo => (
                  <div key={promo.idPromotion} className="user-details-card">
                    <div className="user-card-header">
                      <button
                        className="delete-user-btn"
                        onClick={() => handleDeletePromo(promo.idPromotion)}
                      >
                        ✕
                      </button>
                    </div>
                    <p><strong>Nom :</strong> {promo.nomPromotion}</p>
                    <p><strong>Année :</strong> {promo.annee}</p>
                    <p><strong>École :</strong> {getEcoleNameById(promo.idEcole)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#d4af37"}}>Aucune promotion pour le moment.</p>
            )}
          </div>
        </section>

        {/* --- GESTION DES ECOLES --- */}
        <section className="gestion-page-container">
          <div className="page-header-actions">
            <h1 className="gestion-page-title">Gestion des Écoles</h1>
            <button
              className="add-account-button"
              onClick={() => setIsAddEcoleModalOpen(true)}
            >
              + Ajouter une École
            </button>
          </div>

          <div className="list-container">
            {ecoles.length > 0 ? (
              <div className="users-list">
                {ecoles.map(ecole => (
                  <div key={ecole.idEcole} className="user-details-card">
                    <div className="user-card-header">
                      <button
                        className="delete-user-btn"
                        onClick={() => handleDeleteEcole(ecole.idEcole)}
                      >
                        ✕
                      </button>
                    </div>
                    <p><strong>Nom :</strong> {ecole.nomEcole}</p>
                    <p><strong>Adresse :</strong> {ecole.adresseEcole}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#d4af37"}}>Aucune école pour le moment.</p>
            )}
          </div>
        </section>

        {/* --- GESTION DES ENTREPRISES --- */}
        <section className="gestion-page-container">
          <div className="page-header-actions">
            <h1 className="gestion-page-title">Gestion des Entreprises</h1>
            <button
              className="add-account-button"
              onClick={() => setIsAddEntrepriseModalOpen(true)}
            >
              + Ajouter une Entreprise
            </button>
          </div>

          <div className="list-container">
            {entreprises.length > 0 ? (
              <div className="users-list">
                {entreprises.map(ent => (
                  <div key={ent.idEntreprise} className="user-details-card">
                    <div className="user-card-header">
                      <button
                        className="delete-user-btn"
                        onClick={() => handleDeleteEntreprise(ent.idEntreprise)}
                      >
                        ✕
                      </button>
                    </div>
                    <p><strong>Nom :</strong> {ent.nom}</p>
                    <p><strong>SIRET :</strong> {ent.siret}</p>
                    <p><strong>Adresse :</strong> {ent.adresse}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#d4af37"}}>Aucune entreprise pour le moment.</p>
            )}
          </div>
        </section>
      </main>
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nouveau Compte</h2>
            <form onSubmit={handleAddUserSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="prenomUtilisateur">Prénom</label>
                  <input id="prenomUtilisateur" name="prenomUtilisateur" value={newUser.prenomUtilisateur} onChange={handleAddUserChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="nomUtilisateur">Nom (Login)</label>
                  <input id="nomUtilisateur" name="nomUtilisateur" value={newUser.nomUtilisateur} onChange={handleAddUserChange} required />
                </div>
                <div className="form-group form-group-full">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={newUser.email} onChange={handleAddUserChange} required />
                </div>
                
                <div className="form-group">
                  <label htmlFor="motDePasse">Mot de passe</label>
                  <input id="motDePasse" name="motDePasse" type="password" value={newUser.motDePasse} onChange={handleAddUserChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="roleName">Rôle</label>
                  <select id="roleName" name="roleName" value={newUser.roleName} onChange={handleAddUserChange}>
                    <option>Apprenti</option>
                    <option>Tuteur</option>
                    <option>Coordinatrice</option>
                    <option>Jury</option>
                    <option>Maitre Apprentissage</option>
                  </select>
                </div>
                {/* Champs spécifiques si on crée un Apprenti */}
                {newUser.roleName === "Apprenti" && (
                  <>
                    <div className="form-group">
                      <label>Promotion</label>
                      <select
                        name="idPromotion"
                        value={newApprenti.idPromotion}
                        onChange={handleNewApprentiChange}
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        {promotions.map((promo) => (
                          <option key={promo.idPromotion} value={promo.idPromotion}>
                            {promo.nomPromotion} ({promo.annee})
                          </option>
                        ))}
                      </select>
                    </div>
                      
                    <div className="form-group">
                      <label>Entreprise</label>
                      <select
                        name="idEntreprise"
                        value={newApprenti.idEntreprise}
                        onChange={handleNewApprentiChange}
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        {entreprises.map((ent) => (
                          <option key={ent.idEntreprise} value={ent.idEntreprise}>
                            {ent.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                      
                    <div className="form-group">
                      <label>Maître d'apprentissage</label>
                      <select
                        name="idMa"
                        value={newApprenti.idMa}
                        onChange={handleNewApprentiChange}
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        {maitre.map((ma) => (
                          <option key={ma.idUtilisateur} value={ma.idUtilisateur}>
                            {ma.prenom} {ma.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                      
                    <div className="form-group">
                      <label>Jury</label>
                      <select
                        name="idJury"
                        value={newApprenti.idJury}
                        onChange={handleNewApprentiChange}
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        {jurys.map((j) => (
                          <option key={j.idUtilisateur} value={j.idUtilisateur}>
                            {j.prenom} {j.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                      
                    <div className="form-group">
                      <label>Tuteur Pédagogique</label>
                      <select
                        name="idTp"
                        value={newApprenti.idTp}
                        onChange={handleNewApprentiChange}
                        required
                      >
                        <option value="">-- Sélectionner --</option>
                        {tps.map((tp) => (
                          <option key={tp.idUtilisateur} value={tp.idUtilisateur}>
                            {tp.prenom} {tp.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                {/* Champs spécifiques si on crée un Maître d'apprentissage */}
                {newUser.roleName === "Maitre Apprentissage" && (
                  <>
                    <div className="form-group">
                      <label>Entreprise</label>
                      <select
                        name="idEntreprise"
                        value={newMaitre.idEntreprise}
                        onChange={handleNewMaitreChange}
                        required
                      >
                        {entreprises.map((ent) => (
                          <option key={ent.idEntreprise} value={ent.idEntreprise}>
                            {ent.nom}
                          </option>
                        ))}
                        console.log("entreprises:", entreprises);
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL : Nouvelle Promotion */}
      {isAddPromoModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nouvelle Promotion</h2>
            <form onSubmit={handleAddPromoSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom de la promotion</label>
                  <input
                    name="nomPromotion"
                    value={newPromo.nomPromotion}
                    onChange={handleNewPromoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Année</label>
                  <input
                    name="annee"
                    value={newPromo.annee}
                    onChange={handleNewPromoChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ID École</label>
                  <select name="idEcole" value={newPromo.idEcole} onChange={handleNewPromoChange} required>
                    <option value="">-- Sélectionner une école --</option>
                      {ecoles.map((ecole) => (
                        <option key={ecole.idEcole} value={ecole.idEcole}>
                          {ecole.nomEcole}
                    </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddPromoModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : Nouvelle École */}
      {isAddEcoleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nouvelle École</h2>
            <form onSubmit={handleAddEcoleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom de l'école</label>
                  <input
                    name="nomEcole"
                    value={newEcole.nomEcole}
                    onChange={handleNewEcoleChange}
                    required
                  />
                </div>
                <div className="form-group form-group-full">
                  <label>Adresse</label>
                  <input
                    name="adresseEcole"
                    value={newEcole.adresseEcole}
                    onChange={handleNewEcoleChange}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddEcoleModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : Nouvelle Entreprise */}
      {isAddEntrepriseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nouvelle Entreprise</h2>
            <form onSubmit={handleAddEntrepriseSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    name="nom"
                    value={newEntreprise.nom}
                    onChange={handleNewEntrepriseChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SIRET</label>
                  <input
                    name="siret"
                    value={newEntreprise.siret}
                    onChange={handleNewEntrepriseChange}
                  />
                </div>
                <div className="form-group form-group-full">
                  <label>Adresse</label>
                  <input
                    name="adresse"
                    value={newEntreprise.adresse}
                    onChange={handleNewEntrepriseChange}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAddEntrepriseModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
export default Gestion;