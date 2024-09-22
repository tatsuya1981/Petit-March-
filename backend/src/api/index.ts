import express from "express";
import userRoutes from "./users/user.routes";
import reviewRoutes from "./reviews/review.routes";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/reviews", reviewRoutes);

export default router;
