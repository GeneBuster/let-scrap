import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  Truck,
  PackageCheck,
} from "lucide-react";

const PickupStatus = () => {
  // ✅ Load user info safely from localStorage
  const userData = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userData?.id;
  const token = userData?.token;


  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userId || !token) {
        setError("User session invalid. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/scrap-requests/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Raw data received from backend:", res.data);

        // Filter for active requests only
        const activeRequests = res.data.filter((req) =>
          ["Pending", "Accepted", "Picked Up"].includes(req.status)
        );

        console.log("Filtered active requests:", activeRequests);
        setRequests(activeRequests);
      } catch (err) {
        console.error("Error fetching pickup status", err);
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to fetch pickup status. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId, token]);

  // --- Status Badge Component ---
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-200";
    let textColor = "text-gray-700";
    let Icon = Clock;

    switch (status) {
      case "Pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        Icon = Clock;
        break;
      case "Accepted":
        bgColor = "bg-blue-100";
        textColor = "text-blue-800";
        Icon = CheckCircle;
        break;
      case "Picked Up":
        bgColor = "bg-purple-100";
        textColor = "text-purple-800";
        Icon = Truck;
        break;
      case "Completed":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        Icon = PackageCheck;
        break;
      default:
        Icon = AlertCircle;
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
      >
        <Icon size={14} /> {status}
      </span>
    );
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <span>{error}</span>
      </div>
    );
  }

  // --- Not Logged In Guard ---
  if (!userData) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Please log in to view your pickup status.
      </div>
    );
  }

  // --- Success State (with or without requests) ---
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 font-sans">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Your Active Pickups
      </h1>

      {requests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
          <p>You have no pending or ongoing pickup requests right now.</p>
          <a
            href="/pickup-requests"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Request a new pickup?
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <h3 className="text-xl font-semibold text-gray-800 mb-1 sm:mb-0">
                  {req.items?.[0]?.itemType || "Scrap Items"}
                  {req.items?.length > 1 &&
                    ` (+${req.items.length - 1} more)`}
                </h3>
                <StatusBadge status={req.status} />
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Weight:</strong>{" "}
                  {req.items?.reduce(
                    (sum, item) => sum + (Number(item.weight) || 0),
                    0
                  )}{" "}
                  kg (approx)
                </p>
                <p>
                  <strong>Address:</strong> {req.pickupAddress?.street},{" "}
                  {req.pickupAddress?.city}
                </p>
                <p>
                  <strong>Requested on:</strong>{" "}
                  {new Date(req.createdAt).toLocaleDateString()}
                </p>
                {/* --- Dealer Info with Rating --- */}
                {req.dealer && (
                  <div className="mt-2">
                    <p
                      className={`font-medium ${req.status === "Accepted"
                          ? "text-blue-700"
                          : req.status === "Picked Up"
                            ? "text-purple-700"
                            : "text-gray-700"
                        }`}
                    >
                      {req.status === "Accepted"
                        ? "Accepted by:"
                        : req.status === "Picked Up"
                          ? "Picked up by:"
                          : "Handled by:"}{" "}
                      {req.dealer?.name || "Dealer"}
                    </p>

                    {req.dealer?.averageRating && (
                      <div className="flex items-center text-sm text-yellow-600 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(req.dealer.averageRating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8-2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-2 text-gray-700">
                          ({req.dealer.averageRating.toFixed(1)})
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PickupStatus;
