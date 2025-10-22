import { useUser } from "../context/UserContext";
import './ControlPanel.css'

function AdminDashboard() {
  const { logout, setGroupAdmin, setSuperAdmin, superAdmin } = useUser()

  return (
    <div className='control-panel'>

      <div className='cpanel-navbar'>
        <button>Administrar Usuarios</button>
        <button>Administrar Grupos</button>
        <button>Configuracion General</button>
        <button>Métricas</button>
      </div>

      <div className='cpanel-body'>
          aaaaaaaa
      </div>

    </div>
  )
}

export default AdminDashboard