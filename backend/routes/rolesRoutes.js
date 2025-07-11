import { Router } from "express";
import Rol from "../models/Rol.js";

const rolesRoutes = Router();

rolesRoutes.get("/", async (req, res) => {
  try {
    res.json(Rol.getRoles());
  } catch (error) {
    console.error("Error cargando roles:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default rolesRoutes