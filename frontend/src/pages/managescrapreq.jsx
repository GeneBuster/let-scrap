import { useEffect, useState } from "react";
import axios from "axios";

const ManageScrapRequests = ({ userId }) => {
    const [requests, setRequests] = useState([]);

    // Fetch scrap requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/scrap-requests/");
                setRequests(response.data.filter(request => request.user === userId));
            } catch (error) {
                console.error("Error fetching scrap requests:", error);
            }
        };
        fetchRequests();
    }, [userId]);

    // Delete request
    const handleDelete = async (requestId) => {
        try {
            await axios.delete(`http://localhost:5000/api/scrap-requests/:requestId`);
            setRequests(requests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error("Error deleting scrap request:", error);
        }
    };

    // Update request status
    const handleUpdate = async (requestId, newStatus) => {
        try {
            const response = await axios.put("http://localhost:5000/api/scrap-requests/update-status", {
                requestId,
                status: newStatus
            });
            setRequests(requests.map(req => req._id === requestId ? response.data.request : req));
        } catch (error) {
            console.error("Error updating scrap request:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Manage Scrap Requests</h2>
            {requests.length === 0 ? (
                <p>No scrap requests found.</p>
            ) : (
                <ul className="space-y-4">
                    {requests.map(request => (
                        <li key={request._id} className="border p-4">
                            <p><strong>Item:</strong> {request.items[0].itemType}</p>
                            <p><strong>Weight:</strong> {request.items[0].weight} kg</p>
                            <p><strong>Status:</strong> {request.status}</p>
                            <p><strong>Address:</strong> {request.pickupAddress.street}, {request.pickupAddress.city}</p>
                            <div className="flex space-x-2 mt-2">
                                <button onClick={() => handleUpdate(request._id, "Cancelled")} className="bg-yellow-500 text-white px-3 py-1 rounded">Cancel</button>
                                <button onClick={() => handleDelete(request._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageScrapRequests;
