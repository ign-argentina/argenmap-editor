import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  getUserMetrics,
  getGroupsMetrics,
  getVisorMetrics,
} from "../../../api/admin.js";

import MetricCard from "./MetricCard.jsx";
import "./StatisticsDashboard.css";

function StatisticsDashboard() {
  const [userMetrics, setUserMetrics] = useState({});
  const [groupMetrics, setGroupMetrics] = useState({});
  const [visorMetrics, setVisorMetrics] = useState({});

  useEffect(() => {
    getUserMetrics().then(setUserMetrics);
    getGroupsMetrics().then(setGroupMetrics);
    getVisorMetrics().then(setVisorMetrics);
  }, []);

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
    VISOR_COLORS,
    activeUsers,
    activeGroups,
  } = useMemo(() => {
    /* ---------- USERS ---------- */
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

    /* ---------- GROUPS ---------- */
    const totalGroups = safeNum(groupMetrics.total);
    const deletedGroups = safeNum(groupMetrics.deleted);
    let activeGroups = totalGroups - deletedGroups;
    if (activeGroups < 0) activeGroups = 0;

    const groupPie = [
      { name: "Activos", value: activeGroups },
      { name: "Inactivos", value: deletedGroups },
    ];

    const GROUP_COLORS = ["#4CAF50", "#F44336"];

    /* ---------- VISORES ---------- */
    const totalVisors = safeNum(visorMetrics.total);
    let publicVisors = safeNum(visorMetrics.public);
    let sharedVisors = safeNum(visorMetrics.shared);

    if (publicVisors < 0) publicVisors = 0;
    if (sharedVisors < 0) sharedVisors = 0;

    const sumPS = publicVisors + sharedVisors;
    if (sumPS > totalVisors && totalVisors > 0) {
      const scale = totalVisors / sumPS;
      publicVisors = Math.round(publicVisors * scale);
      sharedVisors = Math.round(sharedVisors * scale);
    }

    const visorPie = [
      { name: "Públicos", value: publicVisors },
      { name: "Compartidos", value: sharedVisors },
    ];

    const VISOR_COLORS = ["#4CAF50", "#FFC107"];

    return {
      userPieData: userPie,
      groupPieData: groupPie,
      visorPieData: visorPie,
      USER_COLORS,
      GROUP_COLORS,
      VISOR_COLORS,
      activeUsers: activosNoAdmins,
      activeGroups: activeGroups,
    };
  }, [userMetrics, groupMetrics, visorMetrics]);

  const pieLabel = ({ name, percent }) =>
    `${name} ${Math.round(percent * 100)}%`;

  return (
    <div className="statistics-dashboard">
      <section className="sd-body">
        {/* ---------------- USERS ---------------- */}
        <div className="sd-column">
          <MetricCard
            icon="👥"
            title="Usuarios Totales"
            value={userMetrics.total ?? 0}
          />
          <MetricCard icon="🟢" title="Activos" value={activeUsers} />
          <MetricCard icon="🛑" title="Inactivos" value={userMetrics.unabled ?? 0} />
          <MetricCard icon="⭐" title="Administradores" value={userMetrics.admins ?? 0} />

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
                    <Cell
                      key={`cell-${idx}`}
                      fill={USER_COLORS[idx % USER_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------------- GROUPS ---------------- */}
        <div className="sd-column">
          <MetricCard
            icon="📦"
            title="Grupos Totales"
            value={groupMetrics.total ?? 0}
          />
          <MetricCard icon="🟢" title="Activos" value={activeGroups} />
          <MetricCard
            icon="🛑"
            title="Inactivos"
            value={groupMetrics.deleted ?? 0}
          />

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
                    <Cell
                      key={`cell-g-${idx}`}
                      fill={GROUP_COLORS[idx % GROUP_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---------------- VISORES ---------------- */}
        <div className="sd-column">
          <MetricCard
            icon="🗂️"
            title="Visores Totales"
            value={visorMetrics.total ?? 0}
          />
          <MetricCard
            icon="🌍"
            title="Públicos"
            value={visorMetrics.public ?? 0}
          />
          <MetricCard
            icon="🤝"
            title="Compartidos"
            value={visorMetrics.shared ?? 0}
          />

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
                    <Cell
                      key={`cell-v-${idx}`}
                      fill={VISOR_COLORS[idx % VISOR_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StatisticsDashboard;
