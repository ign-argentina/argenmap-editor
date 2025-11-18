import  {Router} from "express"
import AdminController from "../controllers/AdminController.js"
import * as PROTECT from "../middlewares/routeGuards.js"

const adminRoutes = Router();
const adminController = new AdminController();

/* dominio.com/admin */
adminRoutes.get("/user", PROTECT.REQUIRE_SUPER_ADMIN, adminController.searchUser)
adminRoutes.get("/users", PROTECT.REQUIRE_SUPER_ADMIN, adminController.getAllUsers)
adminRoutes.post("/user", PROTECT.REQUIRE_SUPER_ADMIN, adminController.changeUserStatus)
adminRoutes.post("/users", PROTECT.REQUIRE_SUPER_ADMIN, adminController.createUser)
adminRoutes.post("/user/resetpassword", PROTECT.REQUIRE_SUPER_ADMIN, adminController.resetUserPassword)

adminRoutes.post("/groups", PROTECT.REQUIRE_SUPER_ADMIN, adminController.createGroup);
adminRoutes.get("/group", PROTECT.REQUIRE_SUPER_ADMIN, adminController.searchGroup)
adminRoutes.get("/groups", PROTECT.REQUIRE_SUPER_ADMIN, adminController.getAllGroups)
adminRoutes.post("/group", PROTECT.REQUIRE_SUPER_ADMIN, adminController.changeGroupStatus)

adminRoutes.get("/metrics/users", PROTECT.REQUIRE_SUPER_ADMIN, adminController.getUsersMetrics)
adminRoutes.get("/metrics/groups", PROTECT.REQUIRE_SUPER_ADMIN, adminController.getGroupsMetrics)

export default adminRoutes;