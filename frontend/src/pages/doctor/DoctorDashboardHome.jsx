import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorDashboardHome = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Dr. {user?.name}</h1>
            <p className="text-slate-400 mb-8">Manage your schedule and upcoming patient consultations.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex items-start">
                    <div className="bg-emerald-900/50 p-3 rounded-lg mr-4">
                        <Clock className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">Manage Slots</h3>
                        <p className="text-sm text-slate-400 mb-4">Set your availability calendar to allow patients to book appointments.</p>
                        <Link to="/doctor/slots" className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">
                            Update Availability &rarr;
                        </Link>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex items-start">
                    <div className="bg-blue-900/50 p-3 rounded-lg mr-4">
                        <Calendar className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white mb-1">Upcoming Appointments</h3>
                        <p className="text-sm text-slate-400 mb-4">View today's schedule and confirm or complete appointments.</p>
                        <Link to="/doctor/appointments" className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                            View Appointments &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboardHome;
