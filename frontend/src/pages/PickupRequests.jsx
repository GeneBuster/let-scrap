import React, { useState } from 'react';
import axios from 'axios';

const ScrapRequest = () => {
  const userId = localStorage.getItem("userId");
  // console.log("User ID:", userId);  //testing purpose
  const [formData, setFormData] = useState({
    user: userId,
    items: [{ itemType: "", weight: "" }],
    pickupAddress: { street: "", city: "", state: "", zip: "" },
  });

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      pickupAddress: {
        ...formData.pickupAddress,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleItemChange = (e, field) => {
    setFormData({
      ...formData,
      items: [{ ...formData.items[0], [field]: e.target.value }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.items[0].itemType ||
      !formData.items[0].weight ||
      !formData.pickupAddress.street
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "https://let-scrap.vercel.app/api/scrap-requests/pickup-request",
        {
          ...formData,
          user: userId,
          status: "Pending",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      alert(response.data.message);
      setFormData({
        user: userId,
        items: [{ itemType: "", weight: "" }],
        pickupAddress: { street: "", city: "", state: "", zip: "" },
      });
    } catch (error) {
      alert(`Error: ${error?.response?.data?.message || "Unknown error"}`);
      console.error("Backend error:", error?.response?.data);
      // console.error("Axios error:", error);
      // alert("Failed to create scrap request");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Create Scrap Request</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="itemType"
          placeholder="Item Type"
          className="border p-2 w-full"
          value={formData.items[0].itemType}
          onChange={(e) => handleItemChange(e, "itemType")}
          required
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          className="border p-2 w-full"
          value={formData.items[0].weight}
          onChange={(e) => handleItemChange(e, "weight")}
          required
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          className="border p-2 w-full"
          value={formData.pickupAddress.street}
          onChange={handleAddressChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          className="border p-2 w-full"
          value={formData.pickupAddress.city}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          className="border p-2 w-full"
          value={formData.pickupAddress.state}
          onChange={handleAddressChange}
        />
        <input
          type="text"
          name="zip"
          placeholder="ZIP Code"
          className="border p-2 w-full"
          value={formData.pickupAddress.zip}
          onChange={handleAddressChange}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Request
        </button>
      </form>
    </div>
  );


};

export default ScrapRequest;
