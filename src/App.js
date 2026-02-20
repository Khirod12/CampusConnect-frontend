import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useMemo } from "react";

import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

/* ================= SAFE TOKEN DECODE ================= */

const getUserData = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

/* ================= PROTECTED ROUTE ================= */

function ProtectedRoute({ children, role }) {
  const user = getUserData();

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role)
    return <Navigate to="/" replace />;

  return children;
}

/* ================= PUBLIC ROUTE (BLOCK IF LOGGED IN) ================= */

function PublicRoute({ children }) {
  const user = getUserData();

  if (user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* ================= APP ================= */

function App() {

  const user = useMemo(() => getUserData(), []);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 Landing Page */}
        <Route path="/" element={<Home />} />

        {/* 🔓 Login (Blocked if logged in) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 🔓 Register (Blocked if logged in) */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 👤 User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="user">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 👑 Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* ❌ Unknown Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
