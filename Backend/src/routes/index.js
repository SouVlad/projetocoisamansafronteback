import express from "express";
import authRoutes from "./auth.js";
import usersRoutes from "./usersRouter.js";
import eventsRoutes from "./events.routes.js";
import merchandiseRoutes from "./merchandiseRoutes.js";
import cartRoutes from "./cartRoutes.js";
import galleryRoutes from "./gallery.routes.js";
import newsRoutes from "./news.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/events", eventsRoutes);
router.use("/merchandise", merchandiseRoutes);
router.use("/cart", cartRoutes);
router.use("/gallery", galleryRoutes);
router.use("/news", newsRoutes);

export default router;
