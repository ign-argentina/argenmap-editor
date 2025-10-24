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

  getAllUsers = async (req, res) => {
    const result = await this.adminService.getAllUsers()
    return res.status(200).json(result)
  }
}


export default AdminController