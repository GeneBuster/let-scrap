import { useEffect, useState } from "react";
import axios from "axios";
import { ChatWindow } from "../components/ChatWindow";
import { Loader2, AlertCircle } from "lucide-react";

const ManageScrapRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch user requests ---
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        const userId = userData?.id;
        const token = userData?.token;

        if (!userId || !token) {
          setError("User session invalid. Please log in again.");
          setLoading(false);
          return;
        }


        if (!userId || !token) {
          setError("User credentials missing. Please log in again.");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/scrap-requests/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Filter active requests only (exclude Completed)
        const activeRequests = res.data.filter(
          (req) => req.status !== "Completed"
        );

        // Sort: Pending → Accepted → Picked Up → Others
        const priority = { Pending: 1, Accepted: 2, "Picked Up": 3 };
        activeRequests.sort((a, b) => {
          const aPriority = priority[a.status] || 99;
          const bPriority = priority[b.status] || 99;
          return aPriority - bPriority;
        });

        setRequests(activeRequests);
      } catch (err) {
        console.error("Error fetching scrap requests:", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // --- Delete Pending request ---
  const handleDelete = async (requestId) => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      if (selectedRequest && selectedRequest._id === requestId)
        setSelectedRequest(null);
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request. Try again.");
    }
  };

  // --- Cancel Pending request ---
  const handleCancel = async (requestId) => {
    try {
     const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/update-status`,
        { requestId, status: "Cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = response.data.request;
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? updated : r))
      );
      if (selectedRequest && selectedRequest._id === requestId)
        setSelectedRequest(updated);
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Failed to cancel request. Try again.");
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* LEFT PANEL — REQUEST LIST */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">Active Pickup Requests</h2>

        {loading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-blue-600" size={30} />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <p className="text-gray-500 text-sm">No active scrap requests found.</p>
        )}

        {!loading && !error && requests.length > 0 && (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li
                key={req._id}
                className={`p-4 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition ${selectedRequest?._id === req._id ? "bg-gray-100" : ""
                  }`}
                onClick={() => setSelectedRequest(req)}
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold">
                    {req.items?.[0]?.itemType || "Scrap"}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${req.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : req.status === "Accepted"
                          ? "bg-blue-100 text-blue-800"
                          : req.status === "Picked Up"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {req.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  {req.pickupAddress?.city || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  Requested: {new Date(req.createdAt).toLocaleDateString()}
                </p>

                <div className="flex space-x-2 mt-3">
                  {/* Cancel for Pending only */}
                  {req.status === "Pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancel(req._id);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Cancel
                    </button>
                  )}

                  {/* Delete for Pending only */}
                  {req.status === "Pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(req._id);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}

                  {/* Chat for Accepted / Picked Up only */}
                  {["Accepted", "Picked Up"].includes(req.status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Chat
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT PANEL — CHAT WINDOW */}
      <div className="w-2/3 p-4">
        {selectedRequest ? (
          <ChatWindow
            scrapRequest={selectedRequest}
            onBack={() => setSelectedRequest(null)}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <p className="text-gray-500">Select a request to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageScrapRequests;
