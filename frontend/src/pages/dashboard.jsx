import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';
import UserDashboard from './UserDashboard';
import DealerDashboard from './DealerDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      setError('Please log in first');
      navigate('/login');
      return;
    }

    if (userRole) {
      setIsRedirecting(true);
      setTimeout(() => {
        if (userRole === 'dealer') navigate('/dealer-dashboard');
        else navigate('/user-dashboard');
      }, 1500);
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const fetchedUser = response.data;
        setUser(fetchedUser);
        localStorage.setItem('userRole', fetchedUser.role);

        setIsRedirecting(true);
        setTimeout(() => {
          if (fetchedUser.role === 'dealer') navigate('/dealer-dashboard');
          else navigate('/user-dashboard');
        }, 1500);
      })
      .catch((error) => {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load profile data');
      });
  }, [navigate]);

  // --- Error Display ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-rose-100 via-indigo-100 to-sky-100">
        <img
          src="https://cdn-icons-png.flaticon.com/512/595/595067.png"
          alt="Error icon"
          className="w-28 h-28 mb-6 opacity-80"
        />
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-all"
        >
          Back to Login
        </button>
      </div>
    );
  }

  // --- Loading or Redirecting Screen ---
  if (!user && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white transition-all duration-700">
        <Loader2 className="animate-spin mb-6" size={48} />
        <h2 className="text-3xl font-semibold tracking-wide">
          Loading your dashboard...
        </h2>
        <p className="text-sm text-indigo-100 mt-2">
          Please wait while we prepare your data ✨
        </p>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tl from-blue-100 via-indigo-200 to-violet-100 text-gray-700 transition-all duration-700">
        <img
          src={
            user?.role === 'dealer'
              ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
              : 'https://cdn-icons-png.flaticon.com/512/706/706830.png'
          }
          alt="Profile"
          className="w-28 h-28 mb-4 rounded-full border-4 border-white shadow-lg"
        />
        <h2 className="text-2xl font-bold mb-1">
          Welcome back, {user?.name?.split(' ')[0] || 'User'}!
        </h2>
        <p className="text-gray-600 mb-4">
          Redirecting to your {user?.role === 'dealer' ? 'Dealer' : 'User'} Dashboard...
        </p>
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  // --- Render Fallback (if user loaded but not redirected yet) ---
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-indigo-50 to-blue-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-[90%] max-w-md transition-all hover:shadow-2xl">
        <img
          src={
            user?.role === 'dealer'
              ? 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
              : 'https://cdn-icons-png.flaticon.com/512/706/706830.png'
          }
          alt="User Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-gray-800">
          Hello, {user?.name || 'User'}
        </h2>
        <p className="text-gray-600 mb-2">
          Role: <span className="font-medium text-indigo-700">{user?.role}</span>
        </p>
        <p className="text-sm text-gray-500">{user?.email}</p>

        <div className="mt-6">
          <button
            onClick={() =>
              navigate(user?.role === 'dealer' ? '/dealer-dashboard' : '/user-dashboard')
            }
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
