import BaseModel from "../models/BaseModel.js";
import Group from "../models/Group.js";
import User from "../models/User.js"
import Visor from "../models/Visor.js"
import Result from "../utils/Result.js"

/**
 * Servicio que maneja la lógica relacionada con la administracion.
 */


const TOTAL_METRICS = `SELECT * FROM ADMIN_METRICS`;
const MOST_VIEWERS_VISITED = `SELECT v.name, vbm.visits
                              FROM visores v
                              JOIN metrics_by_viewer vbm ON v.id = vbm.visor_id
                              WHERE vbm.visits IS NOT NULL
                              ORDER BY vbm.visits DESC
                              LIMIT $1`

const MOST_VIEWERS_DOWNLOADED = `SELECT v.name, vbm.downloads
                                FROM visores v
                                JOIN metrics_by_viewer vbm ON v.id = vbm.visor_id
                                WHERE vbm.downloads IS NOT NULL
                               ORDER BY vbm.downloads DESC
                                LIMIT $1`

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

  getMetrics = async () => {
  
    const MAX_VALUES = 10;
    const metrics = await BaseModel.runQuery(TOTAL_METRICS);
    const visited = await BaseModel.runQuery(MOST_VIEWERS_VISITED, [MAX_VALUES]);
    const downloaded = await BaseModel.runQuery(MOST_VIEWERS_DOWNLOADED, [MAX_VALUES]);;

    const data = {
      generalMetrics: metrics[0],
      mostVisited: visited,
      mostDownloaded: downloaded
    }

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

  createUser = async (name, lastname, email, password) => {
    User.newUser(email, name, lastname, password);
    return true;
  }
}

export default AdminService