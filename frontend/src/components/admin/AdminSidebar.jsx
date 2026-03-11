import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Building2, Calendar, LogOut, ShieldCheck } from 'lucide-react';

const AdminSidebar = () => {
    const { pathname } = useLocation();
    const { logout, user } = useAuth();

    const links = [
        { to: '/admin', label: 'Analytics Dashboard', icon: LayoutDashboard },
        { to: '/admin/departments', label: 'Departments', icon: Building2 },
        { to: '/admin/users', label: 'Users & Doctors', icon: Users },
        { to: '/admin/appointments', label: 'All Appointments', icon: Calendar },
    ];

    return (
        <div className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-700">
                <ShieldCheck className="text-purple-500 mr-2" />
                <span className="text-xl font-bold text-white">MedCare Admin</span>
            </div>

            <div className="p-4 border-b border-slate-700 flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0)}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-purple-400">Administrator</p>
                </div>
            </div>

            <div className="flex-1 py-4 flex flex-col gap-1 px-3">
                {links.map((link) => {
                    const Icon = link.icon;
                    let isActive = pathname === link.to;
                    if (link.to !== '/admin' && pathname.startsWith(link.to)) {
                        isActive = true;
                    }

                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-purple-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-3 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
