import User from "../models/User.js"
import Result from "../utils/Result.js"

/**
 * Servicio que maneja la lógica relacionada con la administracion.
 */

class AdminService {

  searchUser = async (search) => {
    try {
      console.log("Jijo")
      const LIMIT = 10;
      const data = await User.searchUser(search, LIMIT);
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

}

export default AdminService