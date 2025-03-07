import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Home from "./pages/home.jsx";
import LoginPage from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import PickupRequests from "./pages/PickupRequests";
import Dealers from "./pages/dealers.jsx";
import History from "./pages/history.jsx";
import Contact from "./pages/contact.jsx";
import HomePage from './pages/homepage.jsx'; 
import BillGen from "./pages/billgen.jsx";
import ScrapRequest from "./pages/PickupRequests.jsx";
import ManageScrapRequests from "./pages/managescrapreq.jsx";

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
        <Route path="/home" element={<HomePage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/generate-bill" element={<BillGen />} />
        <Route path="/scrap-request" element={<ScrapRequest userId={userId} />} />
        <Route path="/manage-requests" element={<ManageScrapRequests userId={userId} />} />
      </Routes>

    </Router>
  );
}

export default App;
