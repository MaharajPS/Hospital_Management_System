import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
                api.get('/admin/reports/appointments-per-doctor'),
                api.get('/admin/reports/revenue-per-department'),
                api.get('/admin/reports/daily-appointments')
            ]);
            setAppointmentsPerDoctor(docRes.data);
            setRevenuePerDepartment(revRes.data);

            // Sort daily sequentially
            const sortedDaily = dailyRes.data.sort((a, b) => new Date(a.label) - new Date(b.label));
            setDailyAppointments(sortedDaily);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-slate-400">Loading Analytics...</div>;
    }

    // Calculate totals
    const totalRevenue = revenuePerDepartment.reduce((sum, item) => sum + item.revenue, 0);
    const totalAppointments = appointmentsPerDoctor.reduce((sum, item) => sum + item.count, 0);

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Hospital Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <p className="text-sm font-medium text-slate-400 mb-1">Total System Revenue</p>
                    <p className="text-3xl font-bold text-emerald-400">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <p className="text-sm font-medium text-slate-400 mb-1">Total Appointments</p>
                    <p className="text-3xl font-bold text-blue-400">{totalAppointments}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Appointments by Doctor Bar Chart */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <h3 className="text-lg font-medium text-white mb-6">Appointments per Doctor</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={appointmentsPerDoctor}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Bar dataKey="count" name="Appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue by Department Pie Chart */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                    <h3 className="text-lg font-medium text-white mb-6">Revenue per Department</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={revenuePerDepartment}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="revenue"
                                    nameKey="label"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {revenuePerDepartment.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `$${value}`}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Daily Appointments Line Chart */}
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 lg:col-span-2">
                    <h3 className="text-lg font-medium text-white mb-6">Daily Appointment Volume</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyAppointments}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false}
                                    tickFormatter={(val) => dayjs(val).format('MMM D')}
                                />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    labelFormatter={(val) => dayjs(val).format('MMMM D, YYYY')}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Line type="monotone" dataKey="count" name="Appointments" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboardHome;
