import express from "express";
import { addUserByAdmin , addStoreByAdmin, getAdminDashboard ,getAllUsersByAdmin, getAllStoresByAdmin} from "../controllers/admin.controller.js";

const routers = express.Router();

routers.post("/users", addUserByAdmin);
routers.get("/users", getAllUsersByAdmin);
routers.post("/stores", addStoreByAdmin);
routers.get("/stores", getAllStoresByAdmin);
routers.get("/dashboard", getAdminDashboard);

export default routers;
