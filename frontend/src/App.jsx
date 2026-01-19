import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import MakeMeAdmin from "./pages/MakeMeAdmin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import PublicMessage from "./pages/PublicMessage";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import ToastContainer from './components/ToastContainer'
import Profile from "./pages/Profile";
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />  
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/verify-admin" element={<MakeMeAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path='/message' element={<PublicMessage />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
