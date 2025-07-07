import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import './ProfileUpdateForm.css';
import { useToast } from "../../context/ToastContext";
import { updateUserData, updateUserPassword } from "../../api/configApi";

const UpdatePersonalDataForm = () => {
  const { updateUser, user } = useUser();
  const [name, setName] = useState(user.name);
  const [lastname, setLastname] = useState(user.lastname);
  const { showToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userConfirm = confirm(`¿Desea realizar los siguientes cambios?\nNombre: ${name}\nApellido: ${lastname}`);
    const hasChanges = user.name !== name || user.lastname !== lastname;

    if (userConfirm && hasChanges) {
      const result = await updateUserData(name, lastname)
      updateUser(result.data);
      showToast("Los cambios han sido guardados", "success");

    } else {
      showToast("No se han efectuado cambios o se canceló la modificación.", "warning");

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
  const { showToast } = useToast()
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [matchPassword, setMatchPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userConfirm = confirm(`¿Desea cambiar su contraseña?`);

    if (userConfirm && password.length >= 10 && matchPassword) {
      await updateUserPassword(rePassword)
      showToast("Contraseña cambiada con éxito", "success");

    } else {
      showToast("Error: las contraseñas no coinciden o son demasiado cortas.", "error");
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
