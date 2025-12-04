import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Rectangle,
} from "recharts";

import { getMetrics } from "../../../api/admin.js";
import MetricCard from "./MetricCard.jsx";
import "./StatisticsDashboard.css";

function StatisticsDashboard() {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    updateMetrics();
  }, []);

  const updateMetrics = async () => {
    const metrica = await getMetrics();
    setMetrics(metrica);
    return metrica;
  }

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
    const totalUsers = safeNum(metrics?.generalMetrics?.user_total);
    const inactivos = safeNum(metrics?.generalMetrics?.user_disabled);
    const admins = safeNum(metrics?.generalMetrics?.user_admin);
    let activosNoAdmins = totalUsers - inactivos - admins;
    if (activosNoAdmins < 0) activosNoAdmins = 0;

    const userPie = [
      { name: "Administradores", value: admins },
      { name: "Inactivos", value: inactivos },
      { name: "Activos (no-admins)", value: activosNoAdmins },
    ];

    const USER_COLORS = ["#FFC107", "#F44336", "#4CAF50"];

    /* ---------- GROUPS ---------- */
    const totalGroups = safeNum(metrics?.generalMetrics?.group_total);
    const deletedGroups = safeNum(metrics?.generalMetrics?.group_deleted);
    let activeGroups = totalGroups - deletedGroups;
    if (activeGroups < 0) activeGroups = 0;

    const groupPie = [
      { name: "Activos", value: activeGroups },
      { name: "Inactivos", value: deletedGroups },
    ];

    const GROUP_COLORS = ["#4CAF50", "#F44336"];

    /* ---------- VISORES ---------- */
    const totalVisors = safeNum(metrics?.generalMetrics?.viewer_total);
    let publicVisors = safeNum(metrics?.generalMetrics?.viewer_public);
    let sharedVisors = safeNum(metrics?.generalMetrics?.viewer_shared);

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
  }, [metrics]);

  const pieLabel = ({ name, percent }) =>
    `${name} ${Math.round(percent * 100)}%`;

  return (
    <div className="statistics-dashboard">
      <section className="sd-body">

        <div className="sd-fullrow">
          <LineChart
            style={{ width: '100%', height: '100%', maxHeight: '40vh', aspectRatio: 1.618 }}
            responsive
            data={groupPieData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>

          <BarChart
            style={{ width: '100%', maxHeight: '40vh', aspectRatio: 1.618 }}
            responsive
            data={groupPieData}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
            <Bar dataKey="uv" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
          </BarChart>
        </div>

        <div className="sd-statics2">
          {/* ---------------- USERS ---------------- */}
          <div className="sd-column">
            <MetricCard
              icon="👥"
              title="Usuarios Totales"
              value={metrics?.generalMetrics?.user_total ?? 0}
            />
            <MetricCard icon="🟢" title="Activos" value={activeUsers} />
            <MetricCard icon="🛑" title="Inactivos" value={metrics?.generalMetrics?.user_disabled ?? 0} />
            <MetricCard icon="⭐" title="Administradores" value={metrics?.generalMetrics?.user_admin ?? 0} />

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
              value={metrics?.generalMetrics?.group_total ?? 0}
            />
            <MetricCard icon="🟢" title="Activos" value={activeGroups} />
            <MetricCard
              icon="🛑"
              title="Inactivos"
              value={metrics?.generalMetrics?.group_deleted ?? 0}
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
              value={metrics?.generalMetrics?.viewer_total ?? 0}
            />
            <MetricCard
              icon="🌍"
              title="Públicos"
              value={metrics?.generalMetrics?.viewer_public ?? 0}
            />
            <MetricCard
              icon="🤝"
              title="Compartidos"
              value={metrics?.generalMetrics?.viewer_shared ?? 0}
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

        </div>
      </section>
    </div>
  );
}

export default StatisticsDashboard;
