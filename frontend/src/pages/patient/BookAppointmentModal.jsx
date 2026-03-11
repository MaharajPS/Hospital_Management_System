import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { X, Calendar, Clock, Banknote } from 'lucide-react';
import dayjs from 'dayjs';

const BookAppointmentModal = ({ doctor, onClose }) => {
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSlots();
    }, [selectedDate]);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/doctors/${doctor.id}/slots?date=${selectedDate}`);
            setSlots(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load slots');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!selectedSlot) return;
        try {
            setBooking(true);
            setError('');
            await api.post('/appointments/book', {
                doctorId: doctor.id,
                appointmentDate: selectedSlot.date,
                startTime: selectedSlot.startTime,
                endTime: selectedSlot.endTime
            });
            setSuccess('Appointment booked successfully!');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to book appointment');
        } finally {
            setBooking(false);
        }
    };

    // Generate next 7 days for the date picker
    const upcomingDays = Array.from({ length: 7 }).map((_, i) => dayjs().add(i, 'day').format('YYYY-MM-DD'));

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl leading-6 font-semibold text-white" id="modal-title">
                                    Book Appointment
                                </h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    with Dr. {doctor.name} ({doctor.specialization})
                                </p>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="mt-6">
                            {error && <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 px-3 py-2 rounded text-sm">{error}</div>}
                            {success && <div className="mb-4 bg-green-900/50 border border-green-500 text-green-200 px-3 py-2 rounded text-sm">{success}</div>}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300 mb-2">Select Date</label>
                                <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                                    {upcomingDays.map((date) => (
                                        <button
                                            key={date}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex-shrink-0 px-4 py-2 rounded-md border text-sm font-medium ${selectedDate === date
                                                ? 'bg-blue-600 border-blue-500 text-white'
                                                : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                                                }`}
                                        >
                                            <div className="text-xs opacity-75">{dayjs(date).format('ddd')}</div>
                                            <div>{dayjs(date).format('MMM D')}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Available Time Slots</label>
                                {loading ? (
                                    <div className="text-center py-4 text-slate-400">Loading slots...</div>
                                ) : slots.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-3">
                                        {slots.filter(s => s.available).map((slot) => (
                                            <button
                                                key={slot.id}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center border ${selectedSlot?.id === slot.id
                                                    ? 'bg-blue-600 border-blue-500 text-white'
                                                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                                                    }`}
                                            >
                                                {slot.startTime.substring(0, 5)}
                                            </button>
                                        ))}
                                        {slots.filter(s => s.available).length === 0 && (
                                            <div className="col-span-3 text-center py-4 text-slate-400 bg-slate-800/50 rounded-md border border-slate-700">
                                                No available slots for this date.
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-slate-400 bg-slate-800/50 rounded-md border border-slate-700 mt-2">
                                        No slots scheduled for this date.
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center text-sm">
                                <div className="flex items-center text-slate-300">
                                    <Banknote className="h-4 w-4 mr-1 text-slate-400" />
                                    Consultation Fee:
                                </div>
                                <div className="font-semibold text-white">
                                    ${doctor.department?.consultationFee || '0.00'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-slate-800/80 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-700">
                        <button
                            type="button"
                            disabled={!selectedSlot || booking || success}
                            onClick={handleBook}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-800 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition-colors"
                        >
                            {booking ? 'Booking...' : 'Confirm Booking'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointmentModal;
