import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createMA", async (req, res) => {
    try{

        const {idUtilisateur, idEntreprise} = req.body || {};
        if(!idUtilisateur || !idEntreprise){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO MaitreApprentissage (idUtilisateur, idEntreprise) values ('" + idUtilisateur + "', '" + idEntreprise + "');"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création du maître d'apprentissage." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllMA", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM MaitreApprentissage;"
        );

        return res.json({success: true, maitreApprentissage: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateMA", async (req, res) => {
    try{

        const {idUtilisateur, idEntreprise} = req.body || {};
        if(!idUtilisateur || !idEntreprise){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE apprenti SET idEntreprise='" + idEntreprise + "' WHERE idUtilisateur=" + idUtilisateur +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification du maître d'apprentissage."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteMA", async (req, res) => {
    try{

        const {idUtilisateur} = req.body || {};
        if(!idUtilisateur){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM MaitreApprentissage WHERE idUtilisateur='" + idUtilisateur +"';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression du maître d'apprentissage."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});
export default router;