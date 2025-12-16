import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createApprenti", async (req, res) => {
    try{

        const {idUtilisateur, idPromotion, idEntreprise, idMa, idJury, idTp} = req.body || {};
        if(!idUtilisateur || !idPromotion || !idEntreprise || !idMa || !idJury || !idTp){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO apprenti (idUtilisateur, idPromotion, idEntreprise, idMa, idJury, idTp) values ('" + idUtilisateur + "', '" + idPromotion + "', '" + idEntreprise + "', '" + idMa + "', '" + idJury + "', '" + idTp + "');"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création de l'apprenti." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllApprenti", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Apprenti;"
        );

        return res.json({success: true, apprenti: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateApprenti", async (req, res) => {
    try{

        const {idUtilisateur, idPromotion, idEntreprise, idMa, idJury, idTp} = req.body || {};
        if(!idUtilisateur || !idPromotion || !idEntreprise || !idMa || !idJury || !idTp){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE apprenti SET idPromotion='" + idPromotion + "', idEntreprise='" + idEntreprise + "', idMa='" + idMa + "', idJury='" + idJury+ "', idTp='" + idTp + "' WHERE idUtilisateur=" + idUtilisateur +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification de l'apprenti."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteApprenti", async (req, res) => {
    try{

        const {idUtilisateur} = req.body || {};
        if(!idUtilisateur){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Apprenti WHERE idUtilisateur='" + idUtilisateur +"';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression de l'apprenti."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});
export default router;