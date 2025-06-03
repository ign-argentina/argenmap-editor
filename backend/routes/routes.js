import { Router } from "express";
import visoresRoutes from "./visoresRoutes.js";
import configRoutes from "./configRoutes.js";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import groupRoutes from "./groupRoutes.js";
import rolesRoutes from "./rolesRoutes.js";

const routes = Router();

routes.use("/visores", visoresRoutes);
routes.use("/configs", configRoutes);
routes.use("/users", userRoutes)
routes.use("/auth", authRoutes)
routes.use("/groups", groupRoutes)
routes.use("/roles", rolesRoutes);

export default routes;