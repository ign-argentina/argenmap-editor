import AuthMiddleware from "./AuthMiddleware.js";

const authMiddleware = new AuthMiddleware();

/**
 * Array de metodos del middleware de autenticacion. Requiere que el usuario esté autenticado.
 * Útil para proteger rutas accesibles solo por usuarios logueados.
 * @type {Array<Function>}
 */
export const REQUIRE_AUTH = [authMiddleware.isAuth];

/**
 * Array de metodos del middleware de autenticacion. Requiere que el usuario esté autenticado y sea Super Admin o Admin de grupo.
 * Ideal para acciones administrativas dentro de grupos.
 * @type {Array<Function>}
 */
export const REQUIRE_GROUP_ADMIN = [authMiddleware.isAuth, authMiddleware.isSuperAdminOrGroupAdmin];

/**
 * Array de metodos del middleware de autenticacion. Requiere que el usuario esté autenticado y sea Super Admin.
 * Usado para rutas totalmente restringidas a administradores del sistema.
 * @type {Array<Function>}
 */
export const REQUIRE_SUPER_ADMIN = [authMiddleware.isAuth, authMiddleware.isSuperAdmin];