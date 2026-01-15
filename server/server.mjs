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
import livrableRouter from "./api/livrable.route.mjs";
import promotionRouter from "./api/promotion.route.mjs";
import apprentiRouter from "./api/apprenti.route.mjs";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Servir les fichiers uploadés en tant que fichiers statiques
app.use("/uploads", express.static("uploads"));

// 3) Monte les routes
app.use("/api", loginRouter);
app.use("/api", changePasswordRouter);
app.use("/api", compteRouter);
app.use("/api", evenementRouter);
app.use("/api", livrableRouter);
app.use("/api", promotionRouter);
app.use("/api", apprentiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});