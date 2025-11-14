import React, { useState, useEffect } from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

// --- DONNÉES DE SIMULATION ---
// On simule ici la réponse que donnerait votre API
const initialFakeUsers = [
  { idUtilisateur: 1, prenomUtilisateur: 'Jane', nomUtilisateur: 'j.doe', email: 'j.doe@example.com', roleName: 'Apprenti' },
  { idUtilisateur: 2, prenomUtilisateur: 'John', nomUtilisateur: 'j.smith', email: 'j.smith@example.com', roleName: 'Tuteur' },
  { idUtilisateur: 3, prenomUtilisateur: 'Marie', nomUtilisateur: 'm.dupont', email: 'm.dupont@example.com', roleName: 'Coordinatrice' },
  { idUtilisateur: 4, prenomUtilisateur: 'Pierre', nomUtilisateur: 'p.martin', email: 'p.martin@example.com', roleName: 'Jury' },
  { idUtilisateur: 5, prenomUtilisateur: 'Alice', nomUtilisateur: 'a.legrand', email: 'a.legrand@example.com', roleName: 'Apprenti' },
  { idUtilisateur: 6, prenomUtilisateur: 'Sophie', nomUtilisateur: 's.petit', email: 's.petit@example.com', roleName: 'Tuteur' },
];

function Gestion() {
  const navigate = useNavigate();

  // --- ÉTATS POUR LES DONNÉES ET L'AFFICHAGE ---
  const [users, setUsers] = useState(initialFakeUsers);
  const [groupedUsers, setGroupedUsers] = useState({}); // Un objet pour stocker les utilisateurs groupés
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le formulaire d'ajout
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ prenomUtilisateur: '', nomUtilisateur: '', email: '', motDePasse: '', roleName: 'Apprenti' });

  // --- RÉCUPÉRATION ET GROUPEMENT DES DONNÉES ---
 useEffect(() => {
    try {
      const groups = users.reduce((acc, user) => {
        const role = user.roleName || "Sans Rôle";
        if (!acc[role]) acc[role] = [];
        acc[role].push(user);
        return acc;
      }, {});
      setGroupedUsers(groups);
    } catch (err) {
      setError("Erreur lors du groupement des données.");
    } finally {
      setLoading(false);
    }
  }, [users]); 

  // --- LOGIQUE POUR LES ACTIONS ---
  const handleDeleteUser = (userIdToDelete) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
      // On filtre la liste pour ne garder que les utilisateurs dont l'ID est différent
      setUsers(currentUsers => currentUsers.filter(user => user.idUtilisateur !== userIdToDelete));
    }
  };
  const handleAddUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    const newUserWithId = { ...newUser, idUtilisateur: Date.now() }; // ID unique simple
    setUsers(currentUsers => [...currentUsers, newUserWithId]);
    setIsAddModalOpen(false); // Ferme le modal
    setNewUser({ prenomUtilisateur: '', nomUtilisateur: '', email: '', motDePasse: '', roleName: 'Apprenti' }); // Réinitialise le form
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
    { label: "Documents", path: "/documents" },
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
                    <div key={user.idUtilisateur} className="user-details-card">
                      <div className="user-card-header">
                        <button className="delete-user-btn" onClick={() => handleDeleteUser(user.idUtilisateur)}>
                          ✕
                        </button>
                      </div>
                      <p><strong>Login:</strong> {user.nomUtilisateur}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Mot de passe:</strong> ********</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nouveau Compte</h2>
            <form onSubmit={handleAddUserSubmit} className="modal-form">
              <input name="prenomUtilisateur" value={newUser.prenomUtilisateur} onChange={handleAddUserChange} placeholder="Prénom" required />
              <input name="nomUtilisateur" value={newUser.nomUtilisateur} onChange={handleAddUserChange} placeholder="Login" required />
              <input name="email" type="email" value={newUser.email} onChange={handleAddUserChange} placeholder="Email" required />
              <input name="motDePasse" value={newUser.motDePasse} onChange={handleAddUserChange} placeholder="Mot de passe" required />
              <select name="roleName" value={newUser.roleName} onChange={handleAddUserChange}>
                <option>Apprenti</option>
                <option>Tuteur</option>
                <option>Coordinatrice</option>
                <option>Jury</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsAddModalOpen(false)}>Annuler</button>
                <button type="submit">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Gestion;