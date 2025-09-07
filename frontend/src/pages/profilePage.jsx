import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profilePicture from '../resource/pfp.jpg'


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);  // Track if the user is editing their info
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

    if (token) {
      // If the token exists, make an API call to fetch the user's full profile
      axios
        .get('https://let-scrap.vercel.app/api/users/profile', {
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

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdatedUserInfo({
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address || '', // Ensure address is available, default to empty if not present
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      // Send PUT request to update user profile
      const response = await axios.put(
        'https://let-scrap.vercel.app/api/users/profile',
        updatedUserInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data.user); // Update user with the response data
      setIsEditing(false); // Close the edit mode
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

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
        <div style={styles.profilePfp}>
          <img
            src={profilePicture || 'https://via.placeholder.com/100'}
            alt="Profile"
            style={styles.profilePfpImg}
          />
        </div>
        <div style={styles.profileInfo}>
          {isEditing ? (
            <form onSubmit={handleUpdateSubmit} style={styles.editForm}>
              <input
                type="text"
                name="name"
                value={updatedUserInfo.name}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your name"
              />
              <input
                type="email"
                name="email"
                value={updatedUserInfo.email}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your email"
              />
              <input
                type="text"
                name="phone"
                value={updatedUserInfo.phone}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your phone number"
              />
              <input
                type="text"
                name="address"
                value={updatedUserInfo.address}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your address"
              />
              <button type="submit" style={styles.submitButton}>
                Save Changes
              </button>
            </form>
          ) : (
            <>
              <p style={styles.profileInfoName}>{user.name}</p>
              <p style={styles.profileInfoText}>Email: {user.email}</p>
              <p style={styles.profileInfoText}>Phone: {user.phone || 'N/A'}</p>
              <p style={styles.profileInfoText}>
                Address: {typeof user.address === 'string' ? user.address : 'N/A'}
              </p>
             <button onClick={handleEditClick} style={styles.editButton}>
                Update Information
              </button>
            </>
          )}
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
  editButton: {
    backgroundColor: '#ff4f5a',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default ProfilePage;
