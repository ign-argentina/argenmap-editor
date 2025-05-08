import AuthService from "../services/AuthService.js"

const MIN_PASSWORD_LENGTH = 10

class AuthController {
    constructor() {
        this.authService = new AuthService()
    }

    login = async (req, res) => {
        try {
            const {email, password} = req.body
            
            const result = await this.authService.login(email, password)

            if(!result.success){
                return res.status(400).json(result.error)
            }

           return res.status(200).json(result.data)
        } catch(error){
            console.log(error)
            return res.status(500).json({error})
        }
    }

    register = async (req, res) => {
        try {
            const { email, name, lastname, password } = req.body


            if (!password || !name || !lastname || !email){ // A CHEQUEAR SI JS LE HACE UN .length A UNA CADENA STRING
                throw new Error("Se deben completar todos los campos para crear un nuevo usuario.")
            }

            if (password.length < MIN_PASSWORD_LENGTH){
                throw new Error(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
            }

            if (await this.authService.isMailDuplicated(email)){
                return res.status(400).json("El correo ya esta en uso")
            }
            const result = await this.authService.register(email, name, lastname, password)

            if (!result.success) {
                throw new Error(result.error)
            }

            res.cookie("cookie-editorArgenMap", result.data.token, {
                httpOnly: true, // JS no pude acceder desde el front
                secure:true, // solo mediante cifrado https
                sameSite: "Strict" // Acceso solo desde la página, combinable coon CORS.
            })

            return res.status(201).json(result.data)

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error });
        }
    }

    getDataToken = (req, res) => {

    }

}

export default AuthController;