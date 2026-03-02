import { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const ADMINS = [
    { username: "aarav12ee", password: "waterbottle" },
    { username: "kajal", password: "kajal12kajal" },
];

function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [shake, setShake] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (ADMINS.some(a => a.username === username && a.password === password)) {
            sessionStorage.setItem("adminAuth", "true");
            onLogin();
        } else {
            setShake(true);
            toast.error("Invalid username or password!");
            setTimeout(() => setShake(false), 600);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
            fontFamily: "'Segoe UI', sans-serif"
        }}>
            <div style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "20px",
                padding: "48px 40px",
                width: "100%",
                maxWidth: "420px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                animation: shake ? "shake 0.5s ease" : "fadeIn 0.5s ease"
            }}>
                {/* Lock Icon */}
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "72px",
                        height: "72px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #a78bfa, #6366f1)",
                        fontSize: "32px",
                        marginBottom: "16px",
                        boxShadow: "0 8px 24px rgba(99,102,241,0.4)"
                    }}>🔐</div>
                    <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: "700", margin: 0 }}>Admin Access</h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "6px", fontSize: "14px" }}>
                        Enter your credentials to continue
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    {/* Username */}
                    <div style={{ marginBottom: "18px" }}>
                        <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter username"
                            autoComplete="username"
                            required
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "10px",
                                color: "#fff",
                                fontSize: "15px",
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border 0.2s"
                            }}
                            onFocus={e => e.target.style.border = "1px solid #a78bfa"}
                            onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.15)"}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "28px" }}>
                        <label style={{ display: "block", color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoComplete="current-password"
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 44px 12px 14px",
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    borderRadius: "10px",
                                    color: "#fff",
                                    fontSize: "15px",
                                    outline: "none",
                                    boxSizing: "border-box",
                                    transition: "border 0.2s"
                                }}
                                onFocus={e => e.target.style.border = "1px solid #a78bfa"}
                                onBlur={e => e.target.style.border = "1px solid rgba(255,255,255,0.15)"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "18px",
                                    color: "rgba(255,255,255,0.5)"
                                }}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "13px",
                            background: "linear-gradient(135deg, #a78bfa, #6366f1)",
                            border: "none",
                            borderRadius: "10px",
                            color: "#fff",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
                            transition: "transform 0.15s, box-shadow 0.15s"
                        }}
                        onMouseOver={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 28px rgba(99,102,241,0.5)"; }}
                        onMouseOut={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)"; }}
                    >
                        Login to Dashboard
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-10px); }
                    40% { transform: translateX(10px); }
                    60% { transform: translateX(-8px); }
                    80% { transform: translateX(8px); }
                }
            `}</style>
        </div>
    );
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => sessionStorage.getItem("adminAuth") === "true"
    );
    const [form, setForm] = useState({});
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pointsUpdate, setPointsUpdate] = useState({});
    const [linksUpdate, setLinksUpdate] = useState({});
    const [expandedLinks, setExpandedLinks] = useState({});

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
        if (isAuthenticated) fetchStudents();
    }, [isAuthenticated]);

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

    const toggleLinkEdit = (id, student) => {
        setExpandedLinks(prev => {
            const isOpen = prev[id];
            if (!isOpen) {
                // Pre-fill with existing values when opening
                setLinksUpdate(prev2 => ({
                    ...prev2,
                    [id]: { github: student.github || "", linkedin: student.linkedin || "" }
                }));
            }
            return { ...prev, [id]: !isOpen };
        });
    };

    const updateLinks = async (id) => {
        const links = linksUpdate[id];
        if (!links) return;
        try {
            await api.put(`/students/${id}`, { github: links.github, linkedin: links.linkedin });
            toast.success("Links Updated!");
            setExpandedLinks(prev => ({ ...prev, [id]: false }));
            fetchStudents();
        } catch (error) {
            toast.error("Error updating links");
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

    const handleLogout = () => {
        sessionStorage.removeItem("adminAuth");
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl" data-theme="dark">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 className="text-3xl font-bold text-primary">Admin Dashboard</h2>
                <button
                    onClick={handleLogout}
                    className="btn btn-outline btn-error btn-sm"
                >
                    🚪 Logout
                </button>
            </div>

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
                                    <th>Links</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <>
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
                                            <td>
                                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                                    {s.github ? <a href={s.github} target="_blank" rel="noreferrer" title={s.github} style={{ fontSize: "18px" }}>🐙</a> : <span style={{ opacity: 0.3, fontSize: "13px" }}>No GH</span>}
                                                    {s.linkedin ? <a href={s.linkedin} target="_blank" rel="noreferrer" title={s.linkedin} style={{ fontSize: "18px" }}>💼</a> : <span style={{ opacity: 0.3, fontSize: "13px" }}>No LI</span>}
                                                    <button
                                                        className={`btn btn-xs ${expandedLinks[s._id] ? "btn-warning" : "btn-info"}`}
                                                        onClick={() => toggleLinkEdit(s._id, s)}
                                                        title="Edit Links"
                                                    >
                                                        {expandedLinks[s._id] ? "✕ Close" : "✏️ Edit"}
                                                    </button>
                                                </div>
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
                                        {expandedLinks[s._id] && (
                                            <tr key={`${s._id}-links`} style={{ background: "rgba(99,102,241,0.08)" }}>
                                                <td colSpan={5}>
                                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", padding: "6px 0" }}>
                                                        <span style={{ fontWeight: 600, fontSize: "13px", opacity: 0.7 }}>🐙 GitHub:</span>
                                                        <input
                                                            className="input input-bordered input-sm"
                                                            style={{ flex: 1, minWidth: "200px" }}
                                                            placeholder="https://github.com/username"
                                                            value={linksUpdate[s._id]?.github || ""}
                                                            onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], github: e.target.value } }))}
                                                        />
                                                        <span style={{ fontWeight: 600, fontSize: "13px", opacity: 0.7 }}>💼 LinkedIn:</span>
                                                        <input
                                                            className="input input-bordered input-sm"
                                                            style={{ flex: 1, minWidth: "200px" }}
                                                            placeholder="https://linkedin.com/in/username"
                                                            value={linksUpdate[s._id]?.linkedin || ""}
                                                            onChange={e => setLinksUpdate(prev => ({ ...prev, [s._id]: { ...prev[s._id], linkedin: e.target.value } }))}
                                                        />
                                                        <button className="btn btn-sm btn-success" onClick={() => updateLinks(s._id)}>
                                                            💾 Save Links
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}