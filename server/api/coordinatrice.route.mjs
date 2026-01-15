import express from "express";
import {pool} from "../server.mjs";

const router = express.Router();

router.post("/createCoordinatrice", async (req, res) => {
    try{

        const {idUtilisateur} = req.body || {};
        if(!idUtilisateur){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "INSERT INTO Coordinatrice (idUtilisateur) values ('" + idUtilisateur + "');"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création de la coordinatrice." });
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/searchAllCoordinatrice", async (req, res) => {
    try{

        const [result] = await pool.execute(
            "SELECT * FROM Coordinatrice INNER JOIN Utilisateur ON Utilisateur.idUtilisateur = Coordinatrice.idUtilisateur;"
        );

        return res.json({success: true, coordinatrice: result});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/deleteCoordinatrice", async (req, res) => {
    try{

        const {idUtilisateur} = req.body || {};
        if(!idUtilisateur){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const [result] = await pool.execute(
            "DELETE FROM Coordinatrice WHERE idUtilisateur='" + idUtilisateur +"';"
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la suppression de la coordinatrice."});
        }

        return res.json({success: true});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});
export default router;