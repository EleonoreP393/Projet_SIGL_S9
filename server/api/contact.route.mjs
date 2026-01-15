import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createContact", async (req, res) => {
    try{

        const {idApprenti, idContact} = req.body || {};
        if(!idApprenti || !idContact){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO contact (idApprenti, idContact) values ('" + idApprenti + "', '" + idContact + "');"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création du contact." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateContact", async (req, res) => {
    try{

        const {idApprenti, idContact} = req.body || {};
        if(!idContact || !idApprenti){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE contact SET idContact='" + idContact + "' WHERE idApprenti=" + idApprenti +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification du contact."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllContact", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Contact;"
        );

        return res.json({success: true, evenement: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchContactApprenti", async (req, res) => {
  try {
    const { idApprenti } = req.body || {};
    if (!idApprenti) {
      return res.status(400).json({ success: false, error: "Champs requis" });
    }
    const [rows] = await pool.execute(
      `SELECT 
         u.idUtilisateur AS idContact,
         u.prenomUtilisateur AS prenomContact,
         u.nomUtilisateur AS nomContact,
         u.email AS emailContact,
         u.telUtilisateur AS telephoneContact,
         u.idRole
       FROM contact c
       JOIN utilisateur u ON c.idContact = u.idUtilisateur
       WHERE c.idalternant = ?`,
      [idApprenti]
    );
    return res.json({ success: true, contacts: rows });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, error: "Erreur serveur" });
  }
});

router.post("/deleteContact", async (req, res) => {
    try{

        const {idContact, idApprenti} = req.body || {};
        if(!idContact || idApprenti){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Contact WHERE idContact='" + idContact +"' AND idApprenti='" + idApprenti + "';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression du contact."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteContactApprenti", async (req, res) => {
    try{

        const {idApprenti} = req.body || {};
        if(!idContact || idApprenti){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Contact WHERE idApprenti='" + idApprenti + "';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression du contact."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/createNewContactAndLink", async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      prenomContact,
      nomContact,
      emailContact,
      telephoneContact,
      idRole,
      idApprenti,
    } = req.body || {};

    // Log pour debug
    console.log(">>> createNewContactAndLink body:", req.body);

    // Vérification des champs requis
    if (
      !prenomContact ||
      !nomContact ||
      !emailContact ||
      !idRole ||
      !idApprenti
    ) {
      connection.release();
      return res
        .status(400)
        .json({ success: false, error: "Champs requis manquants." });
    }

    await connection.beginTransaction();

    // 1) Créer l'utilisateur contact dans la table utilisateur
    const motDePasseParDefaut = "Contact123!"; // à adapter ou générer

    console.log(">>> Insertion dans utilisateur...");
    const [userResult] = await connection.execute(
      `INSERT INTO utilisateur (prenomUtilisateur, nomUtilisateur, email, telUtilisateur, motDePasse, idRole)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        prenomContact,
        nomContact,
        emailContact,
        telephoneContact || null,
        motDePasseParDefaut,
        idRole,
      ]
    );

    const newContactUserId = userResult.insertId; // c'est idContact dans la table de liaison
    console.log(">>> Utilisateur contact créé avec id:", newContactUserId);

    // 2) Créer la liaison dans la table contact (idApprenti, idContact)
    console.log(">>> Insertion dans contact (liaison)...");
    const [linkResult] = await connection.execute(
      `INSERT INTO contact (idalternant, idcontact)
       VALUES (?, ?)`,
      [idApprenti, newContactUserId]
    );

    if (linkResult.affectedRows === 0) {
      throw new Error("La liaison contact-apprenti n'a pas pu être créée.");
    }

    await connection.commit();
    connection.release();

    return res.status(201).json({
      success: true,
      idContact: newContactUserId,
      message: "Contact créé et associé à l'apprenti avec succès.",
    });
  } catch (e) {
    console.error(">>> ERREUR dans createNewContactAndLink:", e);
    try {
      await connection.rollback();
    } catch {}
    connection.release();
    return res
      .status(500)
      .json({ success: false, error: "Erreur serveur lors de la création du contact." });
  }
});

export default router;