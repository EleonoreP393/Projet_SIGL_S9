import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createEntreprise", async (req, res) => {
    try{

        const {nom, siret, adresse} = req.body || {};
        if(!nom || !siret || !adresse){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO entreprise (nom, siret, adresse) VALUES (?, ?, ?)",[nom, siret,adresse]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création de l'entreprise." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllEntreprise", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Entreprise;"
        );

        return res.json({success: true, entreprises: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchEntrepriseId", async (req, res) => {
    try{

        const {idEntreprise} = req.body || {};
        if(!idEntreprise){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "SELECT * FROM Entreprise WHERE idEntreprise='" + idEntreprise + "';"
        );

        return res.json({success: true, evenement: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateEntreprise", async (req, res) => {
    try{

        const {idEntreprise, nom, siret, adresse} = req.body || {};
        if(!idEntreprise || !nom || !siret || !adresse){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE entreprise SET nom='" + nom + "', siret='" + siret + "', adresse='" + adresse + "' WHERE idEntreprise=" + idEntreprise +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification de l'entreprise."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteEntreprise", async (req, res) => {
    try{

        const {idEntreprise} = req.body || {};
        if(!idEntreprise){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Entreprise WHERE idEntreprise= ?", [idEntreprise]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression de l'entreprise."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});
export default router;