import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.id;
  const token = userInfo?.token;

  // 🔍 Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ✅ Fetch user pickup history
  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/user/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data || [];
      setHistory(data);
      setFilteredHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && token) fetchHistory();
    else setLoading(false);
  }, [userId, token]);

  // 🔁 Apply search + filter whenever searchTerm, statusFilter, or data changes
  useEffect(() => {
    let filtered = [...history];

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.items?.[0]?.itemType?.toLowerCase().includes(lowerSearch) ||
          order.dealer?.name?.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredHistory(filtered);
  }, [searchTerm, statusFilter, history]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-blue-100 text-blue-800";
      case "Picked Up":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Your Pickup History
        </h1>

        {/* 🔍 Search + Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by scrap type or dealer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Picked Up">Picked Up</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* 🧾 Pickup Requests List */}
        {loading ? (
          <p>Loading your pickup history...</p>
        ) : filteredHistory.length === 0 ? (
          <p className="text-gray-500">
            No pickups match your search or filter.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Request ID: {order._id}
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                      {order.items?.[0]?.itemType}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-semibold">
                        {order.items?.[0]?.weight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Address</p>
                      <p className="font-semibold">
                        {order.pickupAddress?.street},{" "}
                        {order.pickupAddress?.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Requested On</p>
                      <p className="font-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {order.dealer && (
                      <div>
                        <p className="text-sm text-gray-500">Dealer</p>
                        <p className="font-semibold">{order.dealer.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
