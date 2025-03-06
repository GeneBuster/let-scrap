// Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  


  // Handle button click to navigate to different pages
  const handleButtonClick = (route) => {
    navigate(route);
  };


  return (

      <div className="actions">
        <button className="action-btn" onClick={() => handleButtonClick('/place-order')}>
          Place an Order
        </button>
        <button className="action-btn" onClick={() => handleButtonClick('/order-history')}>
          Order History
        </button>
        <button className="action-btn" onClick={() => handleButtonClick('/bill-generation')}>
          Generate Bill
        </button>
        <button className="action-btn" onClick={() => handleButtonClick('/contact-us')}>
          Contact Us
        </button>
        <button className="action-btn" onClick={() => handleButtonClick('/order-status')}>
          Order Status
        </button>
      </div>
  );
};

export default Dashboard;
