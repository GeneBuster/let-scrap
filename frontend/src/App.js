import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import ScrapRequest from "./pages/PickupRequests";
import Dealers from "./pages/dealers.jsx";
import History from "./pages/history.jsx";
import Contact from "./pages/contact.jsx";
import BillGen from "./pages/billgen.jsx"
// import HomePage from './pages/homepage.jsx'; 
import Home from './pages/home.jsx'
import DashBoard from "./pages/dashboard.jsx";
import ProfilePage from "./pages/profilePage.jsx";
import ManageScrapRequests from "./pages/managescrapreq.jsx";
import DealerDashboard from "./pages/DealerDashboard.jsx"; 
import UserDashboard from "./pages/UserDashboard.jsx";
import PickupStatus from "./pages/PickupStatus.jsx"

function App() {
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole"); 
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/dealer-dashboard" element={<DealerDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        
        <Route path="/history" element={<History />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bill-generation" element={<BillGen />} />
        <Route path="/pickup-requests" element={<ScrapRequest />} />
        <Route path="/order-status" element={<ManageScrapRequests/>} />
        <Route path="/pickup-status" element={<PickupStatus />} />
      </Routes>

    </Router>
  );
}

export default App;