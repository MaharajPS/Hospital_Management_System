import { useState, useEffect } from "react";
import api from "../../api/axios";
import dayjs from "dayjs";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const AdminDashboardHome = () => {

  const [appointmentsPerDoctor, setAppointmentsPerDoctor] = useState([]);
  const [revenuePerDepartment, setRevenuePerDepartment] = useState([]);
  const [dailyAppointments, setDailyAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {

    try {
      setLoading(true);

      const [docRes, revRes, dailyRes] = await Promise.all([
        api.get("/admin/reports/appointments-per-doctor"),
        api.get("/admin/reports/revenue-per-department"),
        api.get("/admin/reports/daily-appointments"),
      ]);

      setAppointmentsPerDoctor(
        Array.isArray(docRes.data) ? docRes.data : []
      );

      setRevenuePerDepartment(
        Array.isArray(revRes.data) ? revRes.data : []
      );

      const daily = Array.isArray(dailyRes.data) ? dailyRes.data : [];

      const sortedDaily = daily.sort(
        (a, b) => new Date(a.label) - new Date(b.label)
      );

      setDailyAppointments(sortedDaily);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }

  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading Analytics...
      </div>
    );
  }

  const totalRevenue = revenuePerDepartment.reduce(
    (sum, item) => sum + (item.revenue || 0),
    0
  );

  const totalAppointments = appointmentsPerDoctor.reduce(
    (sum, item) => sum + (item.count || 0),
    0
  );

  return (
    <div>

      <h1 className="text-2xl font-bold text-white mb-6">
        Hospital Analytics
      </h1>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <p className="text-sm text-slate-400">
            Total System Revenue
          </p>
          <p className="text-3xl font-bold text-emerald-400">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <p className="text-sm text-slate-400">
            Total Appointments
          </p>
          <p className="text-3xl font-bold text-blue-400">
            {totalAppointments}
          </p>
        </div>

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Bar Chart */}

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg text-white mb-4">
            Appointments per Doctor
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentsPerDoctor}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h3 className="text-lg text-white mb-4">
            Revenue per Department
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>

              <Pie
                data={revenuePerDepartment}
                dataKey="revenue"
                nameKey="label"
                outerRadius={100}
              >

                {revenuePerDepartment.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboardHome;
