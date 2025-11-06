import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, role, user } = response.data;

      // ✅ Store everything in one unified object for socket + API access
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          token,
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        })
      );

      // --- Optional: Backward compatibility for older pages (you can remove later)
      const userInfo = {
        token,
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));


      // ✅ Role-based redirection
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'dealer') {
        localStorage.setItem('dealerId', user.id);
        navigate('/dealer-dashboard');
      } else {
        navigate('/user-dashboard');
      }

      // ✅ Dispatch event for socket auto-connect in all tabs
      window.dispatchEvent(new Event('authChange'));

    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
          >
            Login
          </button>
        </form>

        {error && <div className="mt-4 text-center text-red-600">{error}</div>}

        <div className="mt-4 text-center">
          <p className="text-gray-700">Don't have an account?</p>
          <Link
            to="/signup"
            className="text-blue-600 hover:underline font-semibold"
          >
            Sign Up Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
