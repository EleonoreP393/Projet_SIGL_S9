import express from "express";
import {pool} from "../server.mjs";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/createLivrable", async (req, res) => {
    try{

        const {idApprenti, titre, description, dateOuverture, dateFermeture, idPromotion} = req.body || {};
        if(!titre || !description || !idApprenti || !dateOuverture || !dateFermeture || !idPromotion){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        // 1. Créer le livrable modèle pour l'utilisateur actuel
        const [modelResult] = await pool.execute(
            "INSERT INTO livrable (idApprenti, idPromotion, titre, description, dateOuverture, dateFermeture) values (?, ?, ?, ?, ?, ?);",
            [idApprenti, idPromotion, titre, description, dateOuverture, dateFermeture]
        );
        
        if (modelResult.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la création du livrable modèle." });
        }

        const idModele = modelResult.insertId;

        // 2. Récupérer tous les apprentis de la promotion sélectionnée
        const [apprentisResult] = await pool.execute(
            "SELECT idUtilisateur FROM apprenti WHERE idpromotion = ?",
            [idPromotion]
        );

        // 3. Créer un livrable pour chaque apprenti (sauf s'il y en a un avec le même idApprenti, pour éviter les doublons)
        for (const apprenti of apprentisResult) {
            if (apprenti.idUtilisateur !== parseInt(idApprenti)) {
                await pool.execute(
                    "INSERT INTO livrable (idApprenti, idPromotion, titre, description, dateOuverture, dateFermeture, idModele) values (?, ?, ?, ?, ?, ?, ?);",
                    [apprenti.idUtilisateur, idPromotion, titre, description, dateOuverture, dateFermeture, idModele]
                );
            }
        }

        return res.json({success: true, idModele});

    }catch(e){
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

router.post("/updateLivrable", async (req, res) => {
    try{

        const {idLivrable, titre, description, dateOuverture, dateFermeture, idPromotion} = req.body || {};
        if(!idLivrable || !titre || !description || !dateOuverture || !dateFermeture){
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        // 1. Mettre à jour le livrable lui-même
        const [result] = await pool.execute(
            "UPDATE livrable SET titre=?, description=?, dateOuverture=?, dateFermeture=? WHERE idLivrable=?;",
            [titre, description, dateOuverture, dateFermeture, idLivrable]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Erreur lors de la modification du livrable."});
        }

        // 2. Mettre à jour tous les livrables qui utilisent ce livrable comme modèle
        await pool.execute(
            "UPDATE livrable SET titre=?, description=?, dateOuverture=?, dateFermeture=? WHERE idModele=?;",
            [titre, description, dateOuverture, dateFermeture, idLivrable]
        );

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

        return res.json({success: true, evenements: result});

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
        "SELECT * FROM Livrable WHERE idapprenti='" + idApprenti + "';"
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

        // 1. Supprimer d'abord tous les livrables qui ont ce livrable comme modèle (idModele)
        await pool.execute(
            "DELETE FROM Livrable WHERE idModele = ?;",
            [idLivrable]
        );

        // 2. Supprimer le livrable lui-même
        const [result] = await pool.execute(
            "DELETE FROM Livrable WHERE idLivrable = ?;",
            [idLivrable]
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

router.post("/uploadFileLivrable", upload.single("fichier"), async (req, res) => {
    try {
        const { idLivrable } = req.body || {};
        
        if (!idLivrable || !req.file) {
            return res.status(400).json({ success: false, error: "Champs requis" });
        }

        const fileName = req.file.filename;
        const filePath = req.file.path;

        // Optionnel : stocker le chemin du fichier en base de données
        await pool.execute(
            "UPDATE Livrable SET fichier=? WHERE idLivrable=?",
            [fileName, idLivrable]
        );

        return res.json({ success: true, message: "Fichier ajouté avec succès", fileName });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});

export default router;