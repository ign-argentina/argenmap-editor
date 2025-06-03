import Group from "../models/Group.js"
import User from "../models/User.js"
import Result from "../utils/Result.js";
class GroupService {

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
  getGroupList = async (userId, isGroupAdmin) => {
    try {
      let rolId = null;
      let data = []
      const isSuperAdmin = await User.isSuperAdmin(userId)
      if (isSuperAdmin) {
        data = await this.#getAllGroups(userId)
      } else {
        rolId = isGroupAdmin ? 2 : rolId // Mejorar. No hardcode (o si?)
        data = await Group.getGroupList(userId, rolId) // Búsqueda normal, te devuelve los grupos donde perteneces.
      }
      return data
    } catch (error) {
      console.log("Error en capa de servicio: " + error)
    }
  }

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

  #getAllGroups = async () => {
    try {
      return await Group.getAllGroups()
    } catch (error) {
      console.log("Error en capa de servicio: " + error)
    }
  }

  getGroupUserList = async (id, uid, isSuperAdmin) => {
    try {
      let result = []
      if (isSuperAdmin) {
        const isAdmin = await User.isSuperAdmin(uid)
        result = isAdmin ? await Group.getGroupUserList(id) : result
      } else if (await Group.isAdminForThisGroup(id, uid)) {
        result = await Group.getGroupUserList(id)
      }
      return result.length > 0 ? Result.success(result) : Result.fail("Error obteniendo listado de usuarios del grupo: " + id)
    } catch (error) {
      console.log("Error en la capa de servicio: " + error)
    }
  }

  addUserToGroup = async (addUserId, uid, gid) => {
    try {
      let result = []
      const [userAlreadyExists] = await Group.userExists(gid, addUserId)

      if (!userAlreadyExists.exists) {
        if (await Group.isAdminForThisGroup(gid, uid)) {
          console.log("pepe")
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

}

export default GroupService