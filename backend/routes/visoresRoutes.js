import { Router } from "express";
import VisorController from "../controllers/VisorController.js";
import * as PROTECT from "../middlewares/routeGuards.js"

const visoresRoutes = Router();
const visorController = new VisorController();

// placesRoutes.get("/:id", placesController.getPlaceById); // Ideal por parámetro y no por query al ser búsqueda simple.

visoresRoutes.get("/publics", visorController.getPublicVisors);
visoresRoutes.get("/myvisors", PROTECT.REQUIRE_AUTH, visorController.getMyVisors);
visoresRoutes.get("/group/:groupid", PROTECT.REQUIRE_AUTH, visorController.getGroupVisors);
visoresRoutes.post("/publish", PROTECT.REQUIRE_GROUP_ADMIN, visorController.changePublicStatus)

visoresRoutes.post("/", PROTECT.REQUIRE_AUTH, visorController.createVisor);
visoresRoutes.put("/", PROTECT.REQUIRE_AUTH, visorController.updateVisor)
visoresRoutes.delete("/", PROTECT.REQUIRE_AUTH, visorController.deleteVisor);

visoresRoutes.get("/", visorController.getAllVisors); // Deprecado?
visoresRoutes.get("/:id", visorController.getVisorById);
visoresRoutes.post("/share", PROTECT.REQUIRE_AUTH, visorController.createShareLink);


export default visoresRoutes;