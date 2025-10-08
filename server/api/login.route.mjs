import express from "express";
import { pool } from "../connectToUser.mjs";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Champs requis" });
    }

    const [rows] = await pool.query(
      "SELECT idUtilisateur, nomUtilisateur, motDePasse FROM utilisateur WHERE nomUtilisateur = ? AND motDePasse = ?",
      [username, password]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: "Identifiants invalides" });
    }

    return res.json({ success: true, user: { id: rows[0].id, username: rows[0].username } });
} catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;