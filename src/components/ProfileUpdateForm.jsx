import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";

const UpdatePersonalDataForm = () => {
    const { login, user } = useUser()
    const [name, setName] = useState(user.name)
    const [lastname, setLastname] = useState(user.lastname)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userConfirm = confirm(`¿Desea realizar los siguientes cambios? Tus nuevos datos de perfil seran los siguientes:
                Nombre: ${name} 
                Apellido: ${lastname}`);

        if (userConfirm && user.name != name || user.lastname != lastname) {
            const result = await axios.post("http://localhost:3001/users/update", {
                name: name,
                lastname: lastname
            }, { withCredentials: true })

            console.log(result.data)
            login(result.data)
            alert("Los cambios han sido guardados")
        } else {
            alert("No se han efectuado cambios o has cancelado la modificacion")
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Modificar datos personales</h2>
            <label>
                Nombre:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ingrese su nombre"
                />
            </label>
            <label>
                Apellido:
                <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Ingrese su apellido"
                />
            </label>
            <button type="submit">Guardar cambios</button>
        </form>
    )
}

const ChangePasswordForm = () => {
    const [password, setPassword] = useState("arandomValue")
    const [rePassword, setRePassword] = useState("valueRandomA")
    const [matchPassword, setMatchPassword] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userConfirm = confirm(`¿Desea cambiar su contraseña?`);

        if (userConfirm && (password != "" || password.length < 10) && rePassword != "") {
            const result = await axios.post("http://localhost:3001/users/update", {
                password: rePassword
            }, { withCredentials: true })
            alert("Contraseña cambiada con exito")
        }
        else {
            alert("La contraseña debe tener al menos 10 caracteres")
        }
    }

    useEffect(() => {
        setMatchPassword(password === rePassword);
    }, [password, rePassword]);

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2>Modificación de contraseña</h2>
            <label>
                Nueva contraseña:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese la contraseña nueva"
                    onClick={() => setPassword('')}
                />
            </label>
            <label>
                Reingrese nueva contraseña:
                <input
                    type="password"
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                    placeholder="Reingrese la contraseña"
                    onClick={() => setRePassword('')}
                />
            </label>
            <button disabled={!matchPassword} type="submit">Cambiar contraseña</button>
        </form>
    )
}

function ProfileUpdateForm({ personalData }) {



    return personalData ? <UpdatePersonalDataForm /> : <ChangePasswordForm />;
}


export default ProfileUpdateForm