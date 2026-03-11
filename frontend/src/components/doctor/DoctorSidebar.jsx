import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Calendar, Clock, LogOut, Activity } from 'lucide-react';

const DoctorSidebar = () => {
    const { pathname } = useLocation();
    const { logout, user } = useAuth();

    const links = [
        { to: '/doctor', label: 'Dashboard', icon: User },
        { to: '/doctor/slots', label: 'Manage Slots', icon: Clock },
        { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
    ];

    return (
        <div className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-slate-700">
                <Activity className="text-emerald-500 mr-2" />
                <span className="text-xl font-bold text-white">MedCare Docs</span>
            </div>

            <div className="p-4 border-b border-slate-700 flex items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0)}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-white">Dr. {user?.name}</p>
                    <p className="text-xs text-emerald-400">{user?.specialization}</p>
                </div>
            </div>

            <div className="flex-1 py-4 flex flex-col gap-1 px-3">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.to;
                    return (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? 'bg-emerald-600 text-white'
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

export default DoctorSidebar;
