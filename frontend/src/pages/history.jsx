import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/scrap-requests/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data || []);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Scrap Pickup History</h2>
      {history.length === 0 ? (
        <p>No completed pickups yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((order) => (
            <div key={order._id} className="p-4 border rounded shadow">
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Item:</strong> {order.items?.[0]?.itemType || "Unknown"}</p>
              <p><strong>Weight:</strong> {order.items?.[0]?.weight} kg</p>
              <p><strong>Location:</strong> {order.pickupAddress?.street}, {order.pickupAddress?.city}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
