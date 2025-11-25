// StatisticsDashboard.jsx
import './StatisticsDashboard.css'
import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getUserMetrics, getGroupsMetrics } from '../../../api/admin.js';

function StatisticsDashboard() {

  useEffect(() => {
    getUserMetrics().then(setUserMetrics);
    getGroupsMetrics().then(setGroupMetrics);
  }, []);

  const [userMetrics, setUserMetrics] = useState({});
  const [groupMetrics, setGroupMetrics] = useState({});

  // helper: normaliza a número seguro (evita NaN, null, strings)
  const safeNum = (v) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };

  // --- Datos calculados y mutuamente excluyentes para evitar solapamientos ---
  const {
    userPieData,
    groupPieData,
    USER_COLORS,
    GROUP_COLORS
  } = useMemo(() => {
    const totalUsers = safeNum(userMetrics.total);
    const inactivos = safeNum(userMetrics.unabled);
    const admins = safeNum(userMetrics.admins);

    // Activos no-admins => aseguramos que no sea negativo
    let activosNoAdmins = totalUsers - inactivos - admins;
    if (activosNoAdmins < 0) activosNoAdmins = 0;

    const userPie = [
      { name: "Administradores", value: admins },
      { name: "Inactivos", value: inactivos },
      { name: "Activos (no-admins)", value: activosNoAdmins },
    ];

    const USER_COLORS = ["#FFC107", "#F44336", "#4CAF50"]; // admin, inactivos, activos

    const totalGroups = safeNum(groupMetrics.total);
    const deletedGroups = safeNum(groupMetrics.deleted);
    let activeGroups = totalGroups - deletedGroups;
    if (activeGroups < 0) activeGroups = 0;

    const groupPie = [
      { name: "Activos", value: activeGroups },
      { name: "Inactivos", value: deletedGroups },
    ];

    const GROUP_COLORS = ["#4CAF50", "#F44336"];

    return {
      userPieData: userPie,
      groupPieData: groupPie,
      USER_COLORS,
      GROUP_COLORS
    };
  }, [userMetrics, groupMetrics]);

  // label personalizado para que muestre nombre + porcentaje (evita solapamientos con labelLine)
  const pieLabel = ({ name, percent }) => `${name} ${Math.round(percent * 100)}%`;

  return (
    <div className="statistics-dashboard">

      <section className="sd-body">

        {/* ===================== USUARIOS ===================== */}
        <div className="sd-card">
          <h2 className="sd-title">Usuarios</h2>

          <div className="sd-row">
            <span>Total</span>
            <strong>{userMetrics.total ?? 0}</strong>
          </div>

          <div className="sd-row">
            <span>Inactivos</span>
            <strong>{userMetrics.unabled ?? 0}</strong>
          </div>

          <div className="sd-row">
            <span>Administradores</span>
            <strong>{userMetrics.admins ?? 0}</strong>
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
                  label={pieLabel}
                  labelLine={false}
                >
                  {userPieData.map((entry, idx) => (
                    // si hay más datos que colores, se reciclan con modulo
                    <Cell key={`cell-${idx}`} fill={USER_COLORS[idx % USER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===================== GRUPOS ===================== */}
        <div className="sd-card">
          <h2 className="sd-title">Grupos</h2>

          <div className="sd-row">
            <span>Total</span>
            <strong>{groupMetrics.total ?? 0}</strong>
          </div>

          <div className="sd-row">
            <span>Inactivos</span>
            <strong>{groupMetrics.deleted ?? 0}</strong>
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
                  label={pieLabel}
                  labelLine={false}
                >
                  {groupPieData.map((entry, idx) => (
                    <Cell key={`cell-g-${idx}`} fill={GROUP_COLORS[idx % GROUP_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

    </div>
  )
}

export default StatisticsDashboard;
