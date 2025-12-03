import { useUser } from "../context/UserContext";
import './ControlPanel.css'
import GroupDashboard from "../components/ControlDashboard//GroupDashboard/GroupDashboard";
import UserDashboard from "../components/ControlDashboard/UserDashboard/UserDashboard";
import StatisticsDashboard from "../components/ControlDashboard/StatisticsDashboard/StatisticsDashboard";
import { useState } from "react";

function ControlPanel() {
  const { logout, setGroupAdmin, setSuperAdmin, superAdmin } = useUser()
  const [tab, setTab] = useState(0);
  return (
    <div className='control-panel'>

      <div className='cpanel-navbar'>
        <button onClick={() => setTab(0)}>Administrar Usuarios</button>
        <button onClick={() => setTab(1)}>Administrar Grupos</button>
        <button onClick={() => setTab(2)}>Configuracion General</button>
        <button onClick={() => setTab(3)}>Estadísticas Globales</button>
      </div>

      <div className='cpanel-body'>
        {tab === 0 && <UserDashboard />}
        {tab === 1 && <GroupDashboard />}
        {tab === 3 && <StatisticsDashboard />}
      </div>
    </div>
  )
}

export default ControlPanel