import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import Tasks from "./pages/Tasks";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Settings from "./pages/Settings";
import Kanban from "./pages/Kanban";
import Chat from "./pages/Chat";
import UnifiedFloatingAction from "./components/chat/UnifiedFloatingAction";
import WhatsAppDashboard from "./pages/WhatsAppDashboard";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "contacts",
        element: <Contacts />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
       {
        path: "kanban",
        element: <Kanban />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
  {
    path: "/app/whatsapp",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <WhatsAppDashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
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
