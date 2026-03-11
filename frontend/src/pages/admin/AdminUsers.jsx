import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { User, ShieldAlert, Activity } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users'); // Note: We need this endpoint in backend!
            // In this demo, we might not have a generic /users endpoint built, so let's fetch doctors 
            // instead, or simulate user list if /admin/users doesn't exist.
            // Wait, we built UserController: `GET /api/admin/users`
            // Let's use it.
            setUsers(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ADMIN': return <ShieldAlert className="w-5 h-5 text-purple-400" />;
            case 'DOCTOR': return <Activity className="w-5 h-5 text-emerald-400" />;
            case 'PATIENT': return <User className="w-5 h-5 text-blue-400" />;
            default: return <User className="w-5 h-5 text-slate-400" />;
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-900/50 text-purple-400 border-purple-800';
            case 'DOCTOR': return 'bg-emerald-900/50 text-emerald-400 border-emerald-800';
            case 'PATIENT': return 'bg-blue-900/50 text-blue-400 border-blue-800';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading users...</div>
            ) : (
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-700 text-sm font-medium text-slate-300">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Specialization (Doctor)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 flex items-center gap-3 text-white font-medium">
                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs">
                                                {u.name.charAt(0)}
                                            </div>
                                            {u.name}
                                        </td>
                                        <td className="p-4 text-slate-300">{u.email}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(u.role)}
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getRoleColor(u.role)}`}>
                                                    {u.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {u.role === 'DOCTOR' ? (u.specialization || '-') : '-'}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-slate-400">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
