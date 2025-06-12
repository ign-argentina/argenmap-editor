import User from "../models/User.js"
import Result from "../utils/Result.js"

/**
 * Servicio que maneja la lógica relacionada con usuarios.
 * Incluye obtener la lista de usuarios y actualizar datos de un usuario.
 */
class UserService {

  /**
 * Obtiene la lista completa de usuarios.
 * @returns {Array|Error} Lista de usuarios o un error si algo falla.
 */
  getUserList = async () => {
    try {
      const data = await User.getUserList()
      return data
    } catch (error) {
      return error
    }
  }

  /**
   * Actualiza los datos de un usuario específico.
   * @param {string} name - Nuevo nombre del usuario.
   * @param {string} lastname - Nuevo apellido del usuario.
   * @param {string} password - Nueva contraseña (opcional).
   * @param {number} id - ID del usuario a actualizar.
   * @returns {Object} Resultado del proceso, con éxito o fallo.
   */
  updateUser = async (name, lastname, password, id) => {
    try {
      const [data] = await User.updateUser(name, lastname, password, id)
      return data ? Result.success(data) : Result.fail()
    } catch (error) {
      return error
    }
  }
  
}

export default UserService