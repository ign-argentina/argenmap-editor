import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import './ProfileUpdateForm.css';

const UpdatePersonalDataForm = () => {
    const { login, user } = useUser();
    const [name, setName] = useState(user.name);
    const [lastname, setLastname] = useState(user.lastname);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userConfirm = confirm(`¿Desea realizar los siguientes cambios?\nNombre: ${name}\nApellido: ${lastname}`);
        const hasChanges = user.name !== name || user.lastname !== lastname;

        if (userConfirm && hasChanges) {
            const result = await axios.post("http://localhost:3001/users/update", {
                name,
                lastname
            }, { withCredentials: true });

            login(result.data);
            alert("Los cambios han sido guardados");
        } else {
            alert("No se han efectuado cambios o se canceló la modificación.");
        }
    };

    return (
        <div className="profile-form-wrapper">
            <form onSubmit={handleSubmit}>
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
        </div>
    );
};

const ChangePasswordForm = () => {
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [matchPassword, setMatchPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userConfirm = confirm(`¿Desea cambiar su contraseña?`);

        if (userConfirm && password.length >= 10 && matchPassword) {
            await axios.post("http://localhost:3001/users/update", {
                password: rePassword
            }, { withCredentials: true });

            alert("Contraseña cambiada con éxito");
        } else {
            alert("Error: las contraseñas no coinciden o son demasiado cortas.");
        }
    };

    useEffect(() => {
        setMatchPassword(password === rePassword);
    }, [password, rePassword]);

    return (
        <div className="profile-form-wrapper">
            <form onSubmit={handleSubmit}>
                <h2>Modificación de contraseña</h2>
                <label>
                    Nueva contraseña:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Ingrese la nueva contraseña"
                    />
                </label>

                <label>
                    Reingrese nueva contraseña:
                    <input
                        type="password"
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                        placeholder="Repita la contraseña"
                    />
                </label>

                <button type="submit" disabled={!matchPassword || password.length < 10}>
                    Cambiar contraseña
                </button>
            </form>
        </div>
    );
};

function ProfileUpdateForm({ personalData }) {
    return personalData ? <UpdatePersonalDataForm /> : <ChangePasswordForm />;
}

export default ProfileUpdateForm;
