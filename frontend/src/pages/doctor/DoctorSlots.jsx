import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Plus, Trash2, Clock } from "lucide-react";
import dayjs from "dayjs";

const DoctorSlots = () => {
  const { user } = useAuth();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newDate, setNewDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [newStartTime, setNewStartTime] = useState("09:00");
  const [newEndTime, setNewEndTime] = useState("10:00");

  const [addError, setAddError] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchSlots();
    }
  }, [user]);

  const fetchSlots = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await api.get(`/doctor/${user.id}/slots`);

      if (Array.isArray(res.data)) {
        setSlots(res.data);
      } else {
        setSlots([]);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setAddError("");

    try {
      await api.post("/doctor/slots", {
        doctorId: user.id,
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
        available: true,
      });

      fetchSlots();
    } catch (error) {
      setAddError(error.response?.data?.message || "Failed to add slot");
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm("Delete this slot?")) return;

    try {
      await api.delete(`/doctor/slots/${id}`);
      fetchSlots();
    } catch (error) {
      alert("Cannot delete slot if it's booked or an error occurred.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        Manage Availability
      </h1>

      {/* Add Slot Form */}

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
        <h3 className="text-lg font-medium text-white mb-4">
          Add New Slot
        </h3>

        {addError && (
          <div className="mb-4 text-sm text-red-400 bg-red-900/20 p-3 rounded border border-red-800">
            {addError}
          </div>
        )}

        <form
          onSubmit={handleAddSlot}
          className="flex flex-col md:flex-row gap-4 items-end"
        >
          {/* Date */}

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Date
            </label>

            <input
              type="date"
              required
              min={dayjs().format("YYYY-MM-DD")}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-white"
            />
          </div>

          {/* Start Time */}

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Start Time
            </label>

            <input
              type="time"
              required
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-white"
            />
          </div>

          {/* End Time */}

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              End Time
            </label>

            <input
              type="time"
              required
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-white"
            />
          </div>

          {/* Button */}

          <button
            type="submit"
            className="w-full md:w-auto flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Slot
          </button>
        </form>
      </div>

      {/* Slots List */}

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-medium text-white">
            Your Upcoming Slots
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400">
            Loading...
          </div>
        ) : slots.length > 0 ? (
          <div className="divide-y divide-slate-700">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-700/50"
              >
                <div className="flex items-center gap-6">
                  {/* Date */}

                  <div className="text-slate-300 font-medium w-32">
                    {dayjs(slot.date).format("MMM D, YYYY")}
                  </div>

                  {/* Time */}

                  <div className="text-slate-400 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {slot.startTime?.substring(0, 5)} -
                    {slot.endTime?.substring(0, 5)}
                  </div>

                  {/* Status */}

                  <div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        slot.available
                          ? "bg-emerald-900/50 text-emerald-400"
                          : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {slot.available ? "Available" : "Booked"}
                    </span>
                  </div>
                </div>

                {/* Delete */}

                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  disabled={!slot.available}
                  className="text-slate-400 hover:text-red-400 disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            No slots created yet. Add availability above.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSlots;
