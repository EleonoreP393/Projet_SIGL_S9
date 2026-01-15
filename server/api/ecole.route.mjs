import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createEcole", async (req, res) => {
    try{

        const {nomEcole, adresseEcole} = req.body || {};
        if(!nomEcole || !adresseEcole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO ecole (nomEcole, adresseEcole) VALUES (?, ?)", [nomEcole, adresseEcole]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création de l'école." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateEcole", async (req, res) => {
    try{

        const {idEcole, nomEcole, adresseEcole} = req.body || {};
        if(!idEcole || !nomEcole || !adresseEcole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE ecole SET nomEcole='" + nomEcole + "', adresseEcole='" + adresseEcole +"' WHERE idEcole=" + idEcole +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification de l'école."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllEcole", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM ecole;"
        );

        return res.json({success: true, ecoles: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchEcoleParNom", async (req, res) => {
    try{

        const {nomEcole} = req.body || {};
        if(!nomEcole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "SELECT * FROM ecole WHERE nomEcole LIKE '%" + nomEcole + "%';"
        );

        return res.json({success: true, evenement: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteEcole", async (req, res) => {
    try{

        const {idEcole} = req.body || {};
        if(!idEcole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM ecole WHERE idEcole= ?", [idEcole]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression de l'école."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

export default router;