// import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom'; // If using react-router for navigation
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate ();


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: email,
        password: password,
      });

      localStorage.setItem('token', response.data.token);

      navigate('/api/auth/dashboard'); 
    } catch (err) {
      console.error('login error', err.response || err);
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {error && <div>{error}</div>}
    </div>
  );
};


export default LoginPage;





// const Login = () => {
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-blue-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <form>
//           <div className="mb-4">
//             <label className="block text-gray-700">Email</label>
//             <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your email" />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Password</label>
//             <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your password" />
//           </div>
//           <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Login</button>
//         </form>
//         <p className="mt-4 text-center text-gray-600">
//           Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
