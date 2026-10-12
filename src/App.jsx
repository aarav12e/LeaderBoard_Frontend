import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLeaderboard from "./pages/UserLeaderBoard";
import AdminDashboard from "./pages/AdminDashboard";
import SeniorLeaderBoard from "./pages/SeniorLeaderBoard";
import SeniorAdminDashboard from "./pages/SeniorAdminDashboard";
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
          <Route path="/senior-leader-board" element={<SeniorLeaderBoard />} />
          <Route path="/senior-admin-panel" element={<SeniorAdminDashboard />} />
          <Route path="/senior-admin" element={<SeniorAdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
