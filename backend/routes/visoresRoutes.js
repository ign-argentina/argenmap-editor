import { Router } from "express";
import VisorController from "../controllers/VisorController.js";
import * as PROTECT from "../middlewares/routeGuards.js"

const visoresRoutes = Router();
const visorController = new VisorController();

// placesRoutes.get("/:id", placesController.getPlaceById); // Ideal por parámetro y no por query al ser búsqueda simple.

visoresRoutes.get("/publics", visorController.getPublicVisors);
visoresRoutes.get("/myvisors", visorController.getMyVisors);
visoresRoutes.get("/group/:groupid", visorController.getGroupVisors);

visoresRoutes.post("/", PROTECT.REQUIRE_AUTH, visorController.createVisor);
visoresRoutes.put("/", PROTECT.REQUIRE_AUTH, visorController.updateVisor)
visoresRoutes.get("/", visorController.getAllVisors);
visoresRoutes.get("/:id", visorController.getVisorById);



export default visoresRoutes;