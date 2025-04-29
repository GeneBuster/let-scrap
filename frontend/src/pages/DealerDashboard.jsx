import React, { useEffect, useState } from "react";
import axios from "axios";

const DealerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dealerId = localStorage.getItem("dealerId");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/scrap-requests");
      const allRequests = response.data;
      const pending = allRequests.filter(req => req.status === "Pending");
      setRequests(pending);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to load scrap requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleConfirm = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/scrap-requests/update-status`, {
        requestId: id,
        status: "Accepted",
        dealerId: dealerId
      });
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error("Error confirming request:", error);
      alert("Failed to confirm the request. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/scrap-requests/${id}`);
      fetchRequests(); // Refresh list
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete the request. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Dealer Dashboard</h2>
        <p>Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Dealer Dashboard</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dealer Dashboard</h2>
        <button
          onClick={fetchRequests}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Pending Scrap Requests</h3>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li key={request._id} className="p-4 border rounded shadow">
                <p><strong>Item:</strong> {request.items?.[0]?.itemType || "Unknown Item"}</p>
                <p><strong>Weight:</strong> {request.items?.[0]?.weight || "N/A"} kg</p>
                <p><strong>Address:</strong> 
                  {request.pickupAddress
                    ? `${request.pickupAddress.street || ""}, ${request.pickupAddress.city || ""}, ${request.pickupAddress.state || ""}, ${request.pickupAddress.zip || ""}`
                    : "Address not available"}
                </p>
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleConfirm(request._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleDelete(request._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DealerDashboard;
