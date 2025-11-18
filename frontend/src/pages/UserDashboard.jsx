import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, CheckCircle } from "lucide-react";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();

  // --- User Info ---
  const storedUserInfo = localStorage.getItem("userInfo");
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
  const name = userInfo?.name;
  const email = userInfo?.email;
  const userId = userInfo?.id;
  const token = userInfo?.token;

  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({ totalEarnings: 0, totalCompleted: 0 });
  const [loading, setLoading] = useState(true);

  // --- Fetch history + summary ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId || !token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/scrap-requests/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch user history", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/scrap-requests/user/${userId}/summary`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSummary(response.data);
      } catch (error) {
        console.error("Failed to fetch earnings summary", error);
      }
    };

    if (userId && token) {
      fetchHistory();
      fetchSummary();
    }
  }, [userId, token]);

  // --- Logout handler ---
  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  if (!userInfo) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Error loading user dashboard. Please{" "}
        <a href="/login" className="text-blue-600 underline">
          login again
        </a>.
      </div>
    );
  }

  const completedOrders = history.filter((order) => order.status === "Completed");

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* --- User Info Section --- */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">
                Welcome, {name} 👋
              </h1>
              <p className="text-gray-500 mt-1">
                Email: <span className="font-medium">{email}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* --- Earnings Summary --- */}
          <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-2">Your Scrap Summary</h2>
            <p className="text-lg">
              💰 <span className="font-semibold">Total Earnings:</span> ₹
              {summary.totalEarnings.toFixed(2)}
            </p>
            <p className="text-lg mt-1">
              ✅ <span className="font-semibold">Completed Pickups:</span>{" "}
              {summary.totalCompleted}
            </p>
          </div>

          {/* --- Action Cards --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <Link
              to="/pickup-requests"
              className="bg-green-100 hover:bg-green-200 rounded-xl p-6 shadow-md transition duration-200"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-1">
                Create Pickup Request
              </h3>
              <p className="text-sm text-gray-600">
                Schedule a new scrap pickup from your address.
              </p>
            </Link>

            <Link
              to="/order-status"
              className="bg-purple-100 hover:bg-purple-200 rounded-xl p-6 shadow-md transition duration-200"
            >
              <h3 className="text-xl font-semibold text-purple-800 mb-1">
                View Pickup & Chat
              </h3>
              <p className="text-sm text-gray-600">
                Track status and chat with dealers.
              </p>
            </Link>

            <Link
              to="/history"
              className="bg-blue-100 hover:bg-blue-200 rounded-xl p-6 shadow-md transition duration-200"
            >
              <h3 className="text-xl font-semibold text-blue-800 mb-1">
                Full Scrap History
              </h3>
              <p className="text-sm text-gray-600">
                Browse through all your previous pickups.
              </p>
            </Link>

            <Link
              to="/profile"
              className="bg-yellow-100 hover:bg-yellow-200 rounded-xl p-6 shadow-md transition duration-200"
            >
              <h3 className="text-xl font-semibold text-yellow-800 mb-1">
                My Profile
              </h3>
              <p className="text-sm text-gray-600">
                Update your details and preferences.
              </p>
            </Link>
          </div>
        </div>

        {/* --- Completed Orders --- */}
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            Completed Orders
          </h2>
          {loading ? (
            <p>Loading completed orders...</p>
          ) : completedOrders.length > 0 ? (
            <div className="space-y-4">
              {completedOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{order.items[0].itemType}</p>
                    <p className="font-bold text-green-600">
                      You Received: ₹
                      {order.earnings ? order.earnings.toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    Completed on:{" "}
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </p>
                  {order.rating && (
                    <div className="mt-2 text-sm">
                      <p className="font-semibold">Your Rating:</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < order.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You have no completed orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
