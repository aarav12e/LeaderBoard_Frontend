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
            { Roll: "0245CYBS019", name: "Prince", points: 20, linkedin: "https://www.linkedin.com/in/prince-kumar-04b443367?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/Prince-3103" },
            { Roll: "0255CDS020", name: "Nikhil kumar", points: 20, linkedin: "https://linkedin.com/in/nikhil-kumar08", github: "https://github.com/nikhilkumar609" },
            { Roll: "0245CSE005", name: "Shayef Kabir", points: 20, linkedin: "http://www.linkedin.com/in/shayef-kabir-b853b0372", github: "https://github.com/shayefkabir2005" },
            { Roll: "0255CYBS027", name: "Bhavishya ", points: 20, linkedin: "https://in.linkedin.com/in/bhavishya-rajput-56a225399", github: "https://github.com/Deon-Wertz" },
            { Roll: "0255CDS015", name: "Muskan Bharti", points: 20, linkedin: "https://www.linkedin.com/in/muskan-bharti-b9166a3a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/muskan-0228" },
            { Roll: "0255CSE036", name: "Priyanka Kumari", points: 20, linkedin: "https://www.linkedin.com/in/priyanka-kumari-5354443a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/Priyanka-798" },
            { Roll: "0255CSE031", name: "Anupam Kumari", points: 20, linkedin: "https://www.linkedin.com/in/anupam-kumari-8167aa3a8?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/anupamguptaji123-droid" },
            { Roll: "0255CSE015", name: "Uma", points: 19, linkedin: "https://www.linkedin.com/in/uma-bharti-2142923a9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/uma1529-design" },
            { Roll: "0255CSE022", name: "Ikra", points: 16, linkedin: "https://www.linkedin.com/in/ikra-choudhary-2757713aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/Ikraera" },
            { Roll: "0245CSE031", name: "Anoop Kumar", points: 10, linkedin: "https://www.linkedin.com/in/anup-kumar-642562395?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/voexenz0" },
            { Roll: "0245CDS043", name: "Riya Kumari", points: 10, linkedin: "https://www.linkedin.com/in/riya-singh-703142353?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/riyasingh41996-ctrl" },
            { Roll: "0255CDS025", name: "Satyam Kumar", points: 10, linkedin: "https://www.linkedin.com/in/satyam-kumar-5b5167384?utm_source=share_via&utm_content=profile&utm_medium=member_android", github: "https://github.com/satyamkmr18" },
            { Roll: "0255CSE001", name: "Harsh Gautam", points: 10, linkedin: "https://www.linkedin.com/in/harsh-gautam-b340b13a9?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/harshgautam8" },
            { Roll: "0255CSE059", name: "Raj Maurya", points: 6, linkedin: "https://www.linkedin.com/in/hacker-undefined-08838b385?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "https://github.com/hacker44401" },
            { Roll: "0255CSE039", name: "Antriksh Arya", points: 5, linkedin: "", github: "https://github.com/antriksharyagrd-a11y" },
            { Roll: "0255BBA068", name: "Prema Jaiswal", points: 5, linkedin: "https://www.linkedin.com/in/prema-jaiswal-836658296?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", github: "" },
            { Roll: "0255CDS026", name: "Nisha Bharti ", points: 4, linkedin: "", github: "https://github.com/Nisha77-git" },
            { Roll: "0255CDS035", name: "Prachi Kumari", points: 1, linkedin: "", github: "" },
            { Roll: "0255EEE004", name: "Tushar Jaiswal", points: 1, linkedin: "", github: "" },
            { Roll: "0255CDS020", name: "Chikki Kumari", points: 1, linkedin: "", github: "" },
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