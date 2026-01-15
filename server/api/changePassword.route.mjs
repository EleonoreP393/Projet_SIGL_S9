import express from "express";
import {pool} from "../server.mjs";

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

router.post("/changePassword", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body || {};
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, error: "Champs requis" });
    }

    if(password != confirmPassword){
        return res.status(400).json({success: false, error: "La confirmation du mot de passe est incorrecte"});
    }

    //Chiffrage du mot de passe en sha256
    let encryptedPassword = await Sha256Hash.encode(password);

    const [result] = await pool.execute(
      "UPDATE utilisateur SET motDePasse = ? WHERE email = ?",
      [encryptedPassword, email]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Email invalide" });
    }

    return res.json({success: true});
} catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
});

export default router;

