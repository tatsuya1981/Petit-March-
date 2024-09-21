import express from "express";
import { createReview } from "../controllers/reviewController";

const router = express.Router();

router.post("/", createReview);

export default router;
