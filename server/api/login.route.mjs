import express from "express";
import { pool } from "../connectToUser.mjs";

const router = express.Router();

//Chiffrement du mot de passe
class Sha256Hash {
    static async encode(input) {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
}

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Champs requis" });
    }

    //Chiffrement du mot de passe pour comparaison avec la valeur stockée en base de données
    let encryptedPassword = await Sha256Hash.encode(password);

    const [rows] = await pool.query(
      "SELECT idUtilisateur, nomUtilisateur, motDePasse, idRole FROM utilisateur WHERE nomUtilisateur = ? AND motDePasse = ?",
      [username, encryptedPassword]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: "Identifiants invalides" });
    }

    return res.json({ success: true, user: { id: rows[0].idUtilisateur, username: rows[0].nomUtilisateur, idRole: rows[0].idRole } });
} catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;
