
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

// Create a wrapper component to properly order the providers
const AppWithProviders = () => {
  return (
    <RouterProvider router={router} />
  );
};

function App() {
  return (
    <AuthProvider>
      <AppWithProviders />
      <UnifiedFloatingAction />
    </AuthProvider>
  );
}

export default App;
