import { Router } from "express";
import visoresRoutes from "./visoresRoutes.js";
import configRoutes from "./configRoutes.js";
/* import userRoutes from "./userRoutes.js"; */
import authRoutes from "./authRoutes.js";

const routes = Router();

routes.use("/visores", visoresRoutes);
routes.use("/configs", configRoutes);
/* routes.use("/users", userRoutes) */
routes.use("/auth", authRoutes)

export default routes;