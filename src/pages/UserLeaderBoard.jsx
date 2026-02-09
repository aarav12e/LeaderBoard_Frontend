import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function UserLeaderboard() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [showWelcome, setShowWelcome] = useState(true);

    useEffect(() => {
        api.get("/students").then(res => setData(res.data));
    }, []);

    const handleEnter = () => {
        // Voice Effect
        const speech = new SpeechSynthesisUtterance("Welcome to Ignite Club BugByte");
        window.speechSynthesis.speak(speech);

        // Fade out
        setTimeout(() => setShowWelcome(false), 500);
    };

    const filtered = data.filter(s =>
        s.roll.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-base-200" data-theme="cyberpunk">

            {/* Welcome Screen Overlay */}
            {showWelcome && (
                <div className="fixed inset-0 z-50 bg-base-100 flex items-center justify-center transition-opacity duration-500"
                    style={{ opacity: showWelcome ? 1 : 0 }}>
                    <div className="hero min-h-screen bg-base-200">
                        <div className="hero-content text-center">
                            <div className="max-w-md">
                                <h1 className="text-5xl font-bold text-primary mb-4">Welcome to</h1>
                                <p className="py-6 text-2xl font-bold">
                                    IGNITE CLUB - BUGBYTE <span className="emoji text-4xl">🎉</span> <span className="emoji text-4xl">🎈</span>
                                </p>
                                <button className="btn btn-primary btn-lg rounded-full shadow-lg hover:scale-105 transition-transform" onClick={handleEnter}>
                                    Click to Enter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 container mx-auto p-4 md:p-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">VISHVESHWARYA GROUP OF INSTITUTION</h1>
                    <h2 className="text-2xl md:text-3xl font-semibold text-secondary">IGNITE CLUB - BUGBYTE</h2>
                </div>

                <div className="flex justify-center mb-8">
                    <input
                        type="text"
                        placeholder="🔍 Search by Roll Number or Name..."
                        className="input input-bordered input-primary w-full max-w-md shadow-md focus:shadow-xl transition-shadow"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto shadow-2xl rounded-lg bg-base-100 border border-base-300">
                    <table className="table table-zebra w-full table-lg">
                        {/* head */}
                        <thead className="bg-neutral text-neutral-content text-lg">
                            <tr>
                                <th className="text-center">Rank</th>
                                <th className="text-center">Roll No</th>
                                <th>Name</th>
                                <th className="text-center">Point</th>
                                <th className="text-center">LinkedIn</th>
                                <th className="text-center">GitHub</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => (
                                <tr key={item._id} className="hover:bg-base-200 transition-colors">
                                    <td className="text-center">
                                        <div className={`badge ${item.rank === 1 ? 'badge-warning p-3' : item.rank === 2 ? 'badge-secondary p-3' : item.rank === 3 ? 'badge-accent p-3' : 'badge-ghost'} font-bold`}>
                                            {item.rank === 1 ? '🥇 1' : item.rank === 2 ? '🥈 2' : item.rank === 3 ? '🥉 3' : item.rank}
                                        </div>
                                    </td>
                                    <td className="text-center font-mono font-bold text-info">{item.roll}</td>
                                    <td className="font-semibold text-lg">{item.name}</td>
                                    <td className="text-center font-bold text-success text-xl">{item.points}</td>
                                    <td className="text-center">
                                        {item.linkedin ? (
                                            <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost text-blue-500 hover:text-blue-400">
                                                LinkedIn 🔗
                                            </a>
                                        ) : (
                                            <span className="opacity-30 cursor-not-allowed">--</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {item.github ? (
                                            <a href={item.github} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost text-gray-400 hover:text-white">
                                                GitHub 🐙
                                            </a>
                                        ) : (
                                            <span className="opacity-30 cursor-not-allowed">--</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 opacity-50">
                                        No results found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer footer-center p-10 bg-neutral text-neutral-content">
                <aside>
                    <p className="font-bold text-lg">
                        IGNITE CLUB - BUGBYTE <br />
                        Providing reliable tech since 2026
                    </p>
                    <p>Copyright © 2026 - Vishveshwarya Group of Institution</p>
                </aside>
            </footer>
        </div>
    );
}