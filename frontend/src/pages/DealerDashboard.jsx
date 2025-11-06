import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ChatWindow } from "../components/ChatWindow";

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
  const [selectedChatRequest, setSelectedChatRequest] = useState(null);

  const navigate = useNavigate();

  const dealerInfo = JSON.parse(localStorage.getItem('userInfo'));
  const dealerId = dealerInfo?.id;
  const token = dealerInfo?.token;

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
      const headers = { Authorization: `Bearer ${token}` };
      const [requestsResponse, statsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/scrap-requests`, { headers }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/dealers/stats`, { headers })
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
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllData();
  }, []);

  const handleConfirm = async (id) => {
    const slot = selectedSlot[id];
    const date = selectedDate[id];
    if (!slot || !date) {
      alert("Please select both a date and time slot before confirming.");
      return;
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/update-status`,
        {
          requestId: id,
          status: "Accepted",
          dealerId,
          timeSlot: `${date} | ${slot}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAllData();
    } catch (error) {
      console.error("Error confirming request:", error);
      alert("Failed to confirm the request. Try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchAllData();
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete the request. Try again.");
    }
  };

  const handlePickedUp = async (requestId) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/mark-picked-up/${requestId}`,
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
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/scrap-requests/complete/${currentRequest._id}`,
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

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('authChange'));
    navigate("/login");
  };

  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const acceptedRequests = requests.filter((r) =>
    r.dealer?._id === dealerId && (r.status === "Accepted" || r.status === "Picked Up")
  );
  const completedRequests = requests.filter(
    (r) => r.dealer?._id === dealerId && r.status === "Completed"
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Dealer Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
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
          {activeTab === "Pending Requests" && (
            <PendingRequestsTab
              requests={pendingRequests}
              handleConfirm={handleConfirm}
              handleDelete={handleDelete}
              setSelectedDate={setSelectedDate}
              setSelectedSlot={setSelectedSlot}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              getNextFiveDates={getNextFiveDates}
              timeSlots={timeSlots}
            />
          )}

          {activeTab === "To Pick-Up" &&
            (selectedChatRequest ? (
              <ChatWindow
                scrapRequest={selectedChatRequest}
                onBack={() => setSelectedChatRequest(null)}
              />
            ) : (
              <AcceptedRequestsTab
                requests={acceptedRequests}
                handlePickedUp={handlePickedUp}
                onCompleteClick={handleCompleteClick}
                onChatClick={setSelectedChatRequest}
              />
            ))}

          {activeTab === "Completed" && (
            <CompletedRequestsTab requests={completedRequests} />
          )}
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

// --- Reusable UI components ---
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
  if (!stats) return <p>No performance data yet.</p>;
  const chartData = [
    { name: 'Total Pickups', value: stats.totalPickups },
    { name: 'Total Weight (kg)', value: stats.totalWeight },
    { name: 'Total Earnings (₹)', value: stats.totalEarnings },
  ];
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-2xl font-bold mb-6">Performance Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-lg font-semibold text-blue-800">Total Pickups</p>
          <p className="text-3xl font-bold">{stats.totalPickups}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-lg font-semibold text-green-800">Total Weight</p>
          <p className="text-3xl font-bold">{stats.totalWeight.toFixed(2)}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <p className="text-lg font-semibold text-purple-800">Total Earnings</p>
          <p className="text-3xl font-bold">₹{stats.totalEarnings.toFixed(2)}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const PendingRequestsTab = ({ requests, handleConfirm, handleDelete, setSelectedDate, setSelectedSlot, selectedDate, selectedSlot, getNextFiveDates, timeSlots }) => (
  <>
    {requests.length === 0 ? <p>No pending requests.</p> : (
      <ul className="space-y-4">
        {requests.map(r => (
          <li key={r._id} className="p-4 border rounded shadow bg-white">
            <p><strong>Item:</strong> {r.items?.[0]?.itemType}</p>
            <p><strong>Weight:</strong> {r.items?.[0]?.weight} kg</p>
            <p><strong>Address:</strong> {`${r.pickupAddress?.street}, ${r.pickupAddress?.city}`}</p>
            <div className="mt-3 flex gap-3 flex-wrap">
              <select value={selectedDate[r._id] || ""} onChange={(e) => setSelectedDate((p) => ({ ...p, [r._id]: e.target.value }))}>
                <option value="">Select Date</option>
                {getNextFiveDates().map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select value={selectedSlot[r._id] || ""} onChange={(e) => setSelectedSlot((p) => ({ ...p, [r._id]: e.target.value }))}>
                <option value="">Select Slot</option>
                {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => handleConfirm(r._id)} className="bg-green-500 text-white px-3 py-1 rounded">Confirm</button>
              <button onClick={() => handleDelete(r._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </>
);

const AcceptedRequestsTab = ({ requests, handlePickedUp, onCompleteClick, onChatClick }) => (
  <>
    {requests.length === 0 ? <p>No active pickups.</p> : (
      <ul className="space-y-4">
        {requests.map(r => (
          <li key={r._id} className="p-4 border rounded shadow bg-green-50">
            <p><strong>Item:</strong> {r.items?.[0]?.itemType}</p>
            <p><strong>Weight:</strong> {r.items?.[0]?.weight} kg</p>
            <p><strong>Address:</strong> {`${r.pickupAddress?.street}, ${r.pickupAddress?.city}`}</p>
            <p><strong>Status:</strong> {r.status}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {r.status === "Accepted" && (
                <button onClick={() => handlePickedUp(r._id)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Mark Picked</button>
              )}
              {r.status === "Picked Up" && (
                <button onClick={() => onCompleteClick(r)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Complete</button>
              )}
              <button onClick={() => onChatClick(r)} className="bg-purple-500 text-white px-3 py-1 rounded text-sm">
                Chat with User
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </>
);

const CompletedRequestsTab = ({ requests }) => (
  <>
    {requests.length === 0 ? <p>No completed orders yet.</p> : (
      <ul className="space-y-4">
        {requests.map(r => (
          <li key={r._id} className="p-4 border rounded shadow bg-gray-50">
            <p><strong>Item:</strong> {r.items?.[0]?.itemType}</p>
            <p><strong>Weight:</strong> {r.items?.[0]?.weight} kg</p>
            <p><strong>Address:</strong> {`${r.pickupAddress?.street}, ${r.pickupAddress?.city}`}</p>
            <p className="font-semibold text-green-600">Earnings: ₹{r.earnings?.toFixed(2)}</p>
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
        <h2 className="text-xl font-bold mb-3">Complete Transaction</h2>
        <p><strong>Item:</strong> {request?.items?.[0]?.itemType}</p>
        <p><strong>Weight:</strong> {request?.items?.[0]?.weight} kg</p>
        <form onSubmit={onSubmit}>
          <label className="block mb-2">Earnings (₹)</label>
          <input
            type="number"
            value={earnings}
            onChange={(e) => setEarnings(e.target.value)}
            className="border rounded px-2 py-1 w-full"
            required
          />
          <div className="mt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>
            <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealerDashboard;
