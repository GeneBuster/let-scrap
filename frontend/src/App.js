import React, { useState, useEffect } from "react"; // (NEW) Import hooks
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// --- (NEW) IMPORT THE SOCKET PROVIDER ---
import { SocketProvider } from "./context/SocketContext";

// --- Import all your pages ---
import LoginPage from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import ScrapRequest from "./pages/PickupRequests";
import History from "./pages/history.jsx";
import BillGen from "./pages/billgen.jsx"
import Home from './pages/home.jsx'
import DashBoard from "./pages/dashboard.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import ManageScrapRequests from "./pages/managescrapreq.jsx";
import DealerDashboard from "./pages/DealerDashboard.jsx"; 
import UserDashboard from "./pages/UserDashboard.jsx";
import PickupStatus from "./pages/PickupStatus.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// --- (NEW) SDE PATTERN: Helper function to get token from localStorage ---
const getTokenFromStorage = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo).token : null;
  } catch (error) {
    console.error("Failed to parse userInfo from localStorage", error);
    return null;
  }
};

function App() {
  // --- (NEW) SDE PATTERN: Hold the token in state ---
  // We use the function as a "lazy initializer" for useState,
  // so localStorage is only read *once* on initial app load.
  const [token, setToken] = useState(getTokenFromStorage);

  // --- (NEW) SDE PATTERN: Listen for auth changes ---
  // This effect ensures that if the user logs in or out in
  // another tab, this tab's socket connection updates.
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("[App.js] Storage changed, updating token.");
      setToken(getTokenFromStorage());
    };

    // Listen for the 'storage' event (occurs in other tabs)
    window.addEventListener('storage', handleStorageChange);

    // SDE: Your LoginPage and Logout logic should also dispatch
    // this custom event so this App component "reacts" instantly
    // without a page reload.
    // e.g., window.dispatchEvent(new Event('authChange'));
    window.addEventListener('authChange', handleStorageChange);


    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleStorageChange);
    };
  }, []); // Empty array means this runs only once on mount

  return (
    <Router>
      {/* (NEW) Wrap your Routes in the SocketProvider.
        We pass the `token` from our state.
        When `token` changes (from null to a value on login, or
        value to null on logout), the SocketProvider's internal
        useEffect will run and automatically connect/disconnect.
      */}
      <SocketProvider token={token}>
        <Routes>
          {/* --- Public and User Routes --- */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/dealer-dashboard" element={<DealerDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/bill-generation" element={<BillGen />} />
          <Route path="/pickup-requests" element={<ScrapRequest />} />
          <Route path="/order-status" element={<ManageScrapRequests/>} />
          <Route path="/pickup-status" element={<PickupStatus />} />

          {/* --- Admin-Only Routes --- */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* <Route path="/admin/users" element={<UserManagementPage />} /> */}
          </Route>
        </Routes>
      </SocketProvider>
    </Router>
  );
}

export default App;
