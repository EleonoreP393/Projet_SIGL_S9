import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createPromotion", async (req, res) => {
    try{

        const {nomPromotion, annee, idEcole} = req.body || {};
        if(!nomPromotion || !annee || !idEcole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO promotion (nomPromotion, annee, idEcole) values ('" + nomPromotion + "', '" + annee + "', '" + idEcole + "');"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création de la promotion." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllPromotion", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Promotion;"
        );

        return res.json({success: true, promotions: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchPromotionId", async (req, res) => {
    try{

        const {idPromotion} = req.body || {};
        if(!idPromotion){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "SELECT * FROM Promotion WHERE idPromotion='" + idPromotion + "';"
        );

        return res.json({success: true, evenement: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updatePromotion", async (req, res) => {
    try{

        const {idPromotion, nomPromotion, annee, idEcole} = req.body || {};
        if(!idPromotion || !nomPromotion || !annee || !idEcole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE promotion SET nomPromotion='" + nomPromotion + "', annee='" + annee + "', idEcole='" + idEcole + "' WHERE idPromotion=" + idPromotion +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification de la promotion."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deletePromotion", async (req, res) => {
    try{

        const {idPromotion} = req.body || {};
        if(!idPromotion){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Promotion WHERE idPromotion='" + idPromotion +"';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression de la promotion."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});
export default router;