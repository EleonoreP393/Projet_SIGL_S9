import React, { useState } from "react";
import '../style/style.css';
import { useNavigate } from "react-router-dom";

function Login() {
  // États pour stocker les valeurs des champs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fonction qui sera appelée au clic sur le bouton
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError("");
    setLoading(true);

    try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.success === false) {
      throw new Error(data?.error || "Identifiants invalides");
    }
    // Marquer comme connecté
    localStorage.setItem("auth", "1");
    // Redirection vers la Home (route "/")
    navigate("/", { replace: true });
  } catch (err) {
    setError(err.message || "Erreur de connexion");
  } finally {
    setLoading(false);
  }

    // Réinitialiser les champs
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login_body">
      <div className="login-container" style={{ maxWidth: "400px", margin: "50px auto" }}>
        <h1>♫ Star ♫ Academy ♪</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "10px" }}>
            <input type="text" value={username} placeholder="Identifiant" onChange={(e) => setUsername(e.target.value)} style={{ width: "80%" }}/>
          </div>
          <div>
            <input type="password" value={password} placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} style={{ width: "80%" }}/>
          </div>

          {error && (
            <div style={{ color: "#ff6b6b", marginTop: 8 }}>{error}</div>
          )}

          <div className="forgot-password" role="button" tabIndex={0} onClick={() => navigate("/changemdp")} onKeyDown={(e) => e.key === "Enter" && navigate("/changemdp")}>Mot de passe oublié ?</div>
          <button type="submit" disabled={loading}>{loading ? "Connexion..." : "Se connecter ♪"}</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
