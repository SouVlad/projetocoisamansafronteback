import express from "express";
import {
  listPublicArticles,
  listAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  togglePublish,
} from "../controllers/newsController.js";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rotas públicas - qualquer pessoa pode ver artigos publicados
router.get("/public", listPublicArticles);
router.get("/:id", getArticle);

// Rotas protegidas - apenas admin/owner
router.get("/", requireAuth, requireAdmin, listAllArticles);
router.post("/", requireAuth, requireAdmin, createArticle);
router.put("/:id", requireAuth, requireAdmin, updateArticle);
router.patch("/:id/toggle-publish", requireAuth, requireAdmin, togglePublish);
router.delete("/:id", requireAuth, requireAdmin, deleteArticle);

export default router;
