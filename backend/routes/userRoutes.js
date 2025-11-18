import  {Router} from "express"
import UserController from "../controllers/UserController.js"
import * as PROTECT from "../middlewares/routeGuards.js"

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/update", PROTECT.REQUIRE_AUTH, userController.updateUser)
userRoutes.get("/", PROTECT.REQUIRE_GROUP_ADMIN, userController.getUserList)



export default userRoutes;