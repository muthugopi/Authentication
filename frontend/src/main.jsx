import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Admin from './components/adminPanel.jsx'
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Profile from './components/Profile.jsx';


const getToken = () => localStorage.getItem("token");

const router = createBrowserRouter([
  {
    path: '/',
    element: <Admin />
  },
  {
    path: '/login',
    element: !getToken() ? <Login /> : <Navigate to="/profile" />
  },
  {
    path: '/register',
    element: !getToken() ? <Register /> : <Navigate to="/profile" />
  },
  {
    path: '/profile',
    element: getToken() ? <Profile /> : <Navigate to="/login" />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
