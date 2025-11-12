import Group from "../models/Group.js"
import User from "../models/User.js"
import Result from "../utils/Result.js";

/**
 * Servicio encargado de manejar la lógica relacionada con los grupos y sus usuarios.
 * Incluye creación, edición, eliminación de grupos y gestión de miembros.
 */
class GroupService {
  /**
 * Elimina un grupo si el usuario tiene permisos (es admin del grupo o super admin).
 *
 * @param {number} gid - ID del grupo a eliminar.
 * @param {number} uid - ID del usuario que hace la solicitud.
 * @returns {Object} Resultado de la operación.
 */
  deleteGroup = async (gid, uid) => {
    try {
      let result = []
      if (await Group.isAdminForThisGroup(gid, uid) || await User.isSuperAdmin(uid)) {
        result = await Group.deleteGroup(gid)
      }
      return result.length > 0 ? Result.success(result) : Result.fail("No se ha podido eliminar al usuario")
    } catch (error) {
      console.log("Error en la capa de servicio " + error)
    }
  }

  /**
 * Actualiza los datos de un grupo si el usuario es admin del mismo o super admin.
 *
 * @param {string} name - Nuevo nombre del grupo.
 * @param {string} description - Descripción del grupo.
 * @param {string} img - Imagen del grupo.
 * @param {number} gid - ID del grupo.
 * @param {number} uid - ID del usuario que realiza la acción.
 * @returns {Object} Resultado de la operación.
 */
  updateGroup = async (name, description, img, gid, uid) => {
    try {
      let result = []

      if (await Group.isAdminForThisGroup(gid, uid) || await User.isSuperAdmin(uid)) {
        result = await Group.updateGroup(name, description, img, gid)
      }

      return result.length > 0 ? Result.success(result) : Result.fail("No se ha podido eliminar al usuario")
    } catch (error) {
      console.log("Error en la capa de servicio " + error)
    }
  }

  /**
 * Obtiene la lista de grupos visibles para un usuario.
 *
 * @param {number} userId - ID del usuario.
 * @param {boolean} isGroupAdmin - Indica si el usuario es admin de algún grupo.
 * @returns {Array} Lista de grupos.
 */
  getGroupList = async (userId, isGroupAdmin) => {
    try {
      let rolId = null;
      let data = []
/*       const isSuperAdmin = await User.isSuperAdmin(userId)
      if (isSuperAdmin) {
        data = await this.#getAllGroups(userId)
      } else { */
        rolId = isGroupAdmin ? 2 : rolId // Mejorar. No hardcode (o si?)
        data = await Group.getGroupList(userId, rolId) // Búsqueda normal, te devuelve los grupos donde perteneces.
   /*    } */
      return data
    } catch (error) {
      console.log("Error en capa de servicio: " + error)
    }
  }

  /**
 * Devuelve la información de un grupo, validando permisos del usuario.
 *
 * @param {number} id - ID del grupo.
 * @param {number} uid - ID del usuario.
 * @param {boolean} isSuperAdmin - Si el usuario es super admin.
 * @returns {Object} Datos del grupo.
 */
  getGroup = async (id, uid, isSuperAdmin) => {
    try {
      let grupo = []
      if (isSuperAdmin) {
        [grupo] = await Group.getGroup(id)
      } else {
        [grupo] = await Group.getGroup(id, uid)
      }
      return grupo
    } catch (error) {
      console.log("Error en la capa de servicio " + error)
    }
  }

