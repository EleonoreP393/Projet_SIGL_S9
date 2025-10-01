import React, { useState } from "react";
import '../style/style.css';

function Login() {
  // États pour stocker les valeurs des champs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Fonction qui sera appelée au clic sur le bouton
  const handleLogin = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    console.log("Identifiant:", username);
    console.log("Mot de passe:", password);

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
            <input
              type="text"
              value={username}
              placeholder="Identifiant"
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "80%" }}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "80%" }}
            />
          </div>
          <div className="forgot-password" onClick={() => alert("Rediriger vers la page de récupération")}>Mot de passe oublié ?</div>
          <button type="submit">Se connecter ♪</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
