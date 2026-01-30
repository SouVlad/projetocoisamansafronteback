import { Router } from "express";
import * as albumController from "../controllers/albumController.js";
import { optionalAuth, requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Rotas públicas/com autenticação opcional
router.get("/", optionalAuth, albumController.listAlbums);
router.get("/:id", optionalAuth, albumController.getAlbum);

// Rotas protegidas (apenas admin/owner)
router.post("/", requireAuth, requireAdmin, albumController.createAlbum);
router.put("/:id", requireAuth, requireAdmin, albumController.updateAlbum);
router.delete("/:id", requireAuth, requireAdmin, albumController.deleteAlbum);

export default router;
