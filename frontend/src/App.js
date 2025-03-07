import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import PickupRequests from "./pages/PickupRequests";
import Dealers from "./pages/dealers.jsx";
import History from "./pages/history.jsx";
import Contact from "./pages/contact.jsx";

// import HomePage from './pages/homepage.jsx'; 
import Home from './pages/home.jsx'
import DashBoard from "./pages/dashboard.jsx";
import ProfilePage from "./pages/profilePage.jsx";

function App() {
  const userId = localStorage.getItem("userId");
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/pickup-requests" element={<PickupRequests />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/history" element={<History />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage/>} />

      </Routes>

    </Router>
  );
}

export default App;