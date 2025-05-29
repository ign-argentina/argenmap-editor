import Group from "../models/Group.js"
import User from "../models/User.js"
import Result from "../utils/Result.js";
class GroupService {

  getGroupList = async (userId, isSuperAdmin = false, isGroupAdmin = false) => {
    try {
      let rolId = null;
      let data = []
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

  #getAllGroups = async (userId) => {
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

  addUserToGroup = async (id, uid, isSuperAdmin, gid) => {
    try {
      let result = []

      const [userAlreadyExists] = await Group.userExists(gid, id)

      if (isSuperAdmin) {
        const isAdmin = await User.isSuperAdmin(uid)
        result = (isAdmin && !userAlreadyExists.exists) ? await Group.addUserToGroup(id, gid) : result
      } else if (await Group.isAdminForThisGroup(gid, uid) && !userAlreadyExists.exists) {
        result = await Group.addUserToGroup(id, gid)
      }

      return result.length > 0 ? Result.success(result) : Result.fail("Nos se ha podido agregar el usuario al grupo " + gid)
    } catch (error) {
      return Result.fail("Nos se ha podido agregar el usuario al grupo " + gid)
    }
  }
}

export default GroupService