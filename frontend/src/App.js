import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

// 1. Import the AdminRoute component we created.
import AdminRoute from "./components/AdminRoute.jsx";
// 2. Import the AdminDashboard page (we will create this next).
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
  return (
    <Router>
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
        {/* 3. Wrap all admin pages inside the AdminRoute component. */}
        {/* This acts as a gatekeeper for the nested routes. */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* You can add more admin pages here later, like: */}
          {/* <Route path="/admin/users" element={<UserManagementPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
