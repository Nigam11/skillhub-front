import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import SearchPage from "./pages/SearchPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProfilePage from "./pages/ProfilePage";
import UserProfile from "./pages/UserProfile";
import EditProfilePage from "./pages/EditProfilePage";
import EditResourcePage from "./pages/EditResourcePage";
import Navbar from "./components/Navbar";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import Footer from "./components/Footer";
import AboutUs from "./pages/AboutUs";
import axios from "axios";

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [pendingResource, setPendingResource] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      });
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setShowLogin(false);

    const redirectTo = localStorage.getItem("redirectTo");
    if (redirectTo) {
      localStorage.removeItem("redirectTo");
      navigate(redirectTo);
    } else if (pendingResource) {
      const isOwner = pendingResource.owner || pendingResource.isOwner;
      const target = isOwner ? "/profile" : `/user/${pendingResource.ownerId}`;
      setPendingResource(null);
      navigate(target);
    } else {
      navigate("/dashboard");
    }
  };

  const handleConnectClick = (res) => {
    if (!res) return;
    const isOwner = res.owner || res.isOwner;
    const target = isOwner ? "/profile" : `/user/${res.ownerId}`;
    const token = localStorage.getItem("token");

    if (!token) {
      setPendingResource(res);
      setShowLogin(true);
    } else {
      navigate(target);
    }
  };

  const handleSeeMoreClick = (keyword) => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectTo", `/search/${keyword}`);
      setShowLogin(true);
    } else {
      navigate(`/search/${keyword}`);
    }
  };

  return (
    <>
      <Navbar
        onLogin={() => setShowLogin(true)}
        onSignup={() => setShowSignup(true)}
        user={user}
        setUser={setUser}
      />

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
    </>
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
