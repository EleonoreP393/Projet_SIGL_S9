// server.mjs
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

// 1) Crée et exporte le pool (dispo pour les routes)
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "0000",
  database: process.env.DB_NAME || "staracademy",
  waitForConnections: true,
  connectionLimit: 10,
});

// 2) Importe les routes APRÈS l'export du pool
import loginRouter from "./api/login.route.mjs";
import changePasswordRouter from "./api/changePassword.route.mjs";
import compteRouter from "./api/compte.route.mjs";
import evenementRouter from "./api/evenement.route.mjs";
import contactRouter from "./api/contact.route.mjs";
import apprentiRouter from "./api/apprenti.route.mjs";
import coordinatriceRouter from "./api/coordinatrice.route.mjs";
import juryRouter from "./api/jury.route.mjs";
import tuteurRouter from "./api/tuteur.route.mjs";
import maitreApprentissageRouter from "./api/maitreApprentissage.route.mjs";
import promotionRouter from "./api/promotion.route.mjs";
import entrepriseRouter from "./api/entreprise.route.mjs";
import ecoleRouter from "./api/ecole.route.mjs";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// 3) Monte les routes
app.use("/api", loginRouter);
app.use("/api", changePasswordRouter);
app.use("/api", compteRouter);
app.use("/api", evenementRouter);
app.use("/api", contactRouter);
app.use("/api", apprentiRouter);
app.use("/api", coordinatriceRouter);
app.use("/api", juryRouter);
app.use("/api", tuteurRouter);
app.use("/api", maitreApprentissageRouter);
app.use("/api", promotionRouter);
app.use("/api", entrepriseRouter);
app.use("/api", ecoleRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});