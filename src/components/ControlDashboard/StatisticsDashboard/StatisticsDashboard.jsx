import './StatisticsDashboard.css'
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getUserMetrics, getGroupsMetrics } from '../../../api/admin.js';

function StatisticsDashboard() {

  useEffect(() => {
    getUserMetrics().then(setUserMetrics);
    getGroupsMetrics().then(setGroupMetrics);
  }, []);

  const [userMetrics, setUserMetrics] = useState({});
  const [groupMetrics, setGroupMetrics] = useState({});

  // -------------------------
  // DATA PARA LOS GRÁFICOS
  // -------------------------

  const userPieData = [
    { name: "Activos", value: (userMetrics.total ?? 0) - (userMetrics.unabled ?? 0) },
    { name: "Inactivos", value: userMetrics.unabled ?? 0 },
    { name: "Admins", value: userMetrics.admins ?? 0 },
  ];

  const groupPieData = [
    { name: "Activos", value: (groupMetrics.total ?? 0) - (groupMetrics.deleted ?? 0) },
    { name: "Inactivos", value: groupMetrics.deleted ?? 0 },
  ];

  const USER_COLORS = ["#4CAF50", "#F44336", "#FFC107"];
  const GROUP_COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="statistics-dashboard">

      <section className="sd-body">

        {/* ===================== USUARIOS ===================== */}
        <div className="sd-card">
          <h2 className="sd-title">Usuarios</h2>

          <div className="sd-row">
            <span>Total</span>
            <strong>{userMetrics.total}</strong>
          </div>

          <div className="sd-row">
            <span>Inactivos</span>
            <strong>{userMetrics.unabled}</strong>
          </div>

          <div className="sd-row">
            <span>Administradores</span>
            <strong>{userMetrics.admins}</strong>
          </div>

          {/* Gráfico */}
          <div className="sd-chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={userPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {USER_COLORS.map((color, idx) => (
                    <Cell key={idx} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===================== GRUPOS ===================== */}
        <div className="sd-card">
          <h2 className="sd-title">Grupos</h2>

          <div className="sd-row">
            <span>Total</span>
            <strong>{groupMetrics.total}</strong>
          </div>

          <div className="sd-row">
            <span>Inactivos</span>
            <strong>{groupMetrics.deleted}</strong>
          </div>

          {/* Gráfico */}
          <div className="sd-chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={groupPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {GROUP_COLORS.map((color, idx) => (
                    <Cell key={idx} fill={color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

    </div>
  )
}

export default StatisticsDashboard;
