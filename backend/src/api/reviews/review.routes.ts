import express from "express";
import { createReview } from "./review.controller";

const router = express.Router();

router.post("/", createReview);

export default router;
