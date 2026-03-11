import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Building2, Plus, Edit, Trash2 } from 'lucide-react';

const AdminDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);

    const [formData, setFormData] = useState({ name: '', description: '', consultationFee: 0 });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/departments');
            setDepartments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (dept = null) => {
        if (dept) {
            setEditingDept(dept);
            setFormData({ name: dept.name, description: dept.description, consultationFee: dept.consultationFee });
        } else {
            setEditingDept(null);
            setFormData({ name: '', description: '', consultationFee: 0 });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDept) {
                await api.put(`/departments/${editingDept.id}`, formData);
            } else {
                await api.post('/departments', formData);
            }
            setShowModal(false);
            fetchDepartments();
        } catch (error) {
            alert(error.response?.data?.error || "Error saving department");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        try {
            await api.delete(`/departments/${id}`);
            fetchDepartments();
        } catch (error) {
            alert("Error deleting department (It might be linked to existing doctors/appointments)");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Manage Departments</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Department
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {departments.map((dept) => (
                        <div key={dept.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col justify-between hover:border-purple-500 transition-colors">
                            <div>
                                <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{dept.name}</h3>
                                <p className="text-sm text-slate-400 mb-4 line-clamp-3">{dept.description}</p>
                                <div className="text-lg font-medium text-emerald-400 mb-6">
                                    ${dept.consultationFee} <span className="text-xs text-slate-500 font-normal">/ consultation</span>
                                </div>
                            </div>

                            <div className="flex gap-2 border-t border-slate-700 pt-4 mt-auto">
                                <button
                                    onClick={() => handleOpenModal(dept)}
                                    className="flex-1 flex items-center justify-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded transition-colors"
                                >
                                    <Edit className="w-4 h-4 mr-2 text-slate-300" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="flex items-center justify-center px-3 py-2 bg-slate-700 hover:bg-slate-600 focus:ring-red-500 text-red-400 hover:text-red-300 text-sm font-medium rounded transition-colors"
                                    title="Delete Department"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {departments.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
                            <p className="text-slate-400">No departments found.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                        <div className="inline-block align-bottom bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700">
                                <form onSubmit={handleSubmit}>
                                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <h3 className="text-lg leading-6 font-semibold text-white mb-4">
                                            {editingDept ? 'Edit Department' : 'Add New Department'}
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                                                <textarea
                                                    required
                                                    rows="3"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-1">Consultation Fee ($)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                    value={formData.consultationFee}
                                                    onChange={(e) => setFormData({ ...formData, consultationFee: parseFloat(e.target.value) || 0 })}
                                                    className="w-full px-3 py-2 border border-slate-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                <div className="bg-slate-800/80 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-700">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDepartments;
