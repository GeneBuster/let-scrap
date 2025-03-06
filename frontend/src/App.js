import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import PickupRequests from "./pages/PickupRequests";
import Dealers from "./pages/dealers.jsx";
import History from "./pages/history.jsx";
import Contact from "./pages/contact.jsx";
import HomePage from './pages/homepage.jsx'; 
import Home from './pages/home.jsx'
import DashBoard from "./pages/dashboard.jsx";
function App() {
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
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/api/auth/dashboard" element={<DashBoard/>} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
      </Routes>

    </Router>
  );
}

export default App;
