import React, { useState } from 'react';
import axios from 'axios';

const ScrapRequest = () => {
  const [scrapType, setScrapType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [preferredPickupTime, setPreferredPickupTime] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!scrapType || !quantity || !pickupAddress || !preferredPickupTime) {
      setError('Please fill in all the fields.');
      return;
    }

    const requestData = {
      scrapType,
      quantity,
      pickupAddress,
      preferredPickupTime,
    };

    try {
      // Send the pickup request to the backend
      const response = await axios.post('http://localhost:5000/api/request/pickup-request', requestData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setSuccessMessage('Scrap pickup request submitted successfully!');
      setError(null); // Clear any previous error messages
    } catch (err) {
      console.error('Error submitting pickup request:', err);
      setError('There was an error submitting your request.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Request Scrap Pickup</h2>
      {error && <div style={styles.errorMessage}>{error}</div>}
      {successMessage && <div style={styles.successMessage}>{successMessage}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Scrap Type</label>
          <input
            type="text"
            value={scrapType}
            onChange={(e) => setScrapType(e.target.value)}
            placeholder="e.g., Metal, Plastic, Paper"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Pickup Address</label>
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Enter pickup address"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Preferred Pickup Time</label>
          <input
            type="datetime-local"
            value={preferredPickupTime}
            onChange={(e) => setPreferredPickupTime(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.submitButton}>Submit Request</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    marginTop: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  errorMessage: {
    color: '#d9534f',
    fontSize: '16px',
    marginBottom: '10px',
  },
  successMessage: {
    color: '#28a745',
    fontSize: '16px',
    marginBottom: '10px',
  },
};

export default ScrapRequest;
