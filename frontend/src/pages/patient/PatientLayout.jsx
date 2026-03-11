import { Routes, Route } from 'react-router-dom';
import PatientSidebar from '../../components/patient/PatientSidebar';
import PatientDashboardHome from './PatientDashboardHome';
import PatientDoctors from './PatientDoctors';
import PatientAppointments from './PatientAppointments';

const PatientLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-900">
            <PatientSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Routes>
                        <Route path="/" element={<PatientDashboardHome />} />
                        <Route path="/doctors" element={<PatientDoctors />} />
                        <Route path="/appointments" element={<PatientAppointments />} />
                        <Route path="/history" element={<PatientAppointments />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default PatientLayout;
