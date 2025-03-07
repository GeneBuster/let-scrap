
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);  // State to store user profile
  const [error, setError] = useState(null);  // State to store error message

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');  // Get the token from localStorage

      if (token) {
        try {
          // Make an API call to get the user's profile
          const response = await axios.get('http://localhost:5000/api/protected/profile', {
            headers: { Authorization: `Bearer ${token}` },  // Pass token in Authorization header
          });

          setUser(response.data.user);  // Set user data to state
        } catch (err) {
          setError('Error fetching profile');
          console.error(err);
        }
      } else {
        setError('User is not logged in');
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <h2>Name: {user.name}</h2>
        <h3>Email: {user.email}</h3>
        <h4>Phone: {user.phone}</h4>
      </div>
    </div>
  );
};

export default ProfilePage;
