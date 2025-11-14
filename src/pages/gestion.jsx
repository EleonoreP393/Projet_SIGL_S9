import React, { useState, useEffect } from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const roleIdToName = {
    1: 'Apprenti',
    2: 'Coordinatrice',
    3: 'Tuteur',
    4: 'Jury'
};
const roleNameToId = {
    'Apprenti': 1,
    'Coordinatrice': 2,
    'Tuteur': 3,
    'Jury': 4
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

  // --- LOGIQUE POUR LES ACTIONS ---
  const handleDeleteUser = async (userIdToDelete) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce compte ?")) {
            try {
                const response = await fetch(`/api/deleteCompte`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idUtilisateur: userIdToDelete }), 
                });
                const data = await response.json();
                if (!data.success) throw new Error(data.error);
                // Si la suppression a réussi, on met à jour l'affichage
                setUsers(currentUsers => currentUsers.filter(user => user.idUtilisateur !== userIdToDelete));
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
            idRole: roleNameToId[newUser.roleName]
        };
        try {
            const response = await fetch('/api/createCompte', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userToCreate)
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.error);
            // On recharge la liste pour voir le nouvel utilisateur
            setLoading(true);
            const refreshResponse = await fetch('/api/searchAllCompte', { method: 'POST' });
            const refreshData = await refreshResponse.json();
            if (refreshData.success) setUsers(refreshData.utilisateurs || []);
            setLoading(false);
            setIsAddModalOpen(false);
            setNewUser({ prenomUtilisateur: '', nomUtilisateur: '', email: '', motDePasse: '', roleName: 'Apprenti' });
        } catch (err) {
            alert(`Erreur lors de la création: ${err.message}`);
        }
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
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn-primary">Sauvegarder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
export default Gestion;