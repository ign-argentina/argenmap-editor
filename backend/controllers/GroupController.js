import AuthService from "../services/AuthService.js"
import GroupService from "../services/GroupService.js"

/**
 * Controlador encargado de gestionar grupos y sus usuarios.
 * Incluye creación, edición, eliminación y consulta de grupos, así como gestión de miembros.
 */
class GroupController {
  constructor() {
    this.groupService = new GroupService()
    this.authService = new AuthService();
  }

  createGroup = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME];
      const { uid } = this.authService.getDataToken(token);
      const { name, description, img } = req.body;

      if (!name) {
        return res.status(400).json({ error: "El nombre del grupo es obligatorio." });
      }

      const result = await this.groupService.createGroup(uid, name, description, img);

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(201).json(result);
    } catch (error) {
      console.log("Error en el controlador createGroup:", error);
      return res.status(500).json({ error: "Error interno al crear grupo." });
    }
  };

  /**
 * Actualiza los datos de un grupo específico.
 *
 * @param {Object} req - Solicitud HTTP con datos del grupo.
 * @param {Object} res - Respuesta HTTP con el resultado.
 */
  updateGroup = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { name, description, img, gid } = req.body
      const { uid } = this.authService.getDataToken(token)

      const result = await this.groupService.updateGroup(name, description, img, gid, uid)

      if (!result.success) {
        return res.status(400).json(result.error)
      }

      return res.status(200).json(result)

    } catch (error) {
      console.log("Error en el controlador " + error)
      return res.status(500).json(error)
    }
  }

  /**
 * Elimina un grupo si el usuario tiene permisos.
 *
 * @param {Object} req - Solicitud HTTP con el ID del grupo.
 * @param {Object} res - Respuesta HTTP con el resultado.
 */
  deleteGroup = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { gid } = req.body
      const { uid } = this.authService.getDataToken(token)
      const result = await this.groupService.deleteGroup(gid, uid)

      if (!result.success) {
        return res.status(403).json(result.error)
      }
      return res.status(200).json(result)

    } catch (error) {
      console.log("Error en el controlador " + error)
      return res.status(500).json(error)
    }
  }

  /**
 * Elimina un usuario de un grupo si el usuario actual tiene permisos.
 *
 * @param {Object} req - Solicitud con ID de usuario a eliminar y del grupo.
 * @param {Object} res - Respuesta con el resultado.
 */
  deleteUserFromGroup = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { deleteUserId, gid } = req.body
      const { uid } = this.authService.getDataToken(token)
      const result = await this.groupService.deleteUserFromGroup(deleteUserId, uid, gid)

      if (!result.success) {
        return res.status(500).json(result.error)
      }
      return res.status(200).json(result)

    } catch (error) {
      console.log("Error en el controlador " + error)
      return res.status(500).json(error)
    }
  }

  /**
 * Obtiene la lista de grupos visibles por el usuario.
 *
 * @param {Object} req - Solicitud HTTP con token del usuario.
 * @param {Object} res - Lista de grupos.
 */
  getGroupList = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid, rolId } = this.authService.getDataToken(token)
      const result = await this.groupService.getGroupList(uid, rolId)
      return res.status(200).json(result)
    } catch (error) {
      console.log("Error en Controlador: " + error)
      return res.status(500).json(error)
    }
  }

  /**
 * Obtiene lista de grupos gestionados por el usuario.
 *
 * @param {Object} req - Solicitud HTTP.
 * @param {Object} res - Lista de grupos gestionables.
 */
  getManageGroupList = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid, isag } = this.authService.getDataToken(token)
      const result = await this.groupService.getGroupList(uid, isag)
      return res.status(200).json(result)
    } catch (error) {
      console.log("Error en Controlador: " + error)
      return res.status(500).json(error)
    }
  }

  /**
 * Obtiene la información detallada de un grupo.
 *
 * @param {Object} req - Solicitud con ID del grupo.
 * @param {Object} res - Datos del grupo.
 */
  getGroup = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { id } = req.params
      const { uid, isa, isag } = this.authService.getDataToken(token)
      const result = await this.groupService.getGroup(id, uid, isa, isag)
      return res.status(200).json(result)
    } catch (error) {
      console.log("Error en controlador: " + error)
      return res.status(500).json(error)
    }
  }

  /**
 * Devuelve la lista de usuarios de un grupo.
 *
 * @param {Object} req - Solicitud con ID del grupo.
 * @param {Object} res - Lista de usuarios del grupo.
 */
  getGroupUserList = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { id } = req.params
      const { uid, isa } = this.authService.getDataToken(token)
      const result = await this.groupService.getGroupUserList(id, uid, isa);

      if (!result.success) return res.status(400).json(result)

      return res.status(200).json(result.data)
    } catch (error) {
      console.log("Error en el controlador" + error)
      return res.status(500).json(error)
    }
  }

  /**
 * Agrega un usuario a un grupo.
 *
 * @param {Object} req - Solicitud con ID de usuario e ID del grupo.
 * @param {Object} res - Resultado de la operación.
 */
  addUserToGroup = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { id, gid } = req.body
      const { uid } = this.authService.getDataToken(token)
      const result = await this.groupService.addUserToGroup(id, uid, gid)

      if (!result.success) {
        return res.status(400).json(result)
      }
      return res.status(200).json(result)

    } catch (error) {
      console.log("Error en el controlador " + error)
      return res.status(500).json(error)
    }
  }

  /**
 * Cambia el rol de un usuario dentro de un grupo.
 *
 * @param {Object} req - Solicitud con IDs de usuario, rol y grupo.
 * @param {Object} res - Resultado de la operación.
 */
  updateUserRolFromGroup = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { userId, rolId, groupId } = req.body
      const { uid } = this.authService.getDataToken(token)
      const result = await this.groupService.updateUserRolFromGroup(uid, userId, rolId, groupId)

      return res.status(200).json()
    } catch (error) {
      console.log("Error en el controlador " + error)
      return res.status(500).json(error)
    }
  }

  getPermissions = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { uid } = this.authService.getDataToken(token)

      const result = await this.groupService.getPermissions(uid, req.params.id)
      if (!result.success) {
        return res.status(403).json("Acceso denegado")
      }

      return res.status(200).json(result)
    } catch (error) {
      console.log("Error en el controlador ", error)
      return res.status(500).json(error)
    }
  }
}

export default GroupController;