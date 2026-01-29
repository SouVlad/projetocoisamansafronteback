import express from "express";
import {
  listGalleryImages,
  getGalleryImage,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getGalleryCategories,
} from "../controllers/galleryController.js";
import { requireAuth, requireAdmin } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Rotas públicas - qualquer pessoa pode ver
router.get("/", listGalleryImages);
router.get("/categories", getGalleryCategories); // Nova rota
router.get("/:id", getGalleryImage);

// Rotas protegidas - apenas admin
router.post("/", requireAuth, requireAdmin, upload.single("image"), uploadGalleryImage);
router.put("/:id", requireAuth, requireAdmin, updateGalleryImage);
router.delete("/:id", requireAuth, requireAdmin, deleteGalleryImage);

export default router;
