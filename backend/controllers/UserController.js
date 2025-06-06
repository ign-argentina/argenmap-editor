import UserService from "../services/UserService.js"
import AuthService from "../services/AuthService.js"

class UserController {
  constructor() {
    this.userService = new UserService()
    this.authService = new AuthService()
  }

  getUserList = async (req, res) => {
    try{
      const result = await this.userService.getUserList()
      return res.status(200).json(result)
    }catch(error){
      return res.status(500).json({error})
    }
  }

  updateUser = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      const { name, lastname, password } = req.body

      if (!token || !(await this.authService.checkAuth(token)).success) {
        return res.status(401).json("Permisos denegados")
      }

      if (password && password.length < 10) {
        return res.status(400).json("La contraseña debe tener al menos 10 caracteres")
      }
      const result = await this.userService.updateUser(name, lastname, password, this.authService.getDataToken(token).uid)
      return res.status(200).json(result.data)

    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  recoveryPassword = (req, res) => {

  }

}


export default UserController