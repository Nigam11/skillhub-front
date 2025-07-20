// [No changes in imports]
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { Menu } from "lucide-react";
import defaultAvatar from "../assets/images/default-avatar.png";
import ShareResourceModal from "../pages/ShareResourceModal";
import LoginModal from "./LoginModal";
import { useTranslation } from "react-i18next";

const Navbar = ({ onLogin, onSignup, user, setUser }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      fetch("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, [user, setUser]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const changeLanguage = (lang) => i18n.changeLanguage(lang);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate(0);
    }
  };

  const handleShareClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      setShowShareModal(true);
    }
  };

  const userImage = user?.profilePic
    ? `http://localhost:8080${user.profilePic}`
    : defaultAvatar;

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out capitalize 
        ${scrolled
          ? "bg-black/60 shadow-xl border-b border-white/20"
          : "bg-transparent md:bg-white/10 border-b border-transparent"
        } backdrop-blur-lg`}
      >
        <div className="relative max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <span className="text-2xl text-orange-500 font-rubikStorm"style={{ fontFamily: '"Rubik Storm", system-ui' }}>
              SKILLHUB
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-orange-500">
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="text-sm border border-white text-white px-2 py-1 rounded bg-transparent hover:border-blue-400"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>

            <button onClick={handleShareClick} className="transition-colors duration-200">
              {t("ShareResource")}
            </button>

            <a href="#help" className="transition-colors duration-200">
              {t("Help")}
            </a>

            <Link to="/about" className="transition-colors duration-200">
              {t("About")}
            </Link>

            {!user ? (
              <>
                <button onClick={onLogin} className="transition-colors duration-200">
                  {t("login")}
                </button>
                <button
                  onClick={onSignup}
                  className="px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 text-sm"
                >
                  {t("signup")}
                </button>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={userImage}
                  onError={(e) => (e.target.src = defaultAvatar)}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border transition-transform duration-200 hover:scale-105"
                  onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/30 backdrop-blur-lg border rounded-lg shadow-md z-50 animate-fade-in origin-top-right transition-opacity duration-300">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-orange-500 hover:bg-orange-100 transition"
                    >
                      {t("myAccount")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition"
                    >
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button onClick={toggleMobileMenu} className="md:hidden z-50 transition-transform hover:scale-110">
            <Menu className="w-6 h-6 text-orange-500" />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-full left-0 w-full bg-cover bg-center bg-no-repeat backdrop-blur-md shadow-lg z-40 md:hidden animate-slide-down transition-all duration-300 text-orange-500"
            style={{
              backgroundImage: `url('/assets/images/universal-bg.jpg')`,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block hover:text-orange-600 transition"
                >
                  {t("MyAccount")}
                </Link>
              )}

              <button
                onClick={() => {
                  handleShareClick();
                  setIsMobileMenuOpen(false);
                }}
                className="block hover:text-orange-600 transition"
              >
                {t("ShareResource")}
              </button>

              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block hover:text-orange-600 transition"
              >
                {t("About")}
              </Link>

              <a
                href="#help"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block hover:text-orange-600 transition"
              >
                {t("Help")}
              </a>

              {!user ? (
                <>
                  <button
                    onClick={onLogin}
                    className="block w-full text-left hover:text-orange-600 transition"
                  >
                    {t("login")}
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onSignup(); // ✅ Added this
                    }}
                    className="w-full text-left px-4 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 text-sm"
                  >
                    {t("signup")}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-800 transition"
                >
                  {t("logout")}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {showShareModal && <ShareResourceModal onClose={() => setShowShareModal(false)} />}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(userData) => {
            setUser(userData);
            setShowLoginModal(false);
            setShowShareModal(true);
          }}
          openSignup={onSignup}
        />
      )}
    </>
  );
};

export default Navbar;
