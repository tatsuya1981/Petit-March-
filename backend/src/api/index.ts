import express from "express";
import reviewRoutes from "./reviews/review.routes";

const router = express.Router();

router.use("/reviews", reviewRoutes);

export default router;
