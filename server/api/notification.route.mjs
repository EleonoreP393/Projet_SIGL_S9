import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createNotification", async (req, res) => {
    try{

        const {idUtilisateur, description, descriptionCourte, lienIcone} = req.body || {};
        if(!idUtilisateur || !description || !descriptionCourte || !lienIcone ){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO notification (idUtilisateur, description, descriptionCourte, lienIcone, lue) VALUES (?, ?, ?, ?, false)", [idUtilisateur, description, descriptionCourte, lienIcone]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création de la notification." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateNotification", async (req, res) => {
    try{

        const {idNotification, description, descriptionCourte, lienIcone} = req.body || {};
        if(!idNotification || !description || !descriptionCourte || !lienIcone){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE notification SET description='" + description + "', descriptionCourte='" + descriptionCourte  + "', lienIcone='" + lienIcone + "', lue=false" + " WHERE idNotification=" + idNotification +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification de la notification."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllNotifications", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM notification;"
        );

        return res.json({success: true, notifications: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchNotificationsParUtilisateur", async (req, res) => {
    try{

        const {idUtilisateur} = req.body || {};
        if(!idUtilisateur){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "SELECT * FROM notification WHERE idUtilisateur=" + idUtilisateur + ";"
        );

        return res.json({success: true, notifications: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteNotification", async (req, res) => {
    try{

        const {idNotification} = req.body || {};
        if(!idNotification){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM notification WHERE idNotification= ?", [idNotification]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression de la notification."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

export default router;