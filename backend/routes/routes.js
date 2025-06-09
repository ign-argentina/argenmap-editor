import { Router } from "express";
import visoresRoutes from "./visoresRoutes.js";
import configRoutes from "./configRoutes.js";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import groupRoutes from "./groupRoutes.js";
import rolesRoutes from "./rolesRoutes.js";

const routes = Router();

/**
 * Rutas principales de la API.
 * 
 * Rutea los endpoints específicos para cada recurso:
 * - /visores  => rutas relacionadas con visores
 * - /configs  => rutas de configuración
 * - /users    => rutas para manejo de usuarios
 * - /auth     => rutas de autenticación
 * - /groups   => rutas de grupos
 * - /roles    => rutas de roles
 */

routes.use("/visores", visoresRoutes);
routes.use("/configs", configRoutes);
routes.use("/users", userRoutes)
routes.use("/auth", authRoutes)
routes.use("/groups", groupRoutes)
routes.use("/roles", rolesRoutes);

export default routes;