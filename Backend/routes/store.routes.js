import express from "express";
import { getAllStores,
        searchStores,
        getStoreOwnerDashboard } from "../controllers/store.controller.js";

const router = express.Router();

router.get("/", getAllStores);
router.get("/search", searchStores);
router.get("/owner/dashboard", getStoreOwnerDashboard);

export default router;
