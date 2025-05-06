import { Router } from "express";
import visoresRoutes from "./visoresRoutes.js";
import configRoutes from "./configRoutes.js";

const routes = Router();

routes.use("/visores", visoresRoutes);
routes.use("/configs", configRoutes);


export default routes;