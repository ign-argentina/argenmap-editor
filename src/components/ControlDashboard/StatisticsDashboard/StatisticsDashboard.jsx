import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getUserMetrics, getGroupsMetrics, getVisorMetrics } from '../../../api/admin.js';
import './StatisticsDashboard.css'

function StatisticsDashboard() {
  const [userMetrics, setUserMetrics] = useState({});
  const [groupMetrics, setGroupMetrics] = useState({});
  const [visorMetrics, setVisorMetrics] = useState({});

  useEffect(() => {
    getUserMetrics().then(setUserMetrics);
    getGroupsMetrics().then(setGroupMetrics);
    getVisorMetrics().then(setVisorMetrics);
  }, []);

  // helper: normaliza a número seguro (evita NaN, null, strings)
  const safeNum = (v) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n : 0;
  };

  const {
    userPieData,
    groupPieData,
    visorPieData,
    USER_COLORS,
    GROUP_COLORS,
    VISOR_COLORS
  } = useMemo(() => {
    // ---------------- USERS ----------------
    const totalUsers = safeNum(userMetrics.total);
    const inactivos = safeNum(userMetrics.unabled);
    const admins = safeNum(userMetrics.admins);

    let activosNoAdmins = totalUsers - inactivos - admins;
    if (activosNoAdmins < 0) activosNoAdmins = 0;

    const userPie = [
      { name: "Administradores", value: admins },
      { name: "Inactivos", value: inactivos },
      { name: "Activos (no-admins)", value: activosNoAdmins },
    ];

    const USER_COLORS = ["#FFC107", "#F44336", "#4CAF50"];

    // ---------------- GROUPS ----------------
    const totalGroups = safeNum(groupMetrics.total);
    const deletedGroups = safeNum(groupMetrics.deleted);

    let activeGroups = totalGroups - deletedGroups;
    if (activeGroups < 0) activeGroups = 0;

    const groupPie = [
      { name: "Activos", value: activeGroups },
      { name: "Inactivos", value: deletedGroups },
    ];

    const GROUP_COLORS = ["#4CAF50", "#F44336"];

    // ---------------- VISORES (solo total, public, shared) ----------------
    const totalVisors = safeNum(visorMetrics.total);
    let publicVisors = safeNum(visorMetrics.public);
    let sharedVisors = safeNum(visorMetrics.shared);

    // Evitar negativos
    if (publicVisors < 0) publicVisors = 0;
    if (sharedVisors < 0) sharedVisors = 0;

    // Si public + shared > total -> escalar proporcionalmente para que sumen total
    const sumPS = publicVisors + sharedVisors;
    if (sumPS > 0 && totalVisors > 0 && sumPS > totalVisors) {
      const scale = totalVisors / sumPS;
      publicVisors = Math.round(publicVisors * scale);
      sharedVisors = Math.round(sharedVisors * scale);
      // por si el redondeo genera una diferencia, ajustamos el resto al que tenga mayor valor
      const diff = totalVisors - (publicVisors + sharedVisors);
      if (diff !== 0) {
        if (publicVisors >= sharedVisors) publicVisors += diff;
        else sharedVisors += diff;
      }
    }

    const visorPie = [
      { name: "Públicos", value: publicVisors },
      { name: "Compartidos", value: sharedVisors },
    ];

    const VISOR_COLORS = ["#4CAF50", "#FFC107", "#F44336"];

    return {
      userPieData: userPie,
      groupPieData: groupPie,
      visorPieData: visorPie,
      USER_COLORS,
      GROUP_COLORS,
      VISOR_COLORS
    };
  }, [userMetrics, groupMetrics, visorMetrics]);

  // label personalizado para que muestre nombre + porcentaje (evita solapamientos con labelLine)
  const pieLabel = ({ name, percent }) => `${name} ${Math.round(percent * 100)}%`;

  return (
    <div className="statistics-dashboard">

      <button onClick={() => console.log(visorMetrics)}>TEST</button>

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
                <Legend verticalAlign="bottom" height={36} />
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
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===================== VISORES ===================== */}
        <div className="sd-card">
          <h2 className="sd-title">Visores</h2>

          <div className="sd-row">
            <span>Total</span>
            <strong>{visorMetrics.total ?? 0}</strong>
          </div>

          <div className="sd-row">
            <span>Públicos</span>
            <strong>{visorMetrics.public ?? 0}</strong>
          </div>

          <div className="sd-row">
            <span>Compartidos</span>
            <strong>{visorMetrics.shared ?? 0}</strong>
          </div>

          {/* Gráfico (solo Públicos y Compartidos) */}
          <div className="sd-chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={visorPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label={pieLabel}
                  labelLine={false}
                >
                  {visorPieData.map((entry, idx) => (
                    <Cell key={`cell-v-${idx}`} fill={VISOR_COLORS[idx % VISOR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>


      </section>

    </div>
  )
}

export default StatisticsDashboard;
