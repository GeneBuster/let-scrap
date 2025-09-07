import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DealerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState({});
  const [selectedDate, setSelectedDate] = useState({});
  const [activeTab, setActiveTab] = useState("Performance");
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [earnings, setEarnings] = useState('');

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

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [requestsResponse, statsResponse] = await Promise.all([
        axios.get("https://let-scrap.vercel.app/api/scrap-requests", { headers }),
        axios.get("https://let-scrap.vercel.app/api/dealers/stats", { headers })
      ]);
      setRequests(requestsResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Error fetching dealer data:", error);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAllData();
  }, []);

  // --- Event Handlers ---
  const handleConfirm = async (id) => {
    const slot = selectedSlot[id];
    const date = selectedDate[id];
    if (!slot || !date) {
      alert("Please select both a date and time slot before confirming.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://let-scrap.vercel.app/api/scrap-requests/update-status`, {
        requestId: id,
        status: "Accepted",
        dealerId: dealerId,
        timeSlot: `${date} | ${slot}`,
      }, { headers: { Authorization: `Bearer ${token}` } });
      await fetchAllData();
    } catch (error) {
      console.error("Error confirming request:", error);
      alert("Failed to confirm the request. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://let-scrap.vercel.app/api/scrap-requests/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchAllData();
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete the request. Try again.");
    }
  };
  
  const handlePickedUp = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://let-scrap.vercel.app/api/scrap-requests/mark-picked-up/${requestId}`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAllData();
    } catch (err) {
      console.error("Failed to mark as picked up", err);
      alert("Failed to mark as picked up. Try again.");
    }
  };

  const handleCompleteClick = (request) => {
    setCurrentRequest(request);
    setIsModalOpen(true);
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!currentRequest || !earnings || earnings <= 0) {
      alert("Please enter a valid earnings amount.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://let-scrap.vercel.app/api/scrap-requests/complete/${currentRequest._id}`,
        { earnings: parseFloat(earnings) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalOpen(false);
      setEarnings('');
      setCurrentRequest(null);
      await fetchAllData();
    } catch (err) {
      console.error("Failed to complete transaction", err);
      alert("Failed to complete the transaction. Try again.");
    }
  };

  const handleSlotChange = (id, value) => setSelectedSlot((prev) => ({ ...prev, [id]: value }));
  const handleDateChange = (id, value) => setSelectedDate((prev) => ({ ...prev, [id]: value }));
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // --- Data Filtering ---
  const pendingRequests = requests.filter((req) => req.status === "Pending");
  const acceptedRequests = requests.filter((req) => {
    const dealerMatch = req.dealer?._id === dealerId;
    return dealerMatch && (req.status === "Accepted" || req.status === "Picked Up");
  });
  const completedRequests = requests.filter((req) => {
    const dealerMatch = req.dealer?._id === dealerId;
    return dealerMatch && req.status === "Completed";
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Dealer Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <div className="flex space-x-4 mb-6 border-b pb-2">
        <TabButton title="Performance" activeTab={activeTab} setActiveTab={setActiveTab} color="purple" />
        <TabButton title="Pending Requests" activeTab={activeTab} setActiveTab={setActiveTab} color="blue" />
        <TabButton title="To Pick-Up" activeTab={activeTab} setActiveTab={setActiveTab} color="green" />
        <TabButton title="Completed" activeTab={activeTab} setActiveTab={setActiveTab} color="gray" />
      </div>
      
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {activeTab === "Performance" && <PerformanceTab stats={stats} />}
          {activeTab === "Pending Requests" && <PendingRequestsTab requests={pendingRequests} handleConfirm={handleConfirm} handleDelete={handleDelete} handleSlotChange={handleSlotChange} handleDateChange={handleDateChange} selectedSlot={selectedSlot} selectedDate={selectedDate} getNextFiveDates={getNextFiveDates} timeSlots={timeSlots} />}
          {activeTab === "To Pick-Up" && <AcceptedRequestsTab requests={acceptedRequests} handlePickedUp={handlePickedUp} onCompleteClick={handleCompleteClick} />}
          {activeTab === "Completed" && <CompletedRequestsTab requests={completedRequests} />}
        </>
      )}

      <CompleteTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCompleteSubmit}
        earnings={earnings}
        setEarnings={setEarnings}
        request={currentRequest}
      />
    </div>
  );
};

// --- Sub-components ---

const TabButton = ({ title, activeTab, setActiveTab, color }) => (
  <button
    className={`px-4 py-2 font-semibold ${
      activeTab === title
        ? `border-b-4 border-${color}-500 text-${color}-600`
        : "text-gray-500"
    }`}
    onClick={() => setActiveTab(title)}
  >
    {title}
  </button>
);

