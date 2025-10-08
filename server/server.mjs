import express from "express";
import cors from "cors";
import loginRouter from "./api/login.route.mjs";

const app = express();

// Middleware
app.use(express.json());

// En dev, autorise le front Vite
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Routes API
app.use("/api", loginRouter);

// Démarrage
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API démarrée sur http://localhost:${PORT}`);
});