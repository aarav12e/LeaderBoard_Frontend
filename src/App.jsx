import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserLeaderboard from "./pages/UserLeaderBoard";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<UserLeaderboard />} />
          <Route path="/admin-panel-secure" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
