import React, { useState } from "react";
import axios from "axios";

const BillGen = () => {
  const [userId, setUserId] = useState(""); // User ID input
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle changes in input fields
  const handleItemChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Add a new item field
  const addItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  // Remove an item field
  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Calculate total
  const calculateTotal = (updatedItems) => {
    const total = updatedItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    setSubtotal(total);
    setTotalAmount(total);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post("https://let-scrap.vercel.app/api/bills/generate", {
        userId,
        items,
      });

      if (response.status === 201) {
        setMessage("Bill generated successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate bill.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Generate Bill</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-gray-700 font-medium">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter User ID"
            />
          </div>

          {items.map((item, index) => (
            <div key={index} className="mb-3 border p-3 rounded-lg">
              <label className="block text-gray-700 font-medium">Item Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Item name"
              />

              <label className="block text-gray-700 font-medium mt-2">Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />

              <label className="block text-gray-700 font-medium mt-2">Price</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="mt-2 text-red-500 text-sm"
              >
                Remove Item
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-2 rounded-lg mb-3"
          >
            Add Another Item
          </button>

          <div className="text-lg font-semibold mb-3">
            <p>Subtotal: ₹{subtotal}</p>
            <p>Total: ₹{totalAmount}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
          >
            Generate Bill
          </button>
        </form>

        {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default BillGen;
