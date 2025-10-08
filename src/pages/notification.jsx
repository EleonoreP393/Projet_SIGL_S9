import React, { useMemo, useState, useEffect } from "react";
import "../style/style.css";
import logo from "../assets/logo.png";
import { notifications } from "../data/notifications";


const READ_KEY = "readNotificationIds_v1";

function loadReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    const arr = raw ? JSON.parse(raw) : [];
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


function Notification(){
    const pages = ["Journal de Formation", "Documents", "Evénements", "Notifications", "Livret" ]; // labels du bandeau
    // IDs lus depuis localStorage
    const [readIds, setReadIds] = useState(() => loadReadIds());
    // État local des notifs (isNew recalculé en tenant compte des lus)
    const [list, setList] = useState(() =>
      notifications.map(n => ({
        ...n,
        isNew: n.isNew && !readIds.has(n.id),
      }))
    );
    // Trier: nouvelles d’abord
    const ordered = useMemo(() => {
        return [...list].sort((a, b) => {
            const byNew = Number(b.isNew) - Number(a.isNew);
            if (byNew !== 0) return byNew;
            return new Date(b.receivedAt) - new Date(a.receivedAt);
        });
    }, [list]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (ordered.length > 0) setSelectedId(ordered[0].id);
    }, [ordered]);

    const selected = useMemo(
      () => ordered.find((n) => n.id === selectedId),
      [ordered, selectedId]
    );

    const handleSelect = (id) => {
      setSelectedId(id);
      // Si pas encore lu → marquer comme lu
      if (!readIds.has(id)) {
        const nextRead = new Set(readIds);
        nextRead.add(id);
        setReadIds(nextRead);
        saveReadIds(nextRead);
        setList(prev =>
          prev.map(n => n.id === id ? { ...n, isNew: false } : n)
        );
      }
    };

    const markAllAsRead = () => {
        const allIds = new Set(notifications.map(n => n.id));
        setReadIds(allIds);
        saveReadIds(allIds);
        setList(prev => prev.map(n => ({ ...n, isNew: false })));
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
            <section className="notifications-page">
              <div className="notifications-panel">
                <h1 className="notifications-panel__title">Toutes les notifications</h1>

                <div className="notif-toolbar">
                    <button className="btn btn-primary" onClick={markAllAsRead}>Marquer tout comme lus</button>
                </div>

                <div className="notifications-split">
                  <aside className="notif-list-pane" aria-label="Liste des notifications">
                    <div className="notifications-list">
                      {ordered.map((notif) => (
                        <button
                          key={notif.id}
                          type="button"
                          className={`notification-item ${notif.isNew ? "new" : ""} ${
                            notif.id === selectedId ? "active" : ""
                          }`}
                          onClick={() => handleSelect(notif.id)}
                          title={notif.message}
                          aria-selected={notif.id === selectedId}
                        >
                          <span className="notification-text">{notif.message}</span>
                          <span className="notif-item-meta">{formatDateTimeFR(notif.receivedAt)}</span>
                        </button>
                      ))}
                    </div>
                  </aside>
                   
                  <section className="notif-detail-pane" aria-label="Détail de la notification">
                    {selected ? (
                      <>
                        <h2 className="notif-detail-title">Notification</h2>
                        <div className="notif-detail-meta">{formatDateTimeFR(selected.receivedAt)}</div>
                        <div className="notif-detail-body">
                          <p className="notif-detail-message">{selected.message}</p>
                        </div>
                      </>
                    ) : (
                      <div className="notif-detail-empty">Sélectionnez une notification à gauche.</div>
                    )}
                  </section>
                </div>
              </div>
            </section>
        </main>
        </>
    )

}

export default Notification;