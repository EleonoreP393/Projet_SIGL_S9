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

router.post("/createCompte", async (req, res) => {
    try{

        const {nomUtilisateur, prenomUtilisateur, email, motDePasse, idRole} = req.body || {};
        if(!nomUtilisateur || !prenomUtilisateur || !email || !motDePasse || !idRole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        //Chiffrement du mot de passe pour comparaison avec la valeur stockée en base de données
        let encryptedPassword = await Sha256Hash.encode(motDePasse);

        const [result] = await pool.execute(
            "INSERT INTO utilisateur (nomUtilisateur, prenomUtilisateur, email, motDePasse, idRole) VALUES (?,?,?,?,?)", [nomUtilisateur, prenomUtilisateur, email, encryptedPassword, idRole]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création du compte." });
        }

        const newUserId = result.insertId;

        return res.json({success: true, idUtilisateur: newUserId });

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllCompte", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Utilisateur;"
        );

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateCompte", async (req, res) => {
    try{

        const {idUtilisateur, nomUtilisateur, prenomUtilisateur, email, idRole} = req.body || {};
        if(!idUtilisateur || !nomUtilisateur || !prenomUtilisateur || !email || !idRole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE utilisateur SET nomUtilisateur = ?, prenomUtilisateur = ?, email = ?, idRole = ? WHERE idUtilisateur = ?",
            [nomUtilisateur, prenomUtilisateur, email, idRole, idUtilisateur]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification du compte."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteCompteComplet", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { idUtilisateur } = req.body || {};
    if (!idUtilisateur) {
      connection.release();
      return res.status(400).json({ success: false, error: "idUtilisateur requis" });
    }

    await connection.beginTransaction();

    const [rows] = await connection.execute(
      "SELECT idRole FROM utilisateur WHERE idUtilisateur = ?",
      [idUtilisateur]
    );

    if (rows.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, error: "Utilisateur introuvable." });
    }

    const idRole = rows[0].idRole;

    // Apprenti
    if (idRole === 1) {
      await connection.execute("DELETE FROM contact WHERE idalternant = ?", [idUtilisateur]);
      await connection.execute("DELETE FROM apprenti WHERE idUtilisateur = ?", [idUtilisateur]);
    }

    // Coordinatrice
    if (idRole === 2) {
      await connection.execute("DELETE FROM coordinatrice WHERE idUtilisateur = ?", [idUtilisateur]);
    }

    // Tuteur
    if (idRole === 3) {
      await connection.execute("DELETE FROM tuteur WHERE idUtilisateur = ?", [idUtilisateur]);
    }

    // Jury
    if (idRole === 4) {
      await connection.execute("DELETE FROM jury WHERE idUtilisateur = ?", [idUtilisateur]);
    }

    // Maitre Apprentissage
    if (idRole === 5) {
      await connection.execute("DELETE FROM maitreapprentissage WHERE idUtilisateur = ?", [idUtilisateur]);
    }

    const [deleteUserResult] = await connection.execute(
      "DELETE FROM utilisateur WHERE idUtilisateur = ?",
      [idUtilisateur]
    );

    if (deleteUserResult.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, error: "Suppression du compte impossible." });
    }

    await connection.commit();
    connection.release();
    return res.json({ success: true });

  } catch (e) {
    console.error(">>> ERREUR deleteCompteComplet:", e);
    try {
      await connection.rollback();
    } catch {}
    connection.release();
    return res.status(500).json({ success: false, error: "Erreur serveur lors de la suppression du compte." });
  }
});

export default router;
