import Group from "../models/Group.js";
import User from "../models/User.js"
import Result from "../utils/Result.js"

/**
 * Servicio que maneja la lógica relacionada con la administracion.
 */

class AdminService {

  searchUser = async (search) => {
    try {
      const LIMIT = 10;
      const data = await User.searchUser(search, LIMIT);
      return data
    } catch (error) {
      return error;
    }
  }

  searchGroup = async (search) => {
    try {
      const LIMIT = 10;
      const data = await Group.searchGroup(search, LIMIT);
      return data
    } catch (error) {
      return error;
    }
  }

  getAllUsers = async () => {
    try {
      const data = await User.getUserList()
      return data
    } catch (error) {
      return error
    }
  }

  changeUserStatus = async (id) => {
    const data = await User.changeUserStatus(id)
    return data
  }

  changeGroupStatus = async (id) => {
    const data = await Group.changeGroupStatus(id)
    return data
  }

  getUserMetrics = async () => {
    const data = await User.getUserMetrics();
    return data
  }

  getGroupsMetrics = async () => {
    const data = await Group.getGroupsMetrics();
    return data
  }

  resetUserPassword = async (id) => {
    const data = await User.resetUserPassword(id)
    return data
  }

  getAllGroups = async () => {
    const data = await Group.getAllGroups();
    return data;
  }


  /**
 * Crea un nuevo grupo. Solo accesible para superadmins.
 *
 * @param {number} uid - ID del usuario solicitante.
 * @param {string} name - Nombre del grupo.
 * @param {?string} description - Descripción opcional.
 * @param {?string} img - Imagen opcional.
 * @returns {Object} Resultado con el ID del grupo creado.
 */
  createGroup = async (name, description = null, img = null) => {
    try {

      const group = await Group.createGroup(name, description, img);
      if (!group || !group.id) {
        return Result.fail("No se pudo crear el grupo.");
      }

      return Result.success({ gid: group.id });
    } catch (error) {
      console.log("Error en la capa de servicio createGroup:", error);
      return Result.fail("Error interno al crear grupo.");
    }
  };

  addUserToGroup = async (groupId, email) => {
    const [user] = await User.findByEmail(email)
    Group.addUserToGroup(groupId, user.id, 2)
    return true;
  }
}

export default AdminService