import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/changePassword", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body || {};
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, error: "Champs requis" });
    }

    if(password != confirmPassword){
        return res.status(400).json({success: false, error: "La confirmation du mot de passe est incorrecte"});
    }

    const [rows] = await pool.query(
      "UPDATE utilisateur set motDePasse = ? where email = ?",
      [password, email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: "Email invalide" });
    }

    return res.json({success: true});
} catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;