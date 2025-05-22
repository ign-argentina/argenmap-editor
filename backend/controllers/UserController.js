import UserService from "../services/UserService.js"
import AuthService from "../services/AuthService.js"

class UserController {
  constructor() {
    this.userService = new UserService()
    this.authService = new AuthService()
  }

  newUser = (req, res) => {

  }

  updateUser = async (req, res) => {
    try {
      const token = req.cookies[process.env.AUTH_COOKIE_NAME]
      //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQ3MjI4MDk2LCJleHAiOjE3NDczMTQ0OTZ9.1jj6dRKZhUx82lwJ4EP2AYNmo5-QL0V85GFM2QUKibQ"
      const { name, lastname, password } = req.body

      if (!token || !(await this.authService.checkAuth(token)).success) {
        return res.status(401).json("Permisos denegados")
      }

      if (password && password.length < 10) {
        console.log(password)
        return res.status(400).json("La contraseña debe tener al menos 10 caracteres")
      }
      const result = await this.userService.updateUser(name, lastname, password, this.authService.getDataToken(token).id)
      return res.status(200).json(result.data)

    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  recoveryPassword = (req, res) => {

  }

}


export default UserController