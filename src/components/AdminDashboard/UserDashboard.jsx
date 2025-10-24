import './UserDashboard.css'
import { useState, useEffect } from 'react';
import { searchUser } from '../../api/configApi';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout cuando el componente se desmonte o el valor cambie
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function UserDashboard() {

  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500); // Se aplica el debounce con 500ms


  useEffect(() => {
    if (debouncedSearch.trim()) {      
      const fetchUsuarios = async () => {
        const response = await searchUser(debouncedSearch)
        setUsuarios(response);
      };
      fetchUsuarios();
    } else {
      setUsuarios([]); // Si no hay búsqueda, mostramos vacío o no haces la consulta
    }
  }, [debouncedSearch]);

  return (
    <div className="user-dashboard">

      <h1>Administrar Usuarios</h1>

      <section className="ud-metricas">
        <div>
          Total:
        </div>

        <div>
          Inactivos:
        </div>

        <div>
          Administradores:
        </div>

        {/*         <div>
          Usuarios Registrados:
        </div> */}
      </section>
      <section className="ud-body">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="ud-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario, index) => (
                <tr key={index}>
                  <td>{usuario.email}</td>
                  <td>{usuario.name}</td>
                  <td>{usuario.lastname}</td>
                  <td>{usuario.active ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button onClick={() => changeUserStatus(usuario.email)}>{usuario.active ? "Deshabilitar" : "Habilitar"}</button>
                    <button>Editar</button>
                    <button onClick={() => blanquearClave(usuario.email)}>Blanquear Clave</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No se encontraron resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

    </div>
  )
}

export default UserDashboard