import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import PickupRequests from "./pages/PickupRequests";
import Dealers from "./pages/dealers.jsx";
import History from "./pages/history.jsx";
import Contact from "./pages/contact.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pickup-requests" element={<PickupRequests />} />
        <Route path="/dealers" element={<Dealers />} />
        <Route path="/history" element={<History />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
