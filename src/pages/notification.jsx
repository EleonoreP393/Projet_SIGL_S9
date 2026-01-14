import React, { useMemo, useState, useEffect } from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const READ_KEY = "readNotificationIds_v1";

function loadReadIdsFromDB() {
  try {
    const stored = localStorage.getItem(READ_KEY);
    const arr = stored ? JSON.parse(stored) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(set) {
  localStorage.setItem(READ_KEY, JSON.stringify(Array.from(set)));
}

function formatDateTimeFR(isoString) {
  const d = new Date(isoString);
  const date = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `reçu à ${time} le ${date}`;
}

function Notification() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationsError, setNotificationsError] = useState(null);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [readIds, setReadIds] = useState(() => loadReadIdsFromDB());
  const [selectedId, setSelectedId] = useState(null);

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

  // Tri initial: une seule fois au chargement
  const ordered = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const aIsNew = a.lue === 0 && !readIds.has(a.idNotification);
      const bIsNew = b.lue === 0 && !readIds.has(b.idNotification);
      const byNew = Number(bIsNew) - Number(aIsNew);
      if (byNew !== 0) return byNew;
      return new Date(b.dateReception) - new Date(a.dateReception);
    });
  }, [notifications]);

  // Liste avec statut "nouvelle" calculé dynamiquement
  const list = useMemo(() => {
    return ordered.map(n => ({
      ...n,
      lue: !readIds.has(n.idNotification),
    }));
  }, [ordered, readIds]);

  const selected = useMemo(
    () => list.find((n) => n.idNotification === selectedId),
    [list, selectedId]
  );

  const handleSelect = (id) => {
    setSelectedId(id);
    // Si pas encore lu, marquer comme lu
    if (!readIds.has(id)) {
      const nextRead = new Set(readIds);
      nextRead.add(id);
      setReadIds(nextRead);
      saveReadIds(nextRead);
    }
  };

  const markAllAsRead = () => {
    const allIds = new Set(notifications.map(n => n.idNotification));
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const basePages = [
    { label: "Journal de Formation", path: "/journal" },
    { label: "Événements", path: "/evenements" },
    { label: "Notifications", path: "/notifications" },
  ];
  const Pages = [
    ...basePages,
    { label: "Gestion", path: "/gestion" },
  ];
  const pagesToDisplay = userRole === 2 ? Pages : basePages;

  if (notificationsLoading) {
    return <div>Chargement des notifications...</div>;
  }

  if (notificationsError) {
    return <div>Erreur : {notificationsError}</div>;
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
      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
        aria-label="Se déconnecter"
        title="Se déconnecter"
      >
        Déconnexion
      </button>
      <main className="main-content">
        <section className="notifications-page">
          <div className="notifications-panel">
            <h1 className="notifications-panel__title">Toutes les notifications</h1>

            <div className="notif-toolbar">
              <button className="btn btn-primary" onClick={markAllAsRead}>
                Marquer tout comme lus
              </button>
            </div>

            <div className="notifications-split">
              <aside className="notif-list-pane" aria-label="Liste des notifications">
                <div className="notifications-list">
                  {list.length === 0 ? (
                    <p>Aucune notification</p>
                  ) : (
                    list.map((notif) => (
                      <button
                        key={notif.idNotification}
                        type="button"
                        className={`notification-item ${notif.lue ? "new" : ""} ${
                          notif.idNotification === selectedId ? "active" : ""
                        }`}
                        onClick={() => handleSelect(notif.idNotification)}
                        title={notif.descriptionCourte}
                        aria-selected={notif.idNotification === selectedId}
                      >
                        <span className="notification-text">{notif.descriptionCourte}</span>
                        <span className="notif-item-meta">
                          {formatDateTimeFR(notif.dateReception)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </aside>

              <section className="notif-detail-pane" aria-label="Détail de la notification">
                {selected ? (
                  <>
                    <h2 className="notif-detail-title">Notification</h2>
                    <div className="notif-detail-meta">
                      {formatDateTimeFR(selected.dateReception)}
                    </div>
                    <div className="notif-detail-body">
                      <p className="notif-detail-message">{selected.description}</p>
                    </div>
                  </>
                ) : (
                  <div className="notif-detail-empty">
                    Sélectionnez une notification à gauche.
                  </div>
                )}
              </section>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Notification;
