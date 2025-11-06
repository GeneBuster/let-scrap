import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';
import UserDashboard from './UserDashboard';
import DealerDashboard from './DealerDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');  // Get role from localStorage

    if (!token) {
      setError('Please log in first');
      navigate('/login'); // Redirect to login if no token
      return;
    }

    // If the user role is already available in localStorage, use it for immediate redirection
    if (userRole) {
      if (userRole === 'dealer') {
        navigate('/dealer-dashboard');  // Direct to Dealer Dashboard
      } else if (userRole === 'user') {
        navigate('/user-dashboard');  // Direct to User Dashboard
      }
      return;  // Skip fetching user profile from the backend if role is available
    }

    // Fetch user data only if role is not in localStorage
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);

        // Store the role in localStorage after fetching user data
        const role = response.data.role;
        localStorage.setItem('userRole', role); // Save the role in localStorage

        // Redirect based on the fetched role
        if (role === 'dealer') {
          navigate('/dealer-dashboard');
        } else if (role === 'user') {
          navigate('/user-dashboard');
        }
      })
      .catch((error) => {
        console.error('Failed to fetch user data:', error);
        setError('Failed to load profile data');
      });
  }, [navigate]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="loading-message">Loading...</div>;
  }

  // Render the correct dashboard component based on the user's role
  if (user.role === 'dealer') {
    return <DealerDashboard user={user} />;
  }

  return <UserDashboard user={user} />;
};

export default Dashboard;
