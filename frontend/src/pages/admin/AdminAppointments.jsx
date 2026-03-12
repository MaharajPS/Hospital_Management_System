import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Calendar, Clock, Slash } from "lucide-react";
import dayjs from "dayjs";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/appointments");

      if (Array.isArray(res.data)) {
        setAppointments(res.data);
      } else if (Array.isArray(res.data?.data)) {
        setAppointments(res.data.data);
      } else {
        setAppointments([]);
      }

    } catch (error) {
      console.error(error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    if (!window.confirm("As Admin, cancel this appointment?")) return;

    try {
      await api.put(`/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "BOOKED":
        return "bg-blue-900/50 text-blue-400 border-blue-800";
      case "CONFIRMED":
        return "bg-emerald-900/50 text-emerald-400 border-emerald-800";
      case "COMPLETED":
        return "bg-slate-700 text-slate-300 border-slate-600";
      case "CANCELLED":
        return "bg-red-900/50 text-red-400 border-red-800";
      default:
        return "bg-slate-800 text-slate-400";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        System Appointments
      </h1>

      {loading ? (
        <div className="text-center py-12 text-slate-400">
          Loading appointments...
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700 text-sm text-slate-300">
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-700/50">

                    <td className="p-4 text-white font-medium">
                      {apt.patient?.name || "-"}
                    </td>

                    <td className="p-4 text-slate-300">
                      Dr. {apt.doctor?.name || "-"}
                    </td>

                    <td className="p-4 text-slate-400 text-sm">
                      {apt.department?.name || "-"}
                    </td>

                    <td className="p-4 text-sm text-slate-300">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {apt.appointmentDate
                          ? dayjs(apt.appointmentDate).format("MMM D, YYYY")
                          : "-"}
                      </div>

                      <div className="flex items-center text-slate-400 mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {apt.startTime?.substring(0, 5)} -{" "}
                        {apt.endTime?.substring(0, 5)}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      {(apt.status === "BOOKED" ||
                        apt.status === "CONFIRMED") && (
                        <button
                          onClick={() => cancelAppointment(apt.id)}
                          className="px-2 py-1 bg-red-900/40 text-red-400 border border-red-800 rounded text-xs"
                        >
                          <Slash className="w-3 h-3 mr-1 inline" />
                          Cancel
                        </button>
                      )}
                    </td>

                  </tr>
                ))}

                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No appointments found.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
