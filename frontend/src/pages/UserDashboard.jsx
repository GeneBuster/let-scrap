import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

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
        Error loading user dashboard. Please{" "}
        <a href="/login" className="text-blue-600 underline">login again</a>.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Welcome, {name} 👋</h1>
            <p className="text-gray-500 mt-1">Email: <span className="font-medium">{email}</span></p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          <Link to="/pickup-requests" className="bg-green-100 hover:bg-green-200 rounded-xl p-6 shadow-md transition duration-200">
            <h3 className="text-xl font-semibold text-green-800 mb-1">Create Pickup Request</h3>
            <p className="text-sm text-gray-600">Schedule a new scrap pickup from your address.</p>
          </Link>

          <Link to="/pickup-status" className="bg-purple-100 hover:bg-purple-200 rounded-xl p-6 shadow-md transition duration-200">
            <h3 className="text-xl font-semibold text-purple-800 mb-1">View Pickup Status</h3>
            <p className="text-sm text-gray-600">Track status of your ongoing scrap pickups.</p>
          </Link>

          <Link to="/history" className="bg-blue-100 hover:bg-blue-200 rounded-xl p-6 shadow-md transition duration-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-1">Scrap History</h3>
            <p className="text-sm text-gray-600">Browse through your previous pickup history.</p>
          </Link>

          <Link to="/profile" className="bg-yellow-100 hover:bg-yellow-200 rounded-xl p-6 shadow-md transition duration-200">
            <h3 className="text-xl font-semibold text-yellow-800 mb-1">My Profile</h3>
            <p className="text-sm text-gray-600">Update your details and preferences.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
