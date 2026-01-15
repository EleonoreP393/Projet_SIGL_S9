import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createEvenement", async (req, res) => {
    try{

        const {nom, description, lieu, dateEvenement, typeEvenement, heure, minutes} = req.body || {};
        if(!nom || !description || !lieu || !dateEvenement || !typeEvenement || !heure || !minutes){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO evenement (nom, description, lieu, dateEvenement, typeEvenement, heure, minutes) values ('" + nom + "', '" + description + "', '" + lieu + "', '" + dateEvenement + "', '" + typeEvenement + "', " + heure + ", " + minutes + ");"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création de l'événement." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateEvenement", async (req, res) => {
    try{

        const {idEvenement, nom, description, lieu, dateEvenement, typeEvenement, heure, minutes} = req.body || {};
        if(!idEvenement || !nom || !description || !lieu || !dateEvenement || !typeEvenement || !heure || !minutes){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE evenement SET nom='" + nom + "', description='" + description + "', lieu='" + lieu + "', dateEvenement='" + dateEvenement + "', typeEvenement='" + typeEvenement + "', heure='" + heure + "', minutes='" + minutes + "' WHERE idEvenement=" + idEvenement +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification de l'événement."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllEvenement", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Evenement;"
        );

        return res.json({success: true, evenement: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteEvenement", async (req, res) => {
    try{

        const {idEvenement} = req.body || {};
        if(!idEvenement){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Evenement WHERE idEvenement='" + idEvenement +"';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression de l'événement."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});
export default router;