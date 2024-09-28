import express from "express";
import authRoutes from "./auth/auth.routes";
import userRoutes from "./users/user.routes";
import reviewRoutes from "./reviews/review.routes";
import productRoutes from "./products/product.routes";
import { errorHandler } from "../middleware/errorHandler";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/reviews", reviewRoutes);
router.use("/products", productRoutes);

router.use(errorHandler);

export default router;
