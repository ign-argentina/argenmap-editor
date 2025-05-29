import AuthService from "../services/AuthService.js"

class AuthMiddleware {
  constructor() {
    this.authService = new AuthService();
  }
  isSuperAdmin = async (req, res, next) => {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME]
    const result = await this.authService.isSuperAdmin(token)
    if (!result.success) {
      return res.status(403).json(result.error)
    }
    next();
  }

  isSuperAdminOrGroupAdmin = async (req, res, next) => {
    const token = req.cookies[process.env.AUTH_COOKIE_NAME]
    const result = await this.authService.isSuperAdminOrGroupAdmin(token)
    if (!result.success) {
      return res.status(403).json(result.error)
    }
    next();
  }

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