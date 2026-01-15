import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createLivrable", async (req, res) => {
    try{

        const {idApprenti, nom, description, dateOuverture, dateFermeture} = req.body || {};
        if(!nom || !description || !lieu || !dateOuverture || !dateFermeture){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO livrable (idApprenti, nom, description, dateOuverture, dateFermeture) values ('" + idApprenti + "', '" + nom + "', '" + description + "', '" + dateOuverture + "', '" + dateFermeture + "');"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création du livrable." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateLivrable", async (req, res) => {
    try{

        const {idLivrable, idApprenti, nom, description, dateOuverture, dateFermeture} = req.body || {};
        if(!idLivrable || !idApprenti || !nom || !description || !dateOuverture || !dateFermeture){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE livrable SET idApprenti='" + idApprenti + "', nom='" + nom + "', description='" + description + "', dateOuverture='" + dateOuverture + "', dateFermeture='" + dateFermeture + "' WHERE idLivrable=" + idLivrable +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification du livrable."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllLivrable", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Livrable;"
        );

        return res.json({success: true, evenement: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchLivrableApprenti", async (req, res) => {
    try{

        const {idApprenti} = req.body || {};
        if(!idApprenti){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "SELECT * FROM Livrable WHERE idApprenti='" + idApprenti + "';"
        );

        return res.json({success: true, evenement: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteLivrable", async (req, res) => {
    try{

        const {idLivrable} = req.body || {};
        if(!idLivrable){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Livrable WHERE idLivrable='" + idLivrable +"';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression du livrable."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

export default router;