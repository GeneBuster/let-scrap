import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');  

    if (token) {
      axios
        .get('http://localhost:5000/api/auth/dashboard', {  
          headers: { Authorization: `Bearer ${token}` },  
        })
        .then((response) => {
          setMessage(response.data.message);  
        })
        .catch((error) => {
          setMessage('Failed to load protected content');  
        });
    } else {
      setMessage('You need to log in');  
    }
  }, []);

  return (
    <div>
      <h1>{message}</h1>  {/* Display the fetched message */}
    </div>
  );
};

export default HomePage;