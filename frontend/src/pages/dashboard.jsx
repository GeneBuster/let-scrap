import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';  // Importing the updated CSS

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

    if (token) {
      // If the token exists, make an API call to fetch the user's profile
      axios
        .get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data); // Set user data from the API response
        })
        .catch((error) => {
          console.error('Failed to fetch user data:', error);
          setError('Failed to load profile data'); // Handle any errors from the API
        });
    } else {
      // If no token exists, redirect the user to the login page
      setError('Please log in first');
      navigate('/login');
    }
  }, [navigate]);

  if (error) {
    return <div className="error-message">{error}</div>; // Show the error message
  }

  if (!user) {
    return <div className="loading-message">Loading...</div>; // Show loading message while waiting for the API response
  }

  const handleButtonClick = (route) => {
    navigate(route); // Handle the button clicks and navigate to respective routes
  };

  return (
    <div className="dashboard-container">
      <div className="profile-section">
        <div className="profile-header">
          <h2>Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone || 'N/A'}</p>
        </div>
      </div>

      <div className="actions">
        {/* Card with image */}
        <div className="card" onClick={() => handleButtonClick('/place-order')}>
          <img src="https://via.placeholder.com/150" alt="Place Order" className="card-image" />
          <div className="card-content">
            <h3>Place an Order</h3>
          </div>
        </div>

        {/* Card with image */}
        <div className="card" onClick={() => handleButtonClick('/order-history')}>
          <img src="https://via.placeholder.com/150" alt="Order History" className="card-image" />
          <div className="card-content">
            <h3>Order History</h3>
          </div>
        </div>

        {/* Card with image */}
        <div className="card" onClick={() => handleButtonClick('/bill-generation')}>
          <img src="https://via.placeholder.com/150" alt="Generate Bill" className="card-image" />
          <div className="card-content">
            <h3>Generate Bill</h3>
          </div>
        </div>

        {/* Card with image */}
        <div className="card" onClick={() => handleButtonClick('/contact-us')}>
          <img src="https://via.placeholder.com/150" alt="Contact Us" className="card-image" />
          <div className="card-content">
            <h3>Contact Us</h3>
          </div>
        </div>

        {/* Card with image */}
        <div className="card" onClick={() => handleButtonClick('/order-status')}>
          <img src="https://via.placeholder.com/150" alt="Order Status" className="card-image" />
          <div className="card-content">
            <h3>Order Status</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
