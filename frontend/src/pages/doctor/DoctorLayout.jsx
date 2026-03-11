import { Routes, Route } from 'react-router-dom';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import DoctorDashboardHome from './DoctorDashboardHome';
import DoctorSlots from './DoctorSlots';
import DoctorAppointments from './DoctorAppointments';

const DoctorLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-900">
            <DoctorSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Routes>
                        <Route path="/" element={<DoctorDashboardHome />} />
                        <Route path="/slots" element={<DoctorSlots />} />
                        <Route path="/appointments" element={<DoctorAppointments />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default DoctorLayout;
