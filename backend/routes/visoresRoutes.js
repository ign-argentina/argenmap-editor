import { Router } from "express";
import VisorController from "../controllers/VisorController.js";

const visoresRoutes = Router();
const visorController = new VisorController();

// placesRoutes.get("/:id", placesController.getPlaceById); // Ideal por parámetro y no por query al ser búsqueda simple.

visoresRoutes.post("/", visorController.newVisor);


export default visoresRoutes;