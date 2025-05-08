import {Router} from "express"
import AuthController from "../controllers/AuthController.js"

const authRoutes = Router();
const authController = new AuthController();

//authRoutes.post("/register", [validators.checkDuplicateEmail, validators.checkRoles], authController.register)
authRoutes.post("/register", authController.register)
authRoutes.post("/login", authController.login)
authRoutes.post("/validate", authController.getDataToken)


export default authRoutes;