import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, MapPin, XCircle } from 'lucide-react';
import dayjs from 'dayjs';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/appointments/my');
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await api.put(`/appointments/${id}/cancel`);
            fetchAppointments();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Failed to cancel appointment");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'BOOKED': return 'bg-blue-900/50 text-blue-400 border-blue-800';
            case 'CONFIRMED': return 'bg-green-900/50 text-green-400 border-green-800';
            case 'COMPLETED': return 'bg-slate-800 text-slate-400 border-slate-700';
            case 'CANCELLED': return 'bg-red-900/50 text-red-400 border-red-800';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">My Appointments</h1>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="mt-2 text-slate-400">Loading appointments...</p>
                </div>
            ) : appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-slate-800 border border-slate-700 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start md:items-center gap-4">
                                <div className="bg-blue-900/50 p-3 rounded-full hidden sm:block">
                                    <Calendar className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Dr. {apt.doctor?.name}</h3>
                                    <p className="text-sm text-slate-400">{apt.department?.name}</p>

                                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-300">
                                        <span className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1 text-slate-500" />
                                            {dayjs(apt.appointmentDate).format('MMMM D, YYYY')}
                                        </span>
                                        <span className="flex items-center">
                                            <Clock className="h-4 w-4 mr-1 text-slate-500" />
                                            {apt.startTime.substring(0, 5)} - {apt.endTime.substring(0, 5)}
                                        </span>
                                        <span className="flex items-center text-blue-400">
                                            ${apt.consultationFee}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:items-end gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(apt.status)} inline-block text-center`}>
                                    {apt.status}
                                </span>

                                {apt.status === 'BOOKED' && (
                                    <button
                                        onClick={() => cancelAppointment(apt.id)}
                                        className="flex items-center justify-center text-sm text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-slate-800 rounded-lg border border-slate-700">
                    <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-white mb-1">No appointments yet</h3>
                    <p className="text-slate-400">You don't have any appointments scheduled.</p>
                </div>
            )}
        </div>
    );
};

export default PatientAppointments;
