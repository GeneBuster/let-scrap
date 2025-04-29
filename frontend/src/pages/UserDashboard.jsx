import React from "react";
import { Link, useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!name || !email) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Error loading user dashboard. Please <a href="/login" className="text-blue-600 underline">login again</a>.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome, {name}</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      <p className="mb-6">Email: {email}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/pickup-requests" className="p-4 bg-green-200 rounded shadow hover:bg-green-300">
          Create Scrap Pickup Request
        </Link>
        <Link to="/pickup-status" className="p-4 bg-purple-200 rounded shadow hover:bg-purple-300">
          View Pickup Status
        </Link>
        <Link to="/history" className="p-4 bg-blue-200 rounded shadow hover:bg-blue-300">
          View My Scrap History
        </Link>
        <Link to="/profile" className="p-4 bg-yellow-200 rounded shadow hover:bg-yellow-300">
          My Profile
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
