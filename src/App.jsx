import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// import PrimaryNavbar from "./components/navbars/PrimaryNavbar.jsx";
// import handleSubmit from "./components/firebase/handleSubmit.js";
import PageNotFound from "./pages/common_submodule/PageNotFound";
import Login from "./pages/auth_module/Login";
import Register from "./pages/auth_module/Register";
import VerifyEmail from "./pages/auth_module/VerifyEmail";
import { AuthProvider } from "./components/firebase/AuthContext";
import Home from "./pages/common_submodule/Home";

export default function App() {
  // User state
  const [currentUser, setCurrentUser] = useState(null);
  const [timeActive, setTimeActive] = useState(false);

  // Check if the user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [currentUser]);

  return (
    <>
      <div className="App">
        <AuthProvider value={{ currentUser, timeActive, setTimeActive }}>
          <Routes>
            {/* Default pages */}
            <Route path="*" element={<PageNotFound />} />
            <Route
            path="/"
            element={
              !currentUser?.emailVerified ? (
                <Home />
              ) : (
                <Navigate to={`/${currentUser.uid}/dashboard`} replace />
              )
            }
          />

          <Route
            path="/login"
            element={
              !currentUser?.emailVerified ? (
                <Login />
              ) : (
                <Navigate to={`/${currentUser.uid}/dashboard`} replace />
              )
            }
          />
          <Route
            path="/register"
            element={
              !currentUser?.emailVerified ? (
                <Register />
              ) : (
                <Navigate to={`/${currentUser.uid}/dashboard`} replace />
              )
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </AuthProvider>
      </div>
    </>
  );
}
