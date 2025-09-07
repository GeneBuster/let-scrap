import React, { useEffect, useState } from "react";
import axios from "axios";

const PickupStatus = () => {
  const userId = localStorage.getItem("userId");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`https://let-scrap.vercel.app/api/scrap-requests/user/${userId}`);
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching pickup status", err);
      }
    };
    fetchRequests();
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Pickup Status</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req._id} className="border p-4 rounded">
              <p><strong>Item:</strong> {req.items?.[0]?.itemType}</p>
              <p><strong>Status:</strong> {req.status}</p>
              {req.status === "Accepted" && (
                <p className="text-green-600">
                  Accepted by: {req.dealer?.name || "Dealer"}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PickupStatus;
