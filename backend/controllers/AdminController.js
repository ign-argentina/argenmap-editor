import UserService from "../services/UserService.js"
import AuthService from "../services/AuthService.js"
import AdminService from "../services/AdminService.js"

/**
 * Controlador para manejar acciones relacionadas con usuarios.
 * Se encarga de listar usuarios, actualizar datos y otras funciones.
 */
class AdminController {
  constructor() {
    this.userService = new UserService()
    this.authService = new AuthService()
    this.adminService = new AdminService()
  }

  searchUser = async (req, res) => {
    const { search } = req.query;
    const result = await this.adminService.searchUser(search)
    return res.status(200).json(result)
  }

  searchGroup = async (req, res) => {
    const { search } = req.query;
    const result = await this.adminService.searchGroup(search)
    return res.status(200).json(result)
  }


  getAllUsers = async (req, res) => {
    const result = await this.adminService.getAllUsers()
    return res.status(200).json(result)
  }

  changeUserStatus = async (req, res) => {
    try {
      const { userId } = req.body
      const result = await this.adminService.changeUserStatus(userId)
      return res.status(200).json(result)
    } catch (error) { }
    return res.status(200).json({ success: false })
  }

  changeGroupStatus = async (req, res) => {
    try {
      const { groupId } = req.body
      const result = await this.adminService.changeGroupStatus(groupId)
      return res.status(200).json(result)
    } catch (error) { }
    return res.status(200).json({ success: false })
  }

  resetUserPassword = async (req, res) => {
    try {
      const { id } = req.body
      const result = await this.adminService.resetUserPassword(id)
      return res.status(200).json(result)
    } catch (error) {
      return res.status(200).json({ success: false })
    }
  }

  getUsersMetrics = async (req, res) => {
    try {
      const result = await this.adminService.getUserMetrics()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(200).json({ success: false })
    }
  }

  getGroupsMetrics = async (req, res) => {
    try {
      const result = await this.adminService.getGroupsMetrics()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(200).json({ success: false })
    }
  }

  getAllGroups = async (req, res) => {
    try {
      const result = await this.adminService.getAllGroups()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(200).json({ success: false })
    }
  }

    createGroup = async (req, res) => {
    try {
      const { name, description, img, email } = req.body;
      let result = null;
      if (!name) {
        return res.status(400).json({ error: "El nombre del grupo es obligatorio." });
      }

      const mailCheck = await this.authService.isMailDuplicated(email);
      if (mailCheck.success === true) {
        result = await this.groupService.createGroup(uid, name, description, img);
        if (result.success) {
          const groupId = result.data.gid;
          const addAdminUser = await this.adminService.addUserToGroup(uid, groupId);
        }
      }
      
      return res.status(201).json(result);
    } catch (error) {
      console.log("Error en el controlador createGroup:", error);
      return res.status(500).json({ error: "Error interno al crear grupo." });
    }
  };

}


export default AdminController