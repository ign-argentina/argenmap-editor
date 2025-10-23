import AuthService from "../services/AuthService.js"

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME
const MIN_PASSWORD_LENGTH = 10
const isProduction = process.env.VITE_MODE === 'prod';

/**
 * Controlador para manejar la autenticación de usuarios.
 * Contiene métodos para login, registro, logout y validación de sesión.
 */
class AuthController {
  constructor() {
    this.authService = new AuthService()
  }

  /**
 * Inicia sesión con email y contraseña.
 * Si las credenciales son correctas, devuelve el usuario y guarda una cookie de autenticación.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @returns {Object} Usuario autenticado o error.
 */
  login = async (req, res) => {
    try {
      const { email, password } = req.body

      const result = await this.authService.login(email, password)

      if (!result.success) {
        return res.status(400).json(result.error)
      }

      this.#sendAuthCookie(res, result.data.token)

      return res.status(200).json(result.data.user)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error })
    }
  }

  /**
 * Registra un nuevo usuario.
 * Verifica que los datos estén completos, que el mail no esté duplicado, que la contraseña cumpla con la longitud de carácteres mínimos,
 * y que el registro público esté habilitado.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @returns {Object} Usuario registrado o error.
 */
  register = async (req, res) => {
    try {
      const { email, name, lastname, password } = req.body

  
      if (process.env.ALLOW_PUBLIC_REGISTER === '0') {
        return res.status(400).json("El registro publico ha sido dehabilitado por la administracion")
      }

      if (!password || !name || !lastname || !email) { // A CHEQUEAR SI JS LE HACE UN .length A UNA CADENA STRING
        return res.status(400).json("Se deben completar todos los campos para crear un nuevo usuario.")
      }

      if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).json(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`)
      }
      
      if ((await this.authService.isMailDuplicated(email)).success === true) {
        return res.status(400).json("El correo ya esta en uso")
      }

      const result = await this.authService.register(email, name, lastname, password)

      if (!result.success) {
        throw new Error(result.error)
      }

      this.#sendAuthCookie(res, result.data.token)

      return res.status(201).json(result.data.user)

    } catch (error) {
      console.log(error)
      return res.status(500).json({ error });
    }
  }

  /**
 * Cierra la sesión del usuario.
 * Elimina la cookie de autenticación.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @returns {Object} Confirmación de logout.
 */
  logout = async (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      /*       sameSite: isProduction ? "Strict" : "Lax" // Más permisivo en local/UAT */
      sameSite: "Strict" // Más permisivo en local/UAT
    });
    return res.status(200).json()
  }

  /**
 * Verifica si el usuario está autenticado.
 * Valida el token guardado en las cookies.
 *
 * @param {Object} req - Objeto de la solicitud HTTP.
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @returns {Object} Resultado de la validación.
 */
  checkAuth = async (req, res) => {
    try {
      const token = req.cookies[AUTH_COOKIE_NAME]

      if (!token) {
        return res.status(401).json({ isAuth: false })
      }

      const result = await this.authService.checkAuth(token)
      return res.status(200).json(result.data)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error })
    }
  }

  /**
 * Método privado para enviar la cookie de autenticación.
 * Inyecta una cookie https estricta en el objeto res.
 * 
 * @param {Object} res - Objeto de la respuesta HTTP.
 * @param {string} token - Token JWT a guardar en la cookie.
 */
  #sendAuthCookie(res, token) {
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      /*       sameSite: isProduction ? "Strict" : "Lax" // Más permisivo en local/UAT */
      sameSite: "Strict" // Más permisivo en local/UAT
    });
  }

}

export default AuthController;