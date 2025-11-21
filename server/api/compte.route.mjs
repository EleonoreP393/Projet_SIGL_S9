import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createCompte", async (req, res) => {
    try{

        const {nomUtilisateur, prenomUtilisateur, email, motDePasse, idRole} = req.body || {};
        if(!nomUtilisateur || !prenomUtilisateur || !email || !motDePasse || !idRole){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO utilisateur (nomUtilisateur, prenomUtilisateur, email, motDePasse, idRole) VALUES (?,?,?,?,?)", [nomUtilisateur, prenomUtilisateur, email, motDePasse, idRole]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création du compte." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllCompte", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Utilisateur;"
        );

        return res.json({success: true, utilisateurs: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateCompte", async (req, res) => {
    try{

        const {nomUtilisateur, prenomUtilisateur, email} = req.body || {};
        if(!nomUtilisateur || !prenomUtilisateur || !email){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "UPDATE utilisateur SET nomUtilisateur='" + nomUtilisateur + "', prenomUtilisateur='" + prenomUtilisateur + "', email='" + email + "' WHERE idUtilisateur=" + idUtilisateur +";"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification du compte."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteCompte", async (req, res) => {
    try{

        const {idUtilisateur} = req.body || {};
        if(!idUtilisateur){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Utilisateur WHERE idUtilisateur='" + idUtilisateur +"';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression du compte."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});
export default router;