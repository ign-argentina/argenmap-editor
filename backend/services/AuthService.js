import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import Result from "../utils/Result.js";

class AuthService {

  login = async (email, password) => {
    try {
      let loginSuccess = false;
      let data = null;

      const [userData] = await User.findByEmail(email)

      const isActive = (userData?.active ?? false)

      if (isActive) {
        if (await User.validatePassword(password, userData.password)) {
          loginSuccess = true;
          const { id, password, ...user } = userData
          const token = await this.#signToken(id)
          data = { user, token }
        }
      }

      return loginSuccess ? Result.success(data) : Result.fail(!isActive ? "La cuenta está inhabilitada" : "El usuario o contraseña son incorrectos")
    } catch (error) {
      console.log("Error en la capa de servicio", error)
    }
  }

  register = async (email, name, lastname, password) => {
    try {

      const [userData] = await User.newUser(email, name, lastname, password); // Debería devolver id, email, nombre y apellido.
      const { id, ...user } = userData // Desestructuramos id y el resto

      const token = await this.#signToken(id)

      const data = { user, token }

      return user ? Result.success(data) : Result.fail("No se ha podido crear el usuario")
    } catch (error) {
      console.log("Error en la capa de servicio", error)
    }
  }

  logout = async (res) => {

  }

  #signToken = async (userId) => {
    const isAdmin = await User.isSuperAdmin(userId)
    const isGroupAdmin = await User.isGroupAdmin(userId)
    return jwt.sign({ uid: userId, isa: isAdmin, isag: isGroupAdmin }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_EXPIRES) })
  }

  getDataToken(token) {
    return this.#decodeToken(token)
  }

  isMailDuplicated = async (email) => {
    try {
      const data = await User.isMailDuplicated(email)
      return data ? Result.success() : Result.fail()
    } catch (error) {
      console.log("Error en la capa de servicio", error)
    }
  }

  checkAuth = async (token) => {
    try {
      const isAuth = this.#decodeToken(token)
      return Result.success({isa: isAuth.isa, isag: isAuth.isag})
    } catch (error) {
      return Result.fail("Debes iniciar sesion")
    }
  }

  isSuperAdmin = async (token) => {
    try {
      let isSuperAdmin = false;
      const isAuth = await this.checkAuth(token)
      if (isAuth.success) {
        const { uid } = this.#decodeToken(token)
        isSuperAdmin = await User.isSuperAdmin(uid)
      }
      console.log(isSuperAdmin)
      return isSuperAdmin ? Result.success(isSuperAdmin) : Result.fail("Acceso restringido")
    } catch (error) {
      console.log("Error en servicio: " + error)
    }
  }

  isSuperAdminOrGroupAdmin = async (token) => {
    try {
      const isAuth = await this.checkAuth(token)
      let haveAccess = false;
      if (isAuth.success) {
        const { uid } = this.#decodeToken(token)
        const isSuperAdmin = await User.isSuperAdmin(uid)
        const isGroupAdmin = await User.isGroupAdmin(uid)
        haveAccess = (isSuperAdmin || isGroupAdmin)
      }
      return haveAccess ? Result.success(haveAccess) : Result.fail("Acceso restringido")
    } catch (error) {
      console.log("Error en servicio: " + error)
    }
  }


  #decodeToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}


export default AuthService