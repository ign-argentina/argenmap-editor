import './StatisticsDashboard.css'
import { useState, useEffect } from 'react';
import { getUserMetrics, getGroupsMetrics } from '../../../api/admin.js';

function StatisticsDashboard() {

  useEffect(() => {
    getUserMetrics().then(serUserMetrics);
    getGroupsMetrics().then(setGroupMetrics);
  }, []);

  const [userMetrics, serUserMetrics] = useState([])
  const [groupMetrics, setGroupMetrics] = useState([])

  // const updateMetrics = async () => {
  //   const metrica = await getUserMetrics()
  //   serUserMetrics(metrica)
  // }

  return (
    <div className="statistics-dashboard">

      <section className="sd-body">
        <section className="sd-metricas">
          <div>
            Usuarios
          </div>
          <div>
            Total: {userMetrics.total}
          </div>
          <div>
            Inactivos: {userMetrics.unabled}
          </div>
          <div>
            Administradores: {userMetrics.admins}
          </div>

          <div>
            Grupos
          </div>
          <div>
            Total: {groupMetrics.total}
          </div>
          <div>
            Inactivos: {groupMetrics.deleted}
          </div>
        </section>

      </section>
    </div>
  )
}

export default StatisticsDashboard