import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import Result from "../utils/Result.js";
import dotenv from 'dotenv'
dotenv.config()

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
                    const token = this.#signToken(id)
                    data = { user, token }
                }
            }

            return loginSuccess ? Result.success(data) : Result.fail( !isActive ? "La cuenta está inhabilitada" : "El usuario o contraseña son incorrectos")
        } catch (error) {
            console.log("Error en la capa de servicio", error)
        }
    }

    register = async (email, name, lastname, password) => {
        try {

            const [userData] = await User.newUser(email, name, lastname, password); // Debería devolver id, email, nombre y apellido.
            const { id, ...user } = userData // Desestructuramos id y el resto

            const token = this.#signToken(id)

            const data = { user, token }

            return user ? Result.success(data) : Result.fail("No se ha podido crear el usuario")
        } catch (error) {
            console.log("Error en la capa de servicio", error)
        }
    }

    logout = async (res) => {
        
    }

    #signToken = (userId) => {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: parseInt(process.env.JWT_EXPIRES) })
    }

    getDataToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET)
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
        try{
            const isAuth = jwt.verify(token, process.env.JWT_SECRET)
            return Result.success(true)
        } catch(error){
            return Result.fail("Debes iniciar sesion")

        }

    }
}


export default AuthService