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
    const speech = new SpeechSynthesisUtterance(
      "Welcome to Ignite Club BugByte"
    );
    window.speechSynthesis.speak(speech);
    setTimeout(() => setShowWelcome(false), 500);
  };

  const filtered = data.filter(s =>
    s.roll.toLowerCase().includes(search.toLowerCase()) ||
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen flex flex-col bg-base-200"
      data-theme="cyberpunk"
    >

      {/* WELCOME SCREEN */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 bg-base-100 flex items-center justify-center">
          <div className="text-center px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Welcome to
            </h1>
            <p className="text-2xl font-bold mb-6">
              IGNITE CLUB – BUGBYTE 🎉
            </p>
            <button
              onClick={handleEnter}
              className="btn btn-primary btn-lg rounded-full"
            >
              Click to Enter
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 container mx-auto p-4 md:p-8">

        {/* HEADING */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-primary">
            VISHVESHWARYA GROUP OF INSTITUTION
          </h1>
          <h2 className="text-xl md:text-3xl font-semibold text-secondary mt-2">
            IGNITE CLUB – BUGBYTE
          </h2>
        </div>

        {/* SEARCH */}
        <div className="sticky top-0 z-40 bg-base-200 py-3 mb-6 flex justify-center">
          <input
            type="text"
            placeholder="🔍 Search by Roll No or Name"
            className="input input-bordered input-primary w-full max-w-md"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto bg-base-100 shadow-xl rounded-lg">
          <table className="table table-zebra table-lg w-full">
            <thead className="bg-neutral text-neutral-content">
              <tr>
                <th className="text-center">Rank</th>
                <th className="text-center">Roll No</th>
                <th>Name</th>
                <th className="text-center">Points</th>
                <th className="text-center">LinkedIn</th>
                <th className="text-center">GitHub</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item._id}>
                  <td className="text-center font-bold">#{item.rank}</td>
                  <td className="text-center font-mono text-info">
                    {item.roll}
                  </td>
                  <td className="font-semibold">{item.name}</td>
                  <td className="text-center text-success font-bold">
                    {item.points}
                  </td>
                  <td className="text-center">
                    {item.linkedin ? (
                      <a
                        href={item.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="link link-info"
                      >
                        🔗
                      </a>
                    ) : "--"}
                  </td>
                  <td className="text-center">
                    {item.github ? (
                      <a
                        href={item.github}
                        target="_blank"
                        rel="noreferrer"
                        className="link"
                      >
                        🐙
                      </a>
                    ) : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="block md:hidden space-y-4">
          {filtered.map(item => (
            <div
              key={item._id}
              className="card bg-base-100 shadow-lg border border-base-300"
            >
              <div className="card-body p-4">

                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg">{item.name}</h2>
                  <span className="badge badge-primary font-bold">
                    #{item.rank}
                  </span>
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <span className="font-mono text-info">
                    Roll: {item.roll}
                  </span>
                  <span className="font-bold text-success">
                    {item.points} pts
                  </span>
                </div>

                <div className="flex gap-3 mt-4">
                  {item.linkedin && (
                    <a
                      href={item.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline btn-info flex-1"
                    >
                      LinkedIn
                    </a>
                  )}
                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline flex-1"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-center opacity-50 mt-10">
              No results found
            </p>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer footer-center p-6 bg-neutral text-neutral-content">
        <p className="font-bold">
          IGNITE CLUB – BUGBYTE
        </p>
        <p>© 2026 BugByte</p>
      </footer>
    </div>
  );
}
