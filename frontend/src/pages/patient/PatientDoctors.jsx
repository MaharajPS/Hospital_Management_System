import { useState, useEffect } from "react";
import api from "../../api/axios";
import { UserSearch, Star } from "lucide-react";
import BookAppointmentModal from "./BookAppointmentModal";

const PatientDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [bookingDoctor, setBookingDoctor] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [selectedDept]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");

      if (Array.isArray(res.data)) {
        setDepartments(res.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const url = selectedDept
        ? `/doctors?departmentId=${selectedDept}`
        : "/doctors";

      const res = await api.get(url);

      if (Array.isArray(res.data)) {
        setDoctors(res.data);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = (doctors || []).filter((doc) => {
    const name = doc.name?.toLowerCase() || "";
    const specialization = doc.specialization?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return name.includes(search) || specialization.includes(search);
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Find a Doctor</h1>

      {/* Search + Filter */}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <UserSearch className="h-5 w-5 text-slate-400" />
          </div>

          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg bg-slate-800 text-slate-100"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="block w-full py-2 border-slate-600 rounded-lg bg-slate-800 text-slate-100"
          >
            <option value="">All Departments</option>

            {(departments || []).map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-slate-400">Loading doctors...</p>
        </div>
      ) : filteredDoctors.length > 0 ? (

        /* Doctors Grid */

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-slate-800 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors"
            >
              <div className="p-6 text-center border-b border-slate-700">
                <div className="w-20 h-20 mx-auto bg-blue-900 rounded-full flex items-center justify-center text-blue-200 text-2xl font-bold mb-4">
                  {doctor.name?.charAt(0) || "D"}
                </div>

                <h3 className="text-lg font-medium text-white">
                  {doctor.name}
                </h3>

                <p className="text-sm text-blue-400">
                  {doctor.specialization}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {doctor.department?.name || "Department"}
                </p>
              </div>

              <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm text-slate-300">4.8</span>
                </div>

                <button
                  onClick={() => setBookingDoctor(doctor)}
                  className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>

      ) : (

        /* No Doctors */

        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-400">
            No doctors found matching your criteria.
          </p>
        </div>

      )}

      {/* Booking Modal */}

      {bookingDoctor && (
        <BookAppointmentModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
        />
      )}
    </div>
  );
};

export default PatientDoctors;
