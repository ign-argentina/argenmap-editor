import  {Router} from "express"
import UserController from "../controllers/UserController.js"


const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/update", userController.updateUser) // 2.4.1


export default userRoutes;