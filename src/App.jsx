import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./components/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import PageNotFound from "./pages/common_submodule/PageNotFound";
import Login from "./pages/auth_module/Login";
import Register from "./pages/auth_module/Register";
import VerifyEmail from "./pages/auth_module/VerifyEmail";
import { AuthProvider } from "./components/firebase/AuthContext";
import Home from "./pages/common_submodule/Home";
import PrivateRoute from "./components/private_route/PrivateRoute";
import DashBoard from "./pages/common_submodule/DashBoard";
import Loading from "./components/data_fetch_state/Loading";
import Profile from "./components/profile/Profile";

export default function App() {
  // User state
  const [userType, setUserType] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [timeActive, setTimeActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if the user is logged in
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Use the user object retrieved from localStorage
        const storedUser = localStorage.getItem("upd");
        if (storedUser) {
          const user_det = JSON.parse(storedUser);
          setUserType(user_det.user_type);
          setLoading(false);
        } else {
          // Handle the case when the "upd" item is not found in localStorage
          console.log("No user data found");
        }
      }
      setLoading(false);
    });
  }, [currentUser]);

  return (
    <>
      <div className="App">
        <AuthProvider value={{ currentUser, timeActive, setTimeActive }}>
          {loading ? (
            <Loading />
          ) : (
            <Routes>
              {/* If the url is invalid */}
              <Route path="*" element={<PageNotFound />} />

              {/* AUthentication and authorization */}
              <Route
                path="/"
                element={
                  !currentUser?.emailVerified ? (
                    <Home />
                  ) : (
                    <Navigate to={`/${userType}/dashboard`} replace />
                  )
                }
              />

              <Route
                path="/login"
                element={
                  !currentUser?.emailVerified ? (
                    <Login />
                  ) : (
                    <Navigate to={`/${userType}/dashboard`} replace />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  !currentUser?.emailVerified ? (
                    <Register />
                  ) : (
                    <Navigate to={`/${userType}/dashboard`} replace />
                  )
                }
              />
              <Route path="/verify-email" element={<VerifyEmail />} />

              <Route
                exact
                path={`/:uid/profile`}
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Admin pages */}
              <Route
                exact
                path={`/:uid/dashboard`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={`/:uid/users`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />

              {/* Content management pages */}
              <Route
                exact
                path={`/:uid/dashboard`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={`/:uid/media`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />
              <Route
                exact
                path={`/:uid/blogs`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />

              {/* Event management pages */}
              <Route
                exact
                path={`/:uid/dashboard`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />

              <Route
                exact
                path={`/:uid/events`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />

              <Route
                exact
                path={`/:uid/participants`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />

              {/* Back office pages */}
              <Route
                exact
                path={`/:uid/dashboard`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />

              <Route
                exact
                path={`/:uid/documents`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />

              <Route
                exact
                path={`/:uid/reports`}
                element={
                  <PrivateRoute>
                    <DashBoard />
                  </PrivateRoute>
                }
              />
            </Routes>
          )}
        </AuthProvider>
      </div>
    </>
  );
}
