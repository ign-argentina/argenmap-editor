import React, { useState } from 'react';
import './CreateModal.css';
import { registerUser } from '../../api/auth';
import { createGroup, addUserToGroup } from '../../api/admin';
import { getUserList } from '../../api/users';
import { useToast } from '../../context/ToastContext';
import { searchUser } from '../../api/admin';

function CreateModal({ type = "user", onClose, onSuccess }) {

  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');

  // Para búsqueda y selección de usuarios al crear un grupo
  const [search, setSearch] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = async () => {
    if (!search.trim()) {
      const allUsers = await getUserList();
      setUsuarios(allUsers);
      return;
    }
    const results = await searchUser(search.trim());
    setUsuarios(results || []);
  };

  const handleSelectUser = (usr) => {
    setSelectedUser(usr);
    setSearch(usr.email); // Mostrar el mail del seleccionado
    setUsuarios([]); // Esconde la lista
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;

      if (type === "user") {
        res = await registerUser(name, lastname, email, password);
        if (res) showToast("Usuario creado correctamente!", "success");
      }

      if (type === "group") {
        if (!selectedUser) {
          return showToast("Seleccioná un usuario admin!", "warning");
        }

        // Crear el grupo y obtener su ID
        const groupRes = await createGroup(name, description, null, selectedUser.email);
        console.log("groupRes: ", groupRes)
        // const groupId = groupRes.data.gid;

        // if (!groupId) {
        //   throw new Error("No se pudo obtener el ID del grupo creado.");
        // }

        // Asignar el usuario al grupo
        // await addUserToGroup(selectedUser.id, groupId);

        showToast("Grupo creado y usuario asignado correctamente!", "success");
      }

      onClose();
      onSuccess?.();

    } catch (error) {
      console.error(error);
      showToast(error.response?.data || error.message, "warning");
    }
  };

  return (
    <div className="register-overlay" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{type === "user" ? "Nuevo Usuario" : "Nuevo Grupo"}</h2>

        <form className="form-register" onSubmit={handleSubmit}>

          <input type="text" placeholder="Nombre"
            value={name} onChange={(e) => setName(e.target.value)} required />

          {type === "user" && (
            <>
              <input type="text" placeholder="Apellido"
                value={lastname} onChange={(e) => setLastname(e.target.value)} required />

              <input type="email" placeholder="Correo electrónico"
                value={email} onChange={(e) => setEmail(e.target.value)} required />

              <input type="password" placeholder="Contraseña"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </>
          )}

          {type === "group" && (
            <>
              <textarea type="text" placeholder="Descripción"
                value={description} onChange={(e) => setDescription(e.target.value)} />

              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" placeholder="Buscar usuario..."
                  value={search} onChange={(e) => setSearch(e.target.value)} />
                <button type="button" className="btn-search" onClick={handleSearch}>
                  Buscar
                </button>
              </div>

              {usuarios.length > 0 && (
                <div className="search-results">
                  {usuarios.map(usr => (
                    <div
                      key={usr.id}
                      className="search-item"
                      onClick={() => handleSelectUser(usr)}
                    >
                      {usr.name} {usr.lastname} - {usr.email}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <button type="submit">
            {type === "user" ? "Crear Usuario" : "Crear Grupo"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateModal;