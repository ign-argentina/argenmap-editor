import AuthMiddleware from "./AuthMiddleware.js";

const authMiddleware = new AuthMiddleware();

export const REQUIRE_AUTH = [authMiddleware.isAuth];
export const REQUIRE_GROUP_ADMIN = [authMiddleware.isAuth, authMiddleware.isSuperAdminOrGroupAdmin];
export const REQUIRE_SUPER_ADMIN = [authMiddleware.isAuth, authMiddleware.isSuperAdmin];