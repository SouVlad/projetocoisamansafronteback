import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import { startJobs } from "./jobs/UserReminder.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());

// Servir arquivos estáticos da pasta uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Website aberto com sucesso");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server a funcionar em http://localhost:${PORT}`));

if (typeof startJobs === "function") {
  startJobs().catch((err) => console.error("Erro ao iniciar UserReminder:", err));
}
