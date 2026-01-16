import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createJury", async (req, res) => {
    try{

        const {idUtilisateur} = req.body || {};
        if(!idUtilisateur){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO Jury (idUtilisateur) values ('" + idUtilisateur + "');"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création du jury." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllJury", async (req, res) => {
    try{

        const [result] = await pool.execute(
          `SELECT 
             j.idUtilisateur, 
             u.nomUtilisateur AS nom,
             u.prenomUtilisateur AS prenom,
             u.email
           FROM jury j
           JOIN utilisateur u ON u.idUtilisateur = j.idUtilisateur`
        );

        return res.json({success: true, jurys: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteJury", async (req, res) => {
    try{

        const {idUtilisateur} = req.body || {};
        if(!idUtilisateur){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM jury WHERE idUtilisateur='" + idUtilisateur +"';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression du jury."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});
export default router;