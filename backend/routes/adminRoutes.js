import  {Router} from "express"
import AdminController from "../controllers/AdminController.js"
import * as PROTECT from "../middlewares/routeGuards.js"

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get("/user", PROTECT.REQUIRE_SUPER_ADMIN, adminController.searchUser)
adminRoutes.get("/users", PROTECT.REQUIRE_SUPER_ADMIN, adminController.getAllUsers)
/* adminRoutes.get("/metrics/user", PROTECT.REQUIRE_SUPER_ADMIN, adminController.getAllUsers) */
adminRoutes.post("/user", PROTECT.REQUIRE_SUPER_ADMIN, adminController.changeUserStatus)
adminRoutes.get("/user/metrics", PROTECT.REQUIRE_SUPER_ADMIN, adminController.getUserMetrics)
adminRoutes.post("/user/resetpassword", PROTECT.REQUIRE_SUPER_ADMIN, adminController.resetUserPassword)

export default adminRoutes;