import { useState, useEffect } from "react";
import api from "../../api/axios";
import { X, Banknote } from "lucide-react";
import dayjs from "dayjs";

const BookAppointmentModal = ({ doctor, onClose }) => {

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (doctor?.id) {
      fetchSlots();
    }
  }, [selectedDate]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        `/doctor/${doctor.id}/slots?date=${selectedDate}`
      );

      if (Array.isArray(res.data)) {
        setSlots(res.data);
      } else if (Array.isArray(res.data.data)) {
        setSlots(res.data.data);
      } else {
        setSlots([]);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {

    if (!selectedSlot) return;

    try {
      setBooking(true);
      setError("");

      await api.post("/appointments/book", {
        doctorId: doctor.id,
        appointmentDate: selectedSlot.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });

      setSuccess("Appointment booked successfully!");

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setBooking(false);
    }
  };

  const upcomingDays = Array.from({ length: 7 }).map((_, i) =>
    dayjs().add(i, "day").format("YYYY-MM-DD")
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}

      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      ></div>

      {/* Modal */}

      <div
        className="relative bg-slate-800 rounded-lg w-full max-w-lg p-6 border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}

        <div className="flex justify-between items-center mb-4">

          <div>
            <h2 className="text-xl font-semibold text-white">
              Book Appointment
            </h2>

            <p className="text-sm text-slate-400">
              Dr. {doctor?.name} ({doctor?.specialization})
            </p>
          </div>

          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>

        </div>

        {/* Error */}

        {error && (
          <div className="mb-3 text-red-400 text-sm">{error}</div>
        )}

        {success && (
          <div className="mb-3 text-green-400 text-sm">{success}</div>
        )}

        {/* Date selector */}

        <div className="mb-4">

          <label className="text-sm text-slate-300">
            Select Date
          </label>

          <div className="flex gap-2 mt-2 overflow-x-auto">

            {upcomingDays.map((date) => (

              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                }}
                className={`px-3 py-2 rounded border text-sm ${
                  selectedDate === date
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-700 border-slate-600"
                }`}
              >
                {dayjs(date).format("MMM D")}
              </button>

            ))}

          </div>

        </div>

        {/* Slots */}

        <div>

          <label className="text-sm text-slate-300">
            Available Slots
          </label>

          {loading ? (

            <p className="text-slate-400 mt-2">Loading...</p>

          ) : slots.filter(s => s.available).length > 0 ? (

            <div className="grid grid-cols-3 gap-2 mt-2">

              {slots
                .filter(s => s.available)
                .map(slot => (

                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 rounded text-sm ${
                    selectedSlot?.id === slot.id
                      ? "bg-blue-600"
                      : "bg-slate-700"
                  }`}
                >
                  {slot.startTime?.substring(0,5)}
                </button>

              ))}

            </div>

          ) : (

            <p className="text-slate-400 mt-2">
              No slots available
            </p>

          )}

        </div>

        {/* Fee */}

        <div className="mt-5 flex justify-between text-sm border-t border-slate-700 pt-3">

          <span className="flex items-center text-slate-300">
            <Banknote className="w-4 h-4 mr-1" />
            Consultation Fee
          </span>

          <span className="text-white font-semibold">
            ${doctor?.department?.consultationFee ?? "0.00"}
          </span>

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 rounded"
          >
            Cancel
          </button>

          <button
            disabled={!selectedSlot || booking || success}
            onClick={handleBook}
            className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
          >
            {booking ? "Booking..." : "Confirm"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default BookAppointmentModal;
