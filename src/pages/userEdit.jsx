import React, { useState, useEffect } from 'react';
// On a besoin de useParams pour lire l'ID dans l'URL
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import "../style/style.css"; 

const roleIdToName = {
    1: 'Apprenti',
    2: 'Coordinatrice',
    3: 'Tuteur',
    4: 'Jury',
    5: 'MaitreApprentissage'
};

const contactRoleMap = {
    'Coordinatrice': 2,
    'Tuteur': 3,
    'Jury': 4,
    'MaitreApprentissage': 5
};

function UserEdit() {
    // Récupère l'ID de l'utilisateur depuis l'URL
    const { userId } = useParams(); 
    const navigate = useNavigate();
    const location = useLocation();

    const initialUser = location.state?.user || { idUtilisateur: userId, prenomUtilisateur: '', nomUtilisateur: '' };

    const [user, setUser] = useState(initialUser);
    const [contacts, setContacts] = useState([]);

    const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
    const [newContact, setNewContact] = useState({
        prenomContact: '',
        nomContact: '',
        emailContact: '',
        telephoneContact: '',
        role: 'Tuteur' // Rôle par défaut
    });

    useEffect(() => {
        fetchUserContacts();
    }, [userId]);

    const fetchUserContacts = async () => {
        try {
          const response = await fetch("/api/searchContactApprenti", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idApprenti: userId }),
          });
          const data = await response.json();
          if (data.success) {
            setContacts(data.contacts || []);
          } else {
            throw new Error(data.error || "Erreur chargement des contacts.");
          }
        } catch (err) {
          console.error("Erreur contacts:", err);
        }
    };

    const handleDeleteContact = async (contactIdToDelete) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce contact de la liste ?")) {
            try {
                const response = await fetch('/api/deleteContact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idApprenti: userId, idContact: contactIdToDelete })
                });
                const data = await response.json();
                
                if (!data.success) throw new Error(data.error);
                // Rafraîchir la liste des contacts pour voir la suppression
                await fetchUserContacts();
            } catch(err) {
                alert(`Erreur lors de la suppression: ${err.message}`);
            }
        }
    };

    const handleAddContactSubmit = async (e) => {
        e.preventDefault();

        const contactData = {
          prenomContact: newContact.prenomContact,
          nomContact: newContact.nomContact,
          emailContact: newContact.emailContact,
          telephoneContact: newContact.telephoneContact,
          idRole: contactRoleMap[newContact.role],
          idApprenti: user.idUtilisateur, // très important : c'est l'idApprenti pour la table contact
        };
    
        try {
          const response = await fetch("/api/createNewContactAndLink", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactData),
          });
      
          if (!response.ok) {
            const txt = await response.text();
            throw new Error(`HTTP ${response.status} : ${txt}`);
          }
      
          const data = await response.json();
          if (!data.success) throw new Error(data.error || "Erreur inconnue côté serveur.");
      
          // On recharge la liste des contacts de cet apprenti
          await fetchUserContacts();
      
          // Reset du formulaire + fermeture du modal
          setNewContact({
            prenomContact: "",
            nomContact: "",
            emailContact: "",
            telephoneContact: "",
            role: "Tuteur",
          });
          setIsAddContactModalOpen(false);
        } catch (err) {
          alert(`Erreur lors de la création du contact: ${err.message}`);
        }
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };
    const handleNewContactChange = (e) => {
        const { name, value } = e.target;
        setNewContact((prev) => ({ ...prev, [name]: value }));
    };
    const handleUserSubmit = (e) => {
        e.preventDefault();
        alert(`Modification de l'utilisateur ${user.prenomUtilisateur} simulée !`);
        navigate('/gestion');
    };

    return (
        // On utilise les mêmes classes CSS que pour la page de détail
        <div className="detail-page-container">
            {/* Bouton pour revenir à la page précédente */}
            <button onClick={() => navigate(-1)} className="back-button">← Retour à la liste</button>

            <div className="edit-page-layout">
            
                {/* --- FORMULAIRE POUR MODIFIER L'UTILISATEUR --- */}
                <form onSubmit={handleUserSubmit} className="user-edit-form">
                    <h2>Modifier le profil</h2>

                    <div className="form-group">
                        <label htmlFor="nomUtilisateur">Nom</label>
                        <input id="nomUtilisateur" name="nomUtilisateur" value={user.nomUtilisateur} onChange={handleUserChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="prenomUtilisateur">Prénom</label>
                        <input id="prenomUtilisateur" name="prenomUtilisateur" value={user.prenomUtilisateur} onChange={handleUserChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" value={user.email} onChange={handleUserChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telephone">Téléphone</label>
                        <input id="telephone" name="telephone" type="telephone" value={user.telephone} onChange={handleUserChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="idRole">Rôle</label>
                        <select id="idRole" name="idRole" value={user.idRole} onChange={handleUserChange}>
                            {/* On génère les options à partir de notre dictionnaire */}
                            {Object.entries(roleIdToName).map(([id, name]) => (
                                <option key={id} value={id}>{name}</option>
                            ))}
                        </select>
                    </div>
                        
                    <button type="submit" className="saving_btn">Sauvegarder les modifications</button>
                </form>

                {/* --- SECTION POUR AFFICHER LES CONTACTS --- */}
                <div className="contacts-section">
                    <h2>Contacts</h2>
                    {contacts.map(contact => (
                        <div key={contact.idContact} className="contact-details-card">
                          <button
                            className="delete-user-btn"
                            onClick={() => handleDeleteContact(contact.idContact)}
                            style={{ float: "right" }}
                          >
                            ✕
                          </button>
                          <h3>{roleIdToName[contact.idRole] || "Contact"}</h3>
                          <p><strong>Nom:</strong> {contact.prenomContact} {contact.nomContact}</p>
                          <p><strong>Email:</strong> {contact.emailContact}</p>
                          <p><strong>Téléphone:</strong> {contact.telephoneContact}</p>
                        </div>
            ))}
                     <button className="add-contact-button" onClick={() => setIsAddContactModalOpen(true)}>+ Ajouter un Contact</button>
                </div>
            </div>
            {/* --- MODAL D'AJOUT DE CONTACT --- */}
            {isAddContactModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Créer un nouveau contact</h2>
                        <form onSubmit={handleAddContactSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Prénom</label>
                                <input name="prenomContact" value={newContact.prenomContact} onChange={handleNewContactChange} required />
                            </div>
                            <div className="form-group">
                                <label>Nom</label>
                                <input name="nomContact" value={newContact.nomContact} onChange={handleNewContactChange} required />
                            </div>
                            <div className="form-group form-group-full">
                                <label>Email</label>
                                <input name="emailContact" type="email" value={newContact.emailContact} onChange={handleNewContactChange} required />
                            </div>
                            <div className="form-group">
                                <label>Téléphone</label>
                                <input name="telephoneContact" type="tel" value={newContact.telephoneContact} onChange={handleNewContactChange} />
                            </div>
                            <div className="form-group">
                                <label>Type de contact</label>
                                <select name="role" value={newContact.role} onChange={handleNewContactChange}>
                                    {Object.keys(contactRoleMap).map(roleName => (
                                        <option key={roleName} value={roleName}>{roleName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setIsAddContactModalOpen(false)}>Annuler</button>
                                <button type="submit" className="btn-primary">Créer et Associer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserEdit;