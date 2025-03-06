import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold">Welcome to Let's Scrap</h1>
      <p className="mt-4 text-lg text-gray-300">Turn your waste into value while saving the planet.</p>

      <div className="mt-6 space-x-4">
        <Link to="/login">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg">
            Signup
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
