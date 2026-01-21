import express from "express";
import { submitRating, updateRating } from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/:storeId/ratings", submitRating);
router.put("/:storeId/ratings", updateRating);

export default router;
