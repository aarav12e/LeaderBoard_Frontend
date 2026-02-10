import { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const [form, setForm] = useState({});
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pointsUpdate, setPointsUpdate] = useState({});

    const fetchStudents = async () => {
        try {
            const res = await api.get("/students");
            setStudents(res.data);
        } catch (error) {
            console.error("Error fetching students", error);
            toast.error("Failed to fetch students");
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const submit = async () => {
        if (!form.roll || !form.name) return toast.error("Roll and Name are required!");

        try {
            await api.post("/students", form);
            toast.success("Student Added Successfully!");
            setForm({});
            fetchStudents();
        } catch (error) {
            toast.error("Error adding student");
        }
    };

    const updatePoints = async (id) => {
        const change = pointsUpdate[id];
        if (!change) return;

        try {
            await api.put(`/students/${id}`, { points: Number(change) });
            toast.success("Points Updated!");
            setPointsUpdate({ ...pointsUpdate, [id]: undefined });
            fetchStudents();
        } catch (error) {
            toast.error("Error updating points");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this student?")) return;
        try {
            await api.delete(`/students/${id}`);
            toast.success("Student Deleted");
            fetchStudents();
        } catch (error) {
            toast.error("Error deleting student");
        }
    };

    const seedData = async () => {
        const data = [
           
        ];
        if (!confirm("This will add all the sample data provided. Continue?")) return;
        try {
            setLoading(true);
            const loadingToast = toast.loading("Importing data...");
            for (let s of data) {
                await api.post("/students", {
                    roll: s.Roll,
                    name: s.name,
                    points: s.points,
                    linkedin: s.linkedin,
                    github: s.github
                });
            }
            toast.success("All data imported!", { id: loadingToast });
            fetchStudents();
        } catch (e) {
            toast.error("Error importing data: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl" data-theme="dark">
            <h2 className="text-3xl font-bold text-center mb-8 text-primary">Admin Dashboard</h2>

            {/* Search/Form Card */}
            <div className="card w-full bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <h2 className="card-title text-secondary">Add New Student</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="input input-bordered w-full" placeholder="Roll Number" value={form.roll || ""} onChange={e => setForm({ ...form, roll: e.target.value })} />
                        <input className="input input-bordered w-full" placeholder="Student Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
                        <input className="input input-bordered w-full" type="number" placeholder="Points" value={form.points || ""} onChange={e => setForm({ ...form, points: +e.target.value })} />
                        <input className="input input-bordered w-full" placeholder="LinkedIn URL" value={form.linkedin || ""} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
                        <input className="input input-bordered w-full md:col-span-2" placeholder="GitHub URL" value={form.github || ""} onChange={e => setForm({ ...form, github: e.target.value })} />
                    </div>
                    <div className="card-actions justify-end mt-4">
                        <button className="btn btn-primary" onClick={submit}>Add Student</button>
                        <button className="btn btn-secondary" onClick={seedData} disabled={loading}>
                            {loading ? "Importing..." : "Bulk Import Data"}
                        </button>
                    </div>
                </div>
            </div>

            {/* List Card */}
            <div className="card w-full bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-accent mb-4">Manage Students</h2>
                    <div className="overflow-x-auto h-96">
                        <table className="table table-pin-rows">
                            <thead>
                                <tr>
                                    <th>Name / Roll</th>
                                    <th>Current Points</th>
                                    <th>New Points</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s._id}>
                                        <td>
                                            <div className="font-bold">{s.name}</div>
                                            <div className="text-sm opacity-50">{s.roll}</div>
                                        </td>
                                        <td><span className="badge badge-lg">{s.points}</span></td>
                                        <td>
                                            <input
                                                type="number"
                                                placeholder="New"
                                                className="input input-bordered input-sm w-20"
                                                value={pointsUpdate[s._id] !== undefined ? pointsUpdate[s._id] : ""}
                                                onChange={e => setPointsUpdate({ ...pointsUpdate, [s._id]: e.target.value })}
                                            />
                                        </td>
                                        <td className="flex gap-2">
                                            <button className="btn btn-sm btn-success btn-square" onClick={() => updatePoints(s._id)} title="Save Points">
                                                💾
                                            </button>
                                            <button className="btn btn-sm btn-error btn-square" onClick={() => handleDelete(s._id)} title="Delete Student">
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}