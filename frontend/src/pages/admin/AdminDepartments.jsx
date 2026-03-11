import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Building2, Plus, Edit, Trash2 } from "lucide-react";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    consultationFee: 0,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/departments");

      if (Array.isArray(res.data)) {
        setDepartments(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setDepartments(res.data.data);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        description: dept.description,
        consultationFee: dept.consultationFee,
      });
    } else {
      setEditingDept(null);
      setFormData({
        name: "",
        description: "",
        consultationFee: 0,
      });
    }

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, formData);
      } else {
        await api.post("/departments", formData);
      }

      setShowModal(false);
      fetchDepartments();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving department");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      alert(
        "Error deleting department (It might be linked to doctors or appointments)"
      );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Departments</h1>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </button>
      </div>

      {/* Departments */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(departments || []).map((dept) => (
            <div
              key={dept.id}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col justify-between hover:border-purple-500"
            >
              <div>
                <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                  <Building2 className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {dept.name}
                </h3>

                <p className="text-sm text-slate-400 mb-4">
                  {dept.description}
                </p>

                <div className="text-lg font-medium text-emerald-400 mb-6">
                  ${dept.consultationFee}
                </div>
              </div>

              <div className="flex gap-2 border-t border-slate-700 pt-4">
                <button
                  onClick={() => handleOpenModal(dept)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(dept.id)}
                  className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-red-400 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {departments.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
              No departments found
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60"
            onClick={() => setShowModal(false)}
          ></div>

          {/* Modal Box */}
          <div
            className="relative bg-slate-800 rounded-lg w-full max-w-lg p-6 border border-slate-700 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold text-white mb-4">
                {editingDept ? "Edit Department" : "Add Department"}
              </h3>

              <div className="space-y-4">

                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Name
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Description
                  </label>

                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-1">
                    Consultation Fee
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.consultationFee}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        consultationFee: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                  Save
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
