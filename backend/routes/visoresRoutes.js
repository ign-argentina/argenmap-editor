import { Router } from "express";
import VisorController from "../controllers/VisorController.js";
import * as PROTECT from "../middlewares/routeGuards.js"
const visoresRoutes = Router();
const visorController = new VisorController();

// placesRoutes.get("/:id", placesController.getPlaceById); // Ideal por parámetro y no por query al ser búsqueda simple.

visoresRoutes.post("/", PROTECT.REQUIRE_GROUP_ADMIN, visorController.createVisor);
visoresRoutes.put("/updateVisor", visorController.updateVisor)
visoresRoutes.get("/", visorController.getAllVisors);
visoresRoutes.get("/:id", visorController.getVisorById);

export default visoresRoutes;