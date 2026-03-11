import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, CheckCircle, Info } from 'lucide-react';
import dayjs from 'dayjs';

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/doctor/appointments');
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, action) => {
        try {
            await api.put(`/appointments/${id}/${action}`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.error || `Failed to ${action} appointment`);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Cancel this appointment?")) return;
        try {
            await api.put(`/appointments/${id}/cancel`);
            fetchAppointments();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to cancel");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'BOOKED': return 'bg-blue-900/50 text-blue-400 border border-blue-800';
            case 'CONFIRMED': return 'bg-emerald-900/50 text-emerald-400 border border-emerald-800';
            case 'COMPLETED': return 'bg-slate-700 text-slate-300 border border-slate-600';
            case 'CANCELLED': return 'bg-red-900/50 text-red-400 border border-red-800';
            default: return 'bg-slate-800 text-slate-400';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Patient Appointments</h1>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    <p className="mt-2 text-slate-400">Loading appointments...</p>
                </div>
            ) : appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-slate-700 p-3 rounded-full hidden sm:block">
                                    <span className="text-lg font-bold text-white uppercase">{apt.patient?.name?.charAt(0)}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{apt.patient?.name}</h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-300">
                                        <span className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                                            {dayjs(apt.appointmentDate).format('MMM D, YYYY')}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1 text-slate-500" />
                                            {apt.startTime.substring(0, 5)} - {apt.endTime.substring(0, 5)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium w-full sm:w-auto text-center ${getStatusColor(apt.status)}`}>
                                    {apt.status}
                                </span>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    {apt.status === 'BOOKED' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(apt.id, 'confirm')}
                                                className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded transition-colors"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => handleCancel(apt.id)}
                                                className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-red-400 text-sm font-medium rounded transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {apt.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => handleUpdateStatus(apt.id, 'complete')}
                                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            Mark Completed
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-800 rounded-lg border border-slate-700">
                    <Info className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-1">No appointments</h3>
                    <p className="text-slate-400">You don't have any appointments booked yet.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
