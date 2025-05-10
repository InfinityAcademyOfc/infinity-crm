
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import UnifiedFloatingAction from "./components/chat/UnifiedFloatingAction";
import WhatsAppDashboard from "./pages/WhatsAppDashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <Navigate to="/app/whatsapp" />
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "whatsapp",
        element: <WhatsAppDashboard />
      }
    ]
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <UnifiedFloatingAction />
    </>
  );
}

export default App;
