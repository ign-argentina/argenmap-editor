import { Router } from "express";
import ConfigController from "../controllers/ConfigController.js";

const configRoutes = Router();
const configController = new ConfigController();

configRoutes.post("/", configController.newConfig);
configRoutes.put("/:id", configController.updateConfig);
configRoutes.get("/", configController.getAllConfigs);

export default configRoutes;