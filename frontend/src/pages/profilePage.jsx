import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profilePicture from '../resource/pfp.jpg'

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

    if (token) {
      // If the token exists, make an API call to fetch the user's full profile
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
      setError('Please log in first');
    }
  }, []);

  if (error) {
    return <div style={styles.errorMessage}>{error}</div>; // Show the error message
  }

  if (!user) {
    return <div style={styles.loadingMessage}>Loading...</div>; // Show loading message while waiting for the API response
  }

  return (
    <div style={styles.profilePageContainer}>
      <h2 style={styles.pageTitle}>Profile Details</h2>
      <div style={styles.profileDetails}>
        {/* Profile Image */}
        <div style={styles.profilePfp}>
          <img
            src={profilePicture || 'https://via.placeholder.com/100'}
            alt="Profile"
            style={styles.profilePfpImg}
          />
        </div>
        {/* User Info */}
        <div style={styles.profileInfo}>
          <p style={styles.profileInfoName}>{user.name}</p>
          <p style={styles.profileInfoText}>Email: {user.email}</p>
          <p style={styles.profileInfoText}>Phone: {user.phone || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  profilePageContainer: {
    backgroundColor: '#f8f9fc',
    padding: '40px 20px',
    fontFamily: "'Arial', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh', // Full height of the screen
  },
  pageTitle: {
    color: '#4A4A4A',
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  profileDetails: {
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    width: '100%',
    maxWidth: '700px',
    marginTop: '30px',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  },
  profilePfp: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '4px solid #ff4f5a',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out',
    cursor: 'pointer',
  },
  profilePfpImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileInfo: {
    flexGrow: '1',
    paddingLeft: '20px',
  },
  profileInfoName: {
    fontSize: '28px',
    color: '#333',
    fontWeight: '600',
    marginBottom: '10px',
  },
  profileInfoText: {
    fontSize: '18px',
    color: '#666',
    margin: '5px 0',
  },
  errorMessage: {
    color: '#d9534f',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingMessage: {
    color: '#f0ad4e',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

export default ProfilePage;
