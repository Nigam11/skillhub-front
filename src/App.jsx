// src/App.jsx
import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "./api/axios";

import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import UserProfile from "./pages/UserProfile";
import EditProfilePage from "./pages/EditProfilePage";
import EditResourcePage from "./pages/EditResourcePage";
import AboutUs from "./pages/AboutUs";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";

import backgroundImage from "./assets/images/COMO-HUNTER.jpg";
import ScrollToTop from "./components/ScrollToTop";

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
    } catch (err) {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [pendingResource, setPendingResource] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      api
        .get(`/api/users/me`)
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.error("Token expired or invalid:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setShowLogin(false);

    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const redirectTo = localStorage.getItem("redirectTo");

    if (redirectTo) {
      localStorage.removeItem("redirectTo");
      navigate(redirectTo);
    } else if (pendingResource) {
      const ownerId = pendingResource.ownerId;
      const isOwner = String(userData.id) === String(ownerId);
      setPendingResource(null);
      navigate(isOwner ? "/profile" : `/user/${ownerId}`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleConnectClick = async (ownerId) => {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined") {
      setShowLogin(true);
      return;
    }

    try {
      const res = await api.get(`/api/users/me`);
      const currentUser = res.data;
      const isOwner = parseInt(currentUser.id) === parseInt(ownerId);

      if (isOwner) {
        navigate("/profile");
      } else {
        navigate(`/user/${ownerId}`);
      }
    } catch (error) {
      console.error("Error fetching user info", error);
    }
  };

  const handleSeeMoreClick = (keyword) => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      localStorage.setItem("redirectTo", `/search/${keyword}`);
      setShowLogin(true);
    } else {
      navigate(`/search/${keyword}`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col pt-20"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar
        onLogin={() => setShowLogin(true)}
        onSignup={() => setShowSignup(true)}
        user={user}
        setUser={setUser}
      />

      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <Dashboard
                  onConnect={handleConnectClick}
                  onSeeMore={handleSeeMoreClick}
                />
              </PageWrapper>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PageWrapper>
                <Dashboard
                  onConnect={handleConnectClick}
                  onSeeMore={handleSeeMoreClick}
                />
              </PageWrapper>
            }
          />
          <Route
            path="/search/:keyword"
            element={
              <PageWrapper>
                <SearchPage
                  onConnect={handleConnectClick}
                  onSeeMore={handleSeeMoreClick}
                />
              </PageWrapper>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageWrapper>
                <ForgotPassword />
              </PageWrapper>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PageWrapper>
                <ResetPassword />
              </PageWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <PageWrapper>
                <ProfilePage setUser={setUser} />
              </PageWrapper>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <PageWrapper>
                <EditProfilePage />
              </PageWrapper>
            }
          />
          <Route
            path="/edit-resource/:id"
            element={
              <PageWrapper>
                <EditResourcePage />
              </PageWrapper>
            }
          />
          <Route
            path="/user/:id"
            element={
              <PageWrapper>
                <UserProfile />
              </PageWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <PageWrapper>
                <AboutUs />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
          openSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          openLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

export default function App() {
  return <AppWrapper />;
}
