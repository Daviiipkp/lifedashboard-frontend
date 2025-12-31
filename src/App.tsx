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


function PrivateRoute({children}: { children: ReactNode }) {
  const { authState , loading} = useAuth();
  if (loading) {
    return LoadingPage();
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login"/>;
  }

  return children;
}

function App() {
  const { authState} = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={authState.isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />
        <Route path="/login" element={authState.isAuthenticated ? <Navigate to="/dashboard" /> : <Login/>}  />
        <Route path="/register" element={authState.isAuthenticated ? <Navigate to="/dashboard" /> : <Register/>}  />
        <Route path="/verify" element={<VerifyEmail/>} />
        <Route path="/logout" element = {<Logout/>}/>
        <Route path="/error" element = {<ErrorPage/>}/>
        {}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;