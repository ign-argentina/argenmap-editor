import { Router } from "express";
import GroupController from "../controllers/GroupController.js";
import * as PROTECT from "../middlewares/routeGuards.js"

const groupRoutes = Router();
const groupController = new GroupController();

groupRoutes.post("/", [PROTECT.REQUIRE_SUPER_ADMIN], groupController.createGroup);
groupRoutes.put("/:id", PROTECT.REQUIRE_GROUP_ADMIN, groupController.updateGroup);
groupRoutes.delete("/:id", PROTECT.REQUIRE_GROUP_ADMIN, groupController.deleteGroup);
groupRoutes.get("/", PROTECT.REQUIRE_AUTH, groupController.getGroupList) // Devuelve el listado de id's grupos al cual uno pertenece. Si sos superadmin, todos. Si no, tus grupos
groupRoutes.get("/management", PROTECT.REQUIRE_GROUP_ADMIN, groupController.getManageGroupList) // Si sos superadmin, devuelve todos los grupos. Si no, tus grupos
groupRoutes.get("/management/:id", PROTECT.REQUIRE_GROUP_ADMIN, groupController.getGroup) // Devuelve informacion del grupo si sos admin del grupo o superadmin
groupRoutes.get("/management/userlist/:id", PROTECT.REQUIRE_GROUP_ADMIN, groupController.getGroupUserList)


export default groupRoutes;