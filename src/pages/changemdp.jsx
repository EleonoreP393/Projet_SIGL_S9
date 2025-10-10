import React, { useState } from "react";
import "../style/style.css";
import { useNavigate } from "react-router-dom";

function Changemdp() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (val) => /\S+@\S+\.\S+/.test(val);
  const passwordIssues = (val) => {
    const issues = [];
    if (val.length < 8) issues.push("Au moins 8 caractères");
    if (!/[a-z]/.test(val)) issues.push("Une lettre minuscule");
    if (!/[A-Z]/.test(val)) issues.push("Une lettre majuscule");
    if (!/[0-9]/.test(val)) issues.push("Un chiffre");
    return issues;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setOk("");

    if (!isValidEmail(email)) return setError("Adresse e-mail invalide.");
    const issues = passwordIssues(pwd);
    if (issues.length > 0) return setError("Mot de passe trop faible: " + issues.join(", "));
    if (pwd !== confirm) return setError("La confirmation ne correspond pas.");

    setLoading(true);
    try {
      const res = await fetch("/api/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pwd, confirmPassword: confirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.error || "Impossible de modifier le mot de passe.");
      }
      setOk("Mot de passe modifié avec succès. Redirection...");
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const issues = passwordIssues(pwd);
  const canSubmit = isValidEmail(email) && issues.length === 0 && pwd === confirm && !loading;

  return (
    <div className="login_body">
      <div className="login-container password-panel" style={{ maxWidth: "400px", margin: "50px auto" }}>

        <form className="password-form" onSubmit={handleSubmit} noValidate>
          <label className="pw-label">
            <input type="email" className="pw-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required/>
          </label>

          <label className="pw-label">
            <div className="pw-input-wrap">
              <input type={showPwd ? "text" : "password"} className="pw-input" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Nouveau mot de passe" required/>
            </div>
          </label>

          <label className="pw-label">
            <div className="pw-input-wrap">
              <input type={showConfirm ? "text" : "password"} className="pw-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmer le mot de passe" required/>
            </div>
          </label>

          {error && <div className="pw-error">{error}</div>}
          {ok && <div className="pw-ok">{ok}</div>}

          <button className="pw-submit" type="submit" disabled={!canSubmit}>
            {loading ? "En cours..." : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Changemdp;