import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/scrap-requests/user/${userId}`
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Scrap Pickup History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {history.map((order) => (
            <li key={order._id} className="border p-4 rounded shadow">
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Item:</strong> {order.items?.[0]?.itemType}</p>
              <p><strong>Weight:</strong> {order.items?.[0]?.weight} kg</p>
              <p><strong>Pickup Address:</strong> 
                {order.pickupAddress?.street}, {order.pickupAddress?.city}, {order.pickupAddress?.state}, {order.pickupAddress?.zip}
              </p>
              <p><strong>Time Slot:</strong> {order.timeSlot || "Not Scheduled Yet"}</p>
              {order.dealer && (
                <p><strong>Accepted By:</strong> {order.dealer.name}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
