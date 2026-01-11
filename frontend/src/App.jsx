import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import MakeMeAdmin from "./components/makeMeAdmin";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPanel from "./components/adminPanel";
import PublicMessage from "./components/PublicMessage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />  
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<MakeMeAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<AdminPanel />} />
        <Route path='/message' element={<PublicMessage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