const PerformanceTab = ({ stats }) => {
  if (!stats) return <p>No performance data available yet. Complete a pickup to see your stats!</p>;
  const chartData = [
    { name: 'Total Pickups', value: stats.totalPickups },
    { name: 'Total Weight (kg)', value: stats.totalWeight },
    { name: 'Total Earnings (₹)', value: stats.totalEarnings },
  ];
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Performance Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
        <div className="bg-blue-100 p-4 rounded-lg"><p className="text-lg font-semibold text-blue-800">Total Pickups</p><p className="text-3xl font-bold text-blue-900">{stats.totalPickups}</p></div>
        <div className="bg-green-100 p-4 rounded-lg"><p className="text-lg font-semibold text-green-800">Total Weight (kg)</p><p className="text-3xl font-bold text-green-900">{stats.totalWeight.toFixed(2)}</p></div>
        <div className="bg-purple-100 p-4 rounded-lg"><p className="text-lg font-semibold text-purple-800">Total Earnings</p><p className="text-3xl font-bold text-purple-900">₹{stats.totalEarnings.toFixed(2)}</p></div>
      </div>
      <div style={{ width: '100%', height: 400 }}><ResponsiveContainer><BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="value" fill="#8884d8" /></BarChart></ResponsiveContainer></div>
    </div>
  );
};

const PendingRequestsTab = ({ requests, handleConfirm, handleDelete, handleSlotChange, handleDateChange, selectedSlot, selectedDate, getNextFiveDates, timeSlots }) => (
  <>
    {requests.length === 0 ? <p>No pending requests.</p> : (
      <ul className="space-y-4">
        {requests.map(request => (
          <li key={request._id} className="p-4 border rounded shadow bg-white">
            <p><strong>Item:</strong> {request.items?.[0]?.itemType || "Unknown"}</p>
            <p><strong>Weight:</strong> {request.items?.[0]?.weight || "N/A"} kg</p>
            <p><strong>Address:</strong> {request.pickupAddress ? `${request.pickupAddress.street}, ${request.pickupAddress.city}` : "N/A"}</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <div>
                <label className="font-medium mr-2">Date:</label>
                <select value={selectedDate[request._id] || ""} onChange={(e) => handleDateChange(request._id, e.target.value)} className="border px-2 py-1 rounded">
                  <option value="">-- Select --</option>
                  {getNextFiveDates().map((date) => (<option key={date} value={date}>{date}</option>))}
                </select>
              </div>
              <div>
                <label className="font-medium mr-2">Time Slot:</label>
                <select value={selectedSlot[request._id] || ""} onChange={(e) => handleSlotChange(request._id, e.target.value)} className="border px-2 py-1 rounded">
                  <option value="">-- Select --</option>
                  {timeSlots.map((slot) => (<option key={slot} value={slot}>{slot}</option>))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <button onClick={() => handleConfirm(request._id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Confirm</button>
              <button onClick={() => handleDelete(request._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </>
);

const AcceptedRequestsTab = ({ requests, handlePickedUp, onCompleteClick }) => (
  <>
    {requests.length === 0 ? <p>No upcoming pickups.</p> : (
      <ul className="space-y-4">
        {requests.map(request => (
          <li key={request._id} className="p-4 border rounded shadow bg-green-50">
            <p><strong>Item:</strong> {request.items?.[0]?.itemType}</p>
            <p><strong>Weight:</strong> {request.items?.[0]?.weight} kg</p>
            <p><strong>Address:</strong> {`${request.pickupAddress?.street}, ${request.pickupAddress?.city}`}</p>
            <p><strong>Scheduled Slot:</strong> {request.timeSlot}</p>
            <p><strong>Status:</strong> <span className="font-semibold">{request.status}</span></p>
            <div className="mt-2 flex gap-2">
              {request.status === "Accepted" && (
                <button onClick={() => handlePickedUp(request._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">Mark as Picked Up</button>
              )}
              {request.status === "Picked Up" && (
                <button onClick={() => onCompleteClick(request)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">Complete Transaction</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </>
);

const CompleteTransactionModal = ({ isOpen, onClose, onSubmit, earnings, setEarnings, request }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Complete Transaction</h2>
        <p className="mb-2"><strong>Item:</strong> {request?.items?.[0]?.itemType}</p>
        <p className="mb-4"><strong>Weight:</strong> {request?.items?.[0]?.weight} kg</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="earnings" className="block text-sm font-medium text-gray-700">Enter Final Earnings (₹)</label>
          <input
            type="number"
            id="earnings"
            value={earnings}
            onChange={(e) => setEarnings(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g., 150.50"
            required
            step="0.01"
          />
          <div className="mt-6 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CompletedRequestsTab = ({ requests }) => (
  <>
    {requests.length === 0 ? <p>You have no completed orders yet.</p> : (
      <ul className="space-y-4">
        {requests.map(request => (
          <li key={request._id} className="p-4 border rounded shadow bg-gray-50">
            <div className="flex justify-between items-center">
                <p><strong>Item:</strong> {request.items?.[0]?.itemType}</p>
                <p className="font-bold text-green-600">Earnings: ₹{request.earnings.toFixed(2)}</p>
            </div>
            <p><strong>Weight:</strong> {request.items?.[0]?.weight} kg</p>
            <p><strong>Address:</strong> {`${request.pickupAddress?.street}, ${request.pickupAddress?.city}`}</p>
            <p className="text-sm text-gray-500 mt-2">Completed on: {new Date(request.updatedAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    )}
  </>
);

export default DealerDashboard;
