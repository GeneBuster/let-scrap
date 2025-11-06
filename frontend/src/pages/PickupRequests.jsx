import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';

const PickupRequests = () => {
    // Form state
    const [itemType, setItemType] = useState('abs'); // Default to 'abs' as seen in screenshot
    const [weight, setWeight] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [zipCode, setZipCode] = useState('');

    // UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // --- SDE: Get Auth Info ---
        // ✅ Corrected Auth Info extraction
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const userId = userInfo?.id;
        const token = userInfo?.token;

        if (!userId || !token) {
            setError("You must be logged in to make a request.");
            setLoading(false);
            return;
        }

        // -------------------------

        // Construct the payload
        const requestData = {
            user: userId,
            items: [
                {
                    itemType: itemType,
                    weight: parseFloat(weight),
                },
            ],
            pickupAddress: {
                street: street,
                city: city,
                zipCode: zipCode,
            },
            status: 'Pending', // Initial status
        };

        try {
            // --- SDE FIX ---
            // Updated the URL to match your backend route:
            // '/api/scrap-requests' + '/pickup-request'
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/scrap-requests/pickup-request`,
                requestData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // --- END FIX ---

            setLoading(false);
            // SDE: On success, redirect to the "View" page (the "Menu")
            navigate('/pickup-status');

        } catch (err) {
            console.error("Error creating scrap request:", err);
            setError(err.response?.data?.message || "Failed to create request. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8 font-sans">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Request a New Pickup</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                {/* --- Error Message --- */}
                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                {/* --- Item Details --- */}
                <fieldset className="space-y-2">
                    <legend className="text-lg font-semibold text-gray-700">Item Details</legend>
                    <div>
                        <label htmlFor="itemType" className="block text-sm font-medium text-gray-600">Scrap Type</label>
                        <select
                            id="itemType"
                            value={itemType}
                            onChange={(e) => setItemType(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="abs">ABS</option>
                            <option value="iron">Iron</option>
                            <option value="paper">Paper</option>
                            <option value="plastic">Plastic</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-600">Approx. Weight (kg)</label>
                        <input
                            type="number"
                            id="weight"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder="e.g., 2.5"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </fieldset>

                {/* --- Address Details --- */}
                <fieldset className="space-y-2">
                    <legend className="text-lg font-semibold text-gray-700">Pickup Address</legend>
                    <div>
                        <label htmlFor="street" className="block text-sm font-medium text-gray-600">Street Address</label>
                        <input
                            type="text"
                            id="street"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            placeholder="e.g., 123 Main St"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-600">City</label>
                            <input
                                type="text"
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g., Allahabad"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-600">Zip Code</label>
                            <input
                                type="text"
                                id="zipCode"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                                placeholder="e.g., 211004"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </fieldset>

                {/* --- Submit Button --- */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Submitting...
                            </>
                        ) : (
                            'Submit Pickup Request'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PickupRequests;

