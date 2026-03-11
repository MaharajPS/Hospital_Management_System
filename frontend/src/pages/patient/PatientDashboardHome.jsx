import { useAuth } from '../../context/AuthContext';
import { Calendar, UserSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboardHome = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-slate-400 mb-8">Here is what's happening with your health management.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex items-start">
                    <div className="bg-blue-900/50 p-3 rounded-lg mr-4">
                        <UserSearch className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">Find a Doctor</h3>
                        <p className="text-sm text-slate-400 mb-4">Search through our specialist doctors and book a consultation.</p>
                        <Link to="/patient/doctors" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                            Browse Doctors &rarr;
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex items-start">
                    <div className="bg-emerald-900/50 p-3 rounded-lg mr-4">
                        <Calendar className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">My Appointments</h3>
                        <p className="text-sm text-slate-400 mb-4">View and manage your upcoming and past medical appointments.</p>
                        <Link to="/patient/appointments" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                            View Schedule &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboardHome;