  /**
 * Método privado. Devuelve todos los grupos sin filtro.
 *
 * @returns {Array} Lista completa de grupos.
 */
  #getAllGroups = async () => {
    try {
      return await Group.getAllGroups()
    } catch (error) {
      console.log("Error en capa de servicio: " + error)
    }
  }

  /**
 * Devuelve la lista de usuarios de un grupo si el usuario tiene permisos.
 *
 * @param {number} id - ID del grupo.
 * @param {number} uid - ID del usuario.
 * @param {boolean} isSuperAdmin - Si el usuario es super admin.
 * @returns {Object} Resultado con la lista de usuarios.
 */
  getGroupUserList = async (id, uid, isSuperAdmin) => {
    try {
      let result = []
      if (isSuperAdmin) {
        const isAdmin = await User.isSuperAdmin(uid)
        result = isAdmin ? await Group.getGroupUserList(id) : result
      } else if (await Group.isAdminForThisGroup(id, uid)) {
        result = await Group.getGroupUserList(id)
      }
      return result.length > 0 ? Result.success(result) : Result.fail("El grupo no tiene usuarios o no existe: " + id)
    } catch (error) {
      console.log("Error en la capa de servicio: " + error)
    }
  }

  /**
 * Agrega un usuario a un grupo si el solicitante tiene permisos.
 *
 * @param {number} addUserId - ID del usuario a agregar.
 * @param {number} uid - ID del usuario que realiza la acción.
 * @param {number} gid - ID del grupo.
 * @returns {Object} Resultado de la operación.
 */
  addUserToGroup = async (addUserId, uid, gid) => {
    try {
      let result = []
      const [userAlreadyExists] = await Group.userExists(gid, addUserId)

      if (!userAlreadyExists.exists) {
        if (await Group.isAdminForThisGroup(gid, uid)) {
          console.log("pepe")

          console.log(addUserId + " aa " + gid)
          result = await Group.addUserToGroup(gid, addUserId)
        } else if (await User.isSuperAdmin(uid)) {
          result = await Group.addUserToGroup(gid, addUserId)
        }
      }

      return result.length > 0 ? Result.success(result) : Result.fail("Nos se ha podido agregar el usuario al grupo " + gid)
    } catch (error) {
      return Result.fail("Nos se ha podido agregar el usuario al grupo " + gid)
    }
  }

  /**
 * Elimina un usuario de un grupo si el solicitante es admin del grupo o super admin.
 *
 * @param {number} deleteUserId - ID del usuario a eliminar.
 * @param {number} uid - ID del usuario que realiza la acción.
 * @param {number} gid - ID del grupo.
 * @returns {Object} Resultado de la operación.
 */
  deleteUserFromGroup = async (deleteUserId, uid, gid) => {
    try {
      let result = []
      if (await Group.isAdminForThisGroup(gid, uid)) {
        result = await Group.deleteUserFromGroup(gid, deleteUserId)
      } else if (await User.isSuperAdmin(uid)) {
        result = await Group.deleteUserFromGroup(gid, deleteUserId)
      }
      return result.length > 0 ? Result.success(result) : Result.fail("No se ha podido eliminar al usuario")
    } catch (error) {
      console.log("Error en la capa de servicio " + error)
    }
  }

  /**
 * Actualiza el rol de un usuario dentro de un grupo. Validando a su vez si el solicitante tiene permisos para hacerlo
 *
 * @param {number} uid - ID del usuario que realiza la acción.
 * @param {number} userId - ID del usuario a modificar.
 * @param {number} rolId - Nuevo rol a asignar.
 * @param {number} gid - ID del grupo.
 * @returns {Object} Resultado de la operación.
 */
  updateUserRolFromGroup = async (uid, userId, rolId, gid) => {
    try {
      let result = []
      if (await Group.isAdminForThisGroup(gid, uid)) {
        result = await Group.updateUserRolFromGroup(userId, rolId, gid)
      } else if (await User.isSuperAdmin(uid)) {
        result = await Group.updateUserRolFromGroup(userId, rolId, gid)
      }

      return result.length > 0 ? Result.success(result) : Result.fail("No se ha podido eliminar al usuario")
    } catch (error) {
      console.log("Error en la capa de servicio " + error)
    }
  }

  getPermissions = async (uid, groupId) => {
    try {
      let isGroupAdmin = false;
      let isEditor = false;
      const isSuperAdmin = await User.isSuperAdmin(uid)

      if (!isSuperAdmin) {
        isGroupAdmin = await Group.isAdminForThisGroup(groupId, uid)
        isEditor = await Group.isEditorForThisGroup(groupId, uid)
      }
      return Result.success({ sa: isSuperAdmin, ga: isGroupAdmin, editor: isEditor })
    } catch (error) {
      console.log("GROUPS: Error en la capa de servicio ", error)
    }
  }
}

export default GroupService