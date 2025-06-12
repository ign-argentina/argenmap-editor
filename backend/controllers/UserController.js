import UserService from "../services/UserService.js"
import AuthService from "../services/AuthService.js"

/**
 * Controlador para manejar acciones relacionadas con usuarios.
 * Se encarga de listar usuarios, actualizar datos y otras funciones.
 */
class UserController {
  constructor() {
    this.userService = new UserService()
    this.authService = new AuthService()
  }

  /**
   * Obtiene la lista de todos los usuarios.
   * @param {object} req - Datos de la petición HTTP.
   * @param {object} res - Respuesta HTTP que se enviará.
   */
  getUserList = async (req, res) => {
    try {
      const result = await this.userService.getUserList()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ error })
    }
  }

  /**
   * Actualiza los datos del usuario que está logueado.
   * Verifica que el usuario esté autenticado, valida la contraseña si se envía, 
   * y realiza la actualización.
   * @param {object} req - Datos de la petición con nombre, apellido y contraseña opcional.
   * @param {object} res - Respuesta HTTP con resultado o error.
   */
  updateUser = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { name, lastname, password } = req.body

      if (!token || !(await this.authService.checkAuth(token)).success) {
        return res.status(401).json("Permisos denegados")
      }

      if (password && password.length < 10) {
        return res.status(400).json("La contraseña debe tener al menos 10 caracteres")
      }
      const result = await this.userService.updateUser(name, lastname, password, this.authService.getDataToken(token).uid)
      return res.status(200).json(result.data)

    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  /**
 * Método para recuperar la contraseña.
 * (Pendiente de implementación)
 * @param {object} req - Datos de la petición.
 * @param {object} res - Respuesta HTTP.
 */
  recoveryPassword = (req, res) => {
    /**** TO DO ****/
  }

}


export default UserController