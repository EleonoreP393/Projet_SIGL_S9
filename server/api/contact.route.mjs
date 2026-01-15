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
    try{

        const {idApprenti} = req.body || {};
        if(!idApprenti){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "SELECT * FROM Contact WHERE idApprenti='" + idApprenti + "';"
        );

        return res.json({success: true, evenement: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
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

export default router;