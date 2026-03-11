import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';

const DoctorSlots = () => {
    const { user } = useAuth();
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newDate, setNewDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [newStartTime, setNewStartTime] = useState('09:00');
    const [newEndTime, setNewEndTime] = useState('10:00');
    const [addError, setAddError] = useState('');

    useEffect(() => {
        fetchSlots();
    }, [user]);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/doctor/${user.id}/slots`);
            setSlots(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async (e) => {
        e.preventDefault();
        setAddError('');
        try {
            await api.post('/doctor/slots', {
                doctorId: user.id,
                date: newDate,
                startTime: newStartTime,
                endTime: newEndTime,
                available: true
            });
            fetchSlots();
            // Optional: don't clear form to allow rapid adding of next slot (e.g., 10:00 to 11:00)
        } catch (error) {
            setAddError(error.response?.data?.error || 'Failed to add slot');
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm("Delete this slot?")) return;
        try {
            await api.delete(`/doctor/slots/${id}`);
            fetchSlots();
        } catch (error) {
            alert("Cannot delete slot if it's already booked or error occurred.");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Manage Availability</h1>

            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
                <h3 className="text-lg font-medium text-white mb-4">Add New Slot</h3>
                {addError && <div className="mb-4 text-sm text-red-400 bg-red-900/20 p-3 rounded border border-red-800">{addError}</div>}

                <form onSubmit={handleAddSlot} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full relative">
                        {/* Note input type date sets default browser calendar UI */}
                        <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                        <input
                            type="date"
                            required
                            min={dayjs().format('YYYY-MM-DD')}
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm custom-date-input"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
                        <input
                            type="time"
                            required
                            value={newStartTime}
                            onChange={(e) => setNewStartTime(e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm custom-date-input"
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-300 mb-1">End Time</label>
                        <input
                            type="time"
                            required
                            value={newEndTime}
                            onChange={(e) => setNewEndTime(e.target.value)}
                            className="block w-full px-3 py-2 border border-slate-600 rounded-md leading-5 bg-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm custom-date-input"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Slot
                    </button>
                </form>
            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                    <h3 className="text-lg font-medium text-white">Your Upcoming Slots</h3>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-slate-400">Loading...</div>
                ) : slots.length > 0 ? (
                    <div className="divide-y divide-slate-700">
                        {slots.map((slot) => (
                            <div key={slot.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="text-slate-300 font-medium w-28">
                                        {dayjs(slot.date).format('MMM D, YYYY')}
                                    </div>
                                    <div className="text-slate-400 flex items-center">
                                        <Clock className="w-4 h-4 mr-2 text-slate-500" />
                                        {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                                    </div>
                                    <div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${slot.available
                                            ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800'
                                            : 'bg-slate-700 text-slate-400 border border-slate-600'
                                            }`}>
                                            {slot.available ? 'Available' : 'Booked'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    disabled={!slot.available}
                                    className="text-slate-400 hover:text-red-400 disabled:opacity-50 disabled:hover:text-slate-400 transition-colors"
                                    title={!slot.available ? "Cannot delete booked slot" : "Delete slot"}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400">
                        No slots created yet. Add your availability above.
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorSlots;
