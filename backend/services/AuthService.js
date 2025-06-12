import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import Result from "../utils/Result.js";

/**
 * Servicio encargado de manejar la lógica de autenticación de usuarios.
 * Se encarga del login, registro, verificación de roles y manejo de tokens.
 */
class AuthService {

  /**
 * Inicia sesión verificando credenciales y estado del usuario.
 *
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Object} Resultado del intento de login.
 */
  login = async (email, password) => {
    try {
      let loginSuccess = false;
      let data = null;

      const [userData] = await User.findByEmail(email)

      const isActive = (userData?.active ?? false)

      if (isActive) {
        if (await User.validatePassword(password, userData.password)) {
          loginSuccess = true;
          const { password, ...user } = userData
          const token = await this.#signToken(user.id)
          data = { user, token }
        }
      }

      return loginSuccess ? Result.success(data) : Result.fail(!isActive ? "La cuenta está inhabilitada" : "El usuario o contraseña son incorrectos")
    } catch (error) {
      console.log("Error en la capa de servicio", error)
    }
  }

  /**
   * Registra un nuevo usuario con los datos proporcionados.
   *
   * @param {string} email - Email del nuevo usuario.
   * @param {string} name - Nombre del nuevo usuario.
   * @param {string} lastname - Apellido del nuevo usuario.
   * @param {string} password - Contraseña elegida.
   * @returns {Object} Resultado del registro.
   */
  register = async (email, name, lastname, password) => {
    try {

      const [userData] = await User.newUser(email, name, lastname, password); // Debería devolver id, email, nombre y apellido.
      const { id, ...user } = userData // Desestructuramos id y el resto

      const token = await this.#signToken(id)

      const data = { user, token }

      return user ? Result.success(data) : Result.fail("No se ha podido crear el usuario")
    } catch (error) {
      console.log("Error en la capa de servicio", error)
    }
  }

  /**
 * Genera un token JWT con los roles del usuario.
 * (Método privado)
 *
 * @param {number} userId - ID del usuario.
 * @returns {string} Token JWT firmado.
  */
  #signToken = async (userId) => {
    const isAdmin = await User.isSuperAdmin(userId)
    const isGroupAdmin = await User.isGroupAdmin(userId)
    return jwt.sign({ uid: userId, isa: isAdmin, isag: isGroupAdmin }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_EXPIRES) })
  }

  /**
 * Obtiene los datos contenidos en un token JWT.
 *
 * @param {string} token - Token JWT.
 * @returns {Object} Datos del token.
 */
  getDataToken(token) {
    return this.#decodeToken(token)
  }

  /**
 * Decodifica un token JWT para obtener los datos.
 * (Método privado)
 *
 * @param {string} token - Token JWT.
 * @returns {Object} Datos decodificados.
 */
  #decodeToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
  }

  /**
 * Verifica si un email ya está en uso.
 *
 * @param {string} email - email a verificar.
 * @returns {Object} Resultado de la validación.
 */
  isMailDuplicated = async (email) => {
    try {
      const data = await User.isMailDuplicated(email)
      return data ? Result.success() : Result.fail()
    } catch (error) {
      console.log("Error en la capa de servicio", error)
    }
  }

  /**
 * Verifica si un token es válido y devuelve info de autenticación.
 *
 * @param {string} token - Token JWT.
 * @returns {Object} Resultado de la verificación.
 */
  checkAuth = async (token) => {
    try {
      const isAuth = this.#decodeToken(token)
      return Result.success({ isa: isAuth.isa, isag: isAuth.isag })
    } catch (error) {
      return Result.fail("Debes iniciar sesion")
    }
  }

  /**
   * Verifica si el usuario autenticado es Super Admin.
   *
   * @param {string} token - Token JWT.
   * @returns {Object} Resultado con permisos o error.
   */
  isSuperAdmin = async (token) => {
    try {
      let isSuperAdmin = false;
      const isAuth = await this.checkAuth(token)
      if (isAuth.success) {
        const { uid } = this.#decodeToken(token)
        isSuperAdmin = await User.isSuperAdmin(uid)
      }
      return isSuperAdmin ? Result.success(isSuperAdmin) : Result.fail("Acceso restringido")
    } catch (error) {
      console.log("Error en servicio: " + error)
    }
  }

  /**
 * Verifica si el usuario es Super Admin o Admin de Grupo.
 *
 * @param {string} token - Token JWT.
 * @returns {Object} Resultado con permisos o error.
 */
  isSuperAdminOrGroupAdmin = async (token) => {
    try {
      const isAuth = await this.checkAuth(token)
      let haveAccess = false;
      if (isAuth.success) {
        const { uid } = this.#decodeToken(token)
        const isSuperAdmin = await User.isSuperAdmin(uid)
        const isGroupAdmin = await User.isGroupAdmin(uid)
        haveAccess = (isSuperAdmin || isGroupAdmin)
      }
      return haveAccess ? Result.success(haveAccess) : Result.fail("Acceso restringido")
    } catch (error) {
      console.log("Error en servicio: " + error)
    }
  }
}

export default AuthService