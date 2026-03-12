import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Plus, Edit, Trash2 } from "lucide-react";

const AdminUsers = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "PATIENT",
    specialization: "",
    departmentId: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {

      const res = await api.get("/admin/users");
      setUsers(res.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingUser) {

        await api.put(`/admin/users/${editingUser.id}`, formData);

      } else {

        await api.post("/admin/users", formData);

      }

      setShowModal(false);
      fetchUsers();

    } catch (err) {
      alert("Operation failed");
    }
  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    await api.delete(`/admin/users/${id}`);

    fetchUsers();
  };

  const admins = users.filter(u => u.role === "ADMIN");
  const doctors = users.filter(u => u.role === "DOCTOR");
  const patients = users.filter(u => u.role === "PATIENT");

  const Table = ({ title, data }) => (
    <div className="mb-8">

      <h2 className="text-lg text-white mb-3">{title}</h2>

      <table className="w-full bg-slate-800">

        <thead className="bg-slate-900 text-slate-300">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>

          {data.map(u => (

            <tr key={u.id} className="border-t border-slate-700">

              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>

              <td className="p-3 text-right space-x-2">

                <button
                  onClick={()=>{
                    setEditingUser(u);
                    setFormData(u);
                    setShowModal(true);
                  }}
                  className="text-blue-400"
                >
                  <Edit size={16}/>
                </button>

                <button
                  onClick={()=>deleteUser(u.id)}
                  className="text-red-400"
                >
                  <Trash2 size={16}/>
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );

  return (

    <div>

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl text-white font-bold">
          User Management
        </h1>

        <button
          onClick={()=>{

            setEditingUser(null);
            setShowModal(true);

          }}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded"
        >
          <Plus size={16}/>
          Add User
        </button>

      </div>

      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : (
        <>
          <Table title="Admins" data={admins}/>
          <Table title="Doctors" data={doctors}/>
          <Table title="Patients" data={patients}/>
        </>
      )}

      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">

          <div className="bg-slate-800 p-6 rounded w-96">

            <h3 className="text-white mb-4">
              {editingUser ? "Edit User" : "Add User"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                placeholder="Name"
                className="w-full p-2 bg-slate-700"
                value={formData.name}
                onChange={(e)=>setFormData({...formData,name:e.target.value})}
              />

              <input
                placeholder="Email"
                className="w-full p-2 bg-slate-700"
                value={formData.email}
                onChange={(e)=>setFormData({...formData,email:e.target.value})}
              />

              {!editingUser && (
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-2 bg-slate-700"
                  value={formData.password}
                  onChange={(e)=>setFormData({...formData,password:e.target.value})}
                />
              )}

              <select
                className="w-full p-2 bg-slate-700"
                value={formData.role}
                onChange={(e)=>setFormData({...formData,role:e.target.value})}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="DOCTOR">DOCTOR</option>
                <option value="PATIENT">PATIENT</option>
              </select>

              <button className="bg-green-600 w-full py-2 rounded">
                Save
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminUsers;