import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import MakeMeAdmin from "./pages/MakeMeAdmin";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminPanel from "./pages/AdminPanel";
// import PublicMessage from "./pages/PublicMessage";
// import Navbar from "./components/Navbar";
// import NotFound from "./components/NotFound";
// import ToastContainer from './components/ToastContainer'
// import Profile from "./pages/Profile";
import Closed from "./pages/Closed";

import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Closed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
