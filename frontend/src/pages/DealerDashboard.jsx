import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DealerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  const [activeTab, setActiveTab] = useState("Pending");

  const dealerId = localStorage.getItem("dealerId");
  const navigate = useNavigate();

  const timeSlots = ["8 AM - 12 PM", "12 PM - 4 PM", "4 PM - 8 PM", "8 PM - 12 AM"];

  const getNextFiveDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };  

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/scrap-requests");
      setRequests(response.data);
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
    const slot = selectedSlot[id];
    const date = selectedDate[id];

    if (!slot || !date) {
      alert("Please select both a date and time slot before confirming.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/scrap-requests/update-status`, {
        requestId: id,
        status: "Accepted",
        dealerId: dealerId,
        timeSlot: `${date} | ${slot}`,
      });
      fetchRequests();
    } catch (error) {
      console.error("Error confirming request:", error);
      alert("Failed to confirm the request. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/scrap-requests/${id}`);
      fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete the request. Try again.");
    }
  };

  const handleSlotChange = (id, value) => {
    setSelectedSlot((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (id, value) => {
    setSelectedDate((prev) => ({ ...prev, [id]: value }));
  };

  const parseDateTime = (timeSlot) => {
    if (!timeSlot) return null;
    const [datePart, timePart] = timeSlot.split(" | ");
    const [startTime] = timePart.split("-");
    return new Date(`${datePart} ${startTime}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const pendingRequests = requests.filter((req) => req.status === "Pending");


const acceptedRequests = requests
  .filter((req) => {
    const isAccepted = req.status === "Accepted";
    const dealerMatch =
      req.dealer === dealerId ||
      req.dealer?._id === dealerId ||
      req.dealer?.toString() === dealerId;

    return isAccepted && dealerMatch;
  })
  .sort((a, b) => {
    const dateA = parseDateTime(a.timeSlot);
    const dateB = parseDateTime(b.timeSlot);
    return dateA - dateB;
  });


    const handlePickedUp = async (requestId) => {
      try {
        await axios.put(
          `http://localhost:5000/api/scrap-requests/mark-picked-up/${requestId}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
        );
        fetchRequests(); // Refresh the list
      } catch (err) {
        console.error("Failed to mark as picked up", err);
        alert("Failed to mark as picked up. Try again.");
      }
    };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Dealer Dashboard</h2>
        <div className="flex gap-4">
          <button
            onClick={fetchRequests}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b pb-2">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "Pending"
              ? "border-b-4 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("Pending")}
        >
          Pending Requests
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "ToPickUp"
              ? "border-b-4 border-green-500 text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("ToPickUp")}
        >
          To Pick-Up
        </button>
      </div>

      {/* Pending Requests Tab */}
      {activeTab === "Pending" && (
        <>
          {pendingRequests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <ul className="space-y-4">
              {pendingRequests.map((request) => (
                <li
                  key={request._id}
                  className="p-4 border rounded shadow bg-white"
                >
                  <p>
                    <strong>Item:</strong>{" "}
                    {request.items?.[0]?.itemType || "Unknown"}
                  </p>
                  <p>
                    <strong>Weight:</strong>{" "}
                    {request.items?.[0]?.weight || "N/A"} kg
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {request.pickupAddress
                      ? `${request.pickupAddress.street}, ${request.pickupAddress.city}, ${request.pickupAddress.state}, ${request.pickupAddress.zip}`
                      : "Address not available"}
                  </p>

                  {/* Date & Time Slot Picker */}
                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <div>
                      <label className="font-medium mr-2">Date:</label>
                      <select
                        value={selectedDate[request._id] || ""}
                        onChange={(e) =>
                          handleDateChange(request._id, e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">-- Select --</option>
                        {getNextFiveDates().map((date) => (
                          <option key={date} value={date}>
                            {date}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-medium mr-2">Time Slot:</label>
                      <select
                        value={selectedSlot[request._id] || ""}
                        onChange={(e) =>
                          handleSlotChange(request._id, e.target.value)
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">-- Select --</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-4">
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
        </>
      )}

      {/* To Pick-Up Tab */}
      {activeTab === "ToPickUp" && (
        <>
          {acceptedRequests.length === 0 ? (
            <p>No upcoming pickups.</p>
          ) : (
            <ul className="space-y-4">
              {acceptedRequests.map((request) => (
                <li key={request._id} className="p-4 border rounded shadow bg-green-50">
                  <p><strong>Item:</strong> {request.items?.[0]?.itemType}</p>
                  <p><strong>Weight:</strong> {request.items?.[0]?.weight} kg</p>
                  <p><strong>Address:</strong> {`${request.pickupAddress?.street}, ${request.pickupAddress?.city}, ${request.pickupAddress?.state}, ${request.pickupAddress?.zip}`}</p>
                  <p><strong>Scheduled Slot:</strong> {request.timeSlot}</p>
                            
                  {/* Add this button */}
                  <button
                    onClick={() => handlePickedUp(request._id)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Mark as Picked Up
                  </button>
                </li>
              ))}

            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default DealerDashboard;
