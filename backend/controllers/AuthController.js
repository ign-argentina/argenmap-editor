import AuthService from "../services/AuthService.js"

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME
const MIN_PASSWORD_LENGTH = 10

class AuthController {
  constructor() {
    this.authService = new AuthService()
  }

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

  register = async (req, res) => {
    try {
      const { email, name, lastname, password } = req.body

      if (process.env.ALLOW_PUBLIC_REGISTER === '0') {
        return res.status(400).json("El registro publico ha sido dehabilitado por la administracion")
      }

      if (!password || !name || !lastname || !email) { // A CHEQUEAR SI JS LE HACE UN .length A UNA CADENA STRING
        throw new Error("Se deben completar todos los campos para crear un nuevo usuario.")
      }

      if (password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
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

  logout = async (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });
    return res.status(200).json()
  }

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

  #sendAuthCookie(res, token) {
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict"
    });
  }

}

export default AuthController;