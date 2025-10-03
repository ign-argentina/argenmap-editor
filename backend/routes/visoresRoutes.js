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

visoresRoutes.get("/", visorController.getAllVisors);
visoresRoutes.post("/share", visorController.createShareLink);
visoresRoutes.get("/share", visorController.getConfigByShareToken);
visoresRoutes.get("/:id", visorController.getVisorById);
visoresRoutes.post("/share/status", PROTECT.REQUIRE_AUTH, visorController.changeIsSharedStatus)
visoresRoutes.put("/group/restoreviewer", [PROTECT.REQUIRE_AUTH, PROTECT.REQUIRE_GROUP_ADMIN], visorController.restoreViewer)
visoresRoutes.get("/group/deleted/:viewerid", [PROTECT.REQUIRE_AUTH, PROTECT.REQUIRE_GROUP_ADMIN], visorController.getDeletedViewers)


export default visoresRoutes;