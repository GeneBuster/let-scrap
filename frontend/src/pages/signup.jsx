import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Enter your name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Create a password" />
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Signup</button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-green-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
