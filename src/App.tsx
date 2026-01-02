import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { useAuth } from "./contexts/AuthContext";
import type { ReactNode } from "react";
import { VerifyEmail } from "./pages/VerifyEmail";
import { Register } from "./pages/register";
import Logout from "./components/Logout";
import { ErrorPage } from "./pages/error";
import { LoadingPage } from "./pages/loading";
import { Log } from "./pages/log";

function PrivateRoute({ children }: { children: ReactNode }) {
  const { authState, loading } = useAuth();
  if (loading) {
    return <LoadingPage />;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const { authState } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          authState.isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/login"
        element={
          authState.isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          authState.isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <Register />
          )
        }
      />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/error" element={<ErrorPage />} />
      {}
      <Route path="/log" element={<PrivateRoute children={<Log />} />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute children={<Dashboard />} />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
