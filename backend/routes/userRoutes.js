/* import  {Router} from "express"
import UserController from "../controllers/UserController.js"


const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/", UserController.newUser) // 2.1.3
userRoutes.post("/update", UserController.updateUser) // 2.4.1
userRoutes.post("/recovery", UserController.recoveryPassword) // 2.5.2
userRoutes.post("/recovery/auth", UserController.recovAuth) // 2.5.6

export default userRoutes; */