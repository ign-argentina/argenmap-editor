import AuthService from "../services/AuthService.js"

/**
 * Middleware para verificar permisos y autenticación del usuario.
 * Utiliza AuthService para validar roles y tokens.
 */
class AuthMiddleware {
  constructor() {
    this.authService = new AuthService();
  }

  /**
 * Verifica si el usuario autenticado es Super Admin.
 * Si no lo es, devuelve un error 403.
 * @param {object} req - Objeto de la solicitud.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para continuar con la siguiente middleware.
 */
  isSuperAdmin = async (req, res, next) => {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME]
    const result = await this.authService.isSuperAdmin(token)
    if (!result.success) {
      return res.status(403).json(result.error)
    }
    next();
  }

  /**
 * Verifica si el usuario es Super Admin o Admin de algún grupo.
 * Si no lo es, devuelve un error 403.
 * @param {object} req - Objeto de la solicitud.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para continuar con la siguiente middleware.
 */
  isSuperAdminOrGroupAdmin = async (req, res, next) => {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME]
    const result = await this.authService.isSuperAdminOrGroupAdmin(token)
    if (!result.success) {
      return res.status(403).json(result.error)
    }
    next();
  }

  /**
 * Verifica si el usuario está autenticado.
 * Si no lo está, devuelve un error 403.
 * @param {object} req - Objeto de la solicitud.
 * @param {object} res - Objeto de la respuesta.
 * @param {function} next - Función para continuar con la siguiente middleware.
 */
  isAuth = async (req, res, next) => {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME]
    const result = await this.authService.checkAuth(token)

    if (!result.success) {
      return res.status(403).json(result.error)
    }
    next();
  }
}


export default AuthMiddleware