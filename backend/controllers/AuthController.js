import AuthService from "../services/AuthService.js"

const MIN_PASSWORD_LENGTH = 10
const AUTH_COOKIE_NAME = "authArgenmap"

class AuthController {
    constructor() {
        this.authService = new AuthService()
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body

            const result = await this.authService.login(email, password)

            if (!result.success) {
                return res.status(400).json(result.error)
            }

            this.#sendAuthCookie(res, result.data.token)

            return res.status(200).json(result.data.user)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error })
        }
    }

    register = async (req, res) => {
        try {
            const { email, name, lastname, password } = req.body


            if (!password || !name || !lastname || !email) { // A CHEQUEAR SI JS LE HACE UN .length A UNA CADENA STRING
                throw new Error("Se deben completar todos los campos para crear un nuevo usuario.")
            }

            if (password.length < MIN_PASSWORD_LENGTH) {
                throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
            }

            if ((await this.authService.isMailDuplicated(email)).success === true) {
                return res.status(400).json("El correo ya esta en uso")
            }

            const result = await this.authService.register(email, name, lastname, password)

            if (!result.success) {
                throw new Error(result.error)
            }

            this.#sendAuthCookie(res, result.data.token)

            return res.status(201).json(result.data)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }

    logout = async (req, res) => {
        res.clearCookie(AUTH_COOKIE_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
        });
        return res.status(200).json()
    }

    checkAuth = async (req, res) => {
        try {
            const token = req.cookies[AUTH_COOKIE_NAME]

            if (!token) {
                return res.status(401).json({ isAuth: false })
            }

            const result = await this.authService.checkAuth(token)
            return res.status(200).json(result.data)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error })
        }
    }


    getDataToken = (req, res) => {

    }

    #sendAuthCookie(res, token) {
        res.cookie(AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });
    }

}

export default AuthController;