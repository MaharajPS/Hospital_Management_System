import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminDashboardHome from './AdminDashboardHome';
import AdminDepartments from './AdminDepartments';
import AdminUsers from './AdminUsers';
import AdminAppointments from './AdminAppointments';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-900">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <Routes>
                        <Route path="/" element={<AdminDashboardHome />} />
                        <Route path="/departments" element={<AdminDepartments />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/appointments" element={<AdminAppointments />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
