import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import LoginModal from "../components/LoginModal"; // ✅ Adjust path if needed

const API_BASE_URL = "http://localhost:8080";

const Dashboard = ({ onSeeMore, onLoginSuccess }) => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [javaResources, setJavaResources] = useState([]);
  const [udemyResources, setUdemyResources] = useState([]);
  const [loadingJava, setLoadingJava] = useState(true);
  const [loadingUdemy, setLoadingUdemy] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();
  const searchRef = useRef(null);

  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      const parsed = stored && stored !== "undefined" ? JSON.parse(stored) : null;
      return parsed;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    fetchJavaResources();
    fetchUdemyResources();
  }, []);

  const fetchJavaResources = async () => {
    setLoadingJava(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/resources/search?title=java`);
      setJavaResources(res.data.slice(0, 6));
    } catch (err) {
      console.error("Java fetch error", err);
    } finally {
      setLoadingJava(false);
    }
  };

  const fetchUdemyResources = async () => {
    setLoadingUdemy(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/resources/filter/platform?platform=udemy`);
      setUdemyResources(res.data.slice(0, 6));
    } catch (err) {
      console.error("Udemy fetch error", err);
    } finally {
      setLoadingUdemy(false);
    }
  };

  const fetchSuggestions = async (input) => {
    if (!input.trim()) return setSuggestions([]);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/resources/search?title=${encodeURIComponent(input)}`);
      const titles = [...new Set(res.data.map((item) => item.title))];
      setSuggestions(titles);
    } catch {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchSuggestions(keyword), 300);
    return () => clearTimeout(timeout);
  }, [keyword]);

  const handleSuggestionClick = (sug) => {
    navigate(`/search/${encodeURIComponent(sug)}`);
    setKeyword("");
    setSuggestions([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${encodeURIComponent(keyword)}`);
      setSuggestions([]);
    }
  };

  const ResourceGrid = ({ title, resources, loading, seeMoreKeyword }) => (
    <div className="max-w-6xl mx-auto px-4 mt-16 animate-fade-in text-white">
      <h2 className="text-2xl font-sketch mb-6 text-orange-400">{title}</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <p className="text-gray-300">No resources found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-slide-down">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-md p-6 transition-transform duration-300 hover:scale-[1.02] flex flex-col text-white"
              >
                <img
                  src={res.courseImagePath ? `${API_BASE_URL}${res.courseImagePath}` : ""}
                  alt={res.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />

                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-sketch text-orange-400">{res.title}</h3>
                  <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                    {res.platform}
                  </span>
                </div>

                <p className="text-gray-100 mb-4 line-clamp-3">{res.description}</p>

                <div className="text-sm text-gray-200 mb-2">
                  <p><strong>Price:</strong> ₹{res.price}</p>
                </div>

                <a
                  href={res.courseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-orange-300 hover:underline mb-4"
                >
                  Go to Course
                </a>

                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-medium text-gray-200">Shared by:</p>
                  {res.ownerProfilePic && (
                    <img
                      src={`${API_BASE_URL}${res.ownerProfilePic}`}
                      alt="owner"
                      className="w-7 h-7 rounded-full border"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-100">{res.ownerName}</span>
                </div>

                <button
                  onClick={() => {
                    if (!user) {
                      setShowLoginModal(true);
                    } else if (user.id === res.ownerId) {
                      navigate("/profile");
                    } else if (res.ownerId) {
                      navigate(`/user/${res.ownerId}`);
                    } else {
                      console.error("Owner ID is undefined!");
                    }
                  }}
                  className="bg-transparent border border-orange-500 text-orange-500 rounded px-4 py-2 hover:bg-orange-600 hover:text-white transition"
                >
                  Connect with Owner
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onSeeMore(seeMoreKeyword)}
              className="px-6 py-2 bg-orange-700 text-white rounded hover:bg-orange-800 transition-transform transform hover:scale-105"
            >
              See More {title}
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen text-white">
      <div className="flex-grow">
        <div className="py-10 px-4 max-w-6xl mx-auto animate-fade-in">
          {user && (
            <h2 className="text-2xl mb-4 text-center md:text-left text-orange-400" style={{ fontFamily: '"Rubik Storm", system-ui' }}>
              Welcome back, {user.name}
            </h2>
          )}
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg flex flex-col md:flex-row items-center justify-between shadow-sm animate-slide-down">
            <div className="max-w-md text-center md:text-left">
              <h3 className="text-2xl mb-2 text-orange-400" style={{ fontFamily: '"Rubik Storm", system-ui' }}>
                Access curated learning resources shared by real users
              </h3>
              <p className="text-white/80 mb-3 text-sm">
                Start learning with handpicked courses across tech, design, business, and more.
              </p>
              <button
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-transform transform hover:scale-105"
                onClick={() => searchRef.current?.scrollIntoView({ behavior: "smooth" })}
                style={{ fontFamily: '"Rubik Storm", system-ui' }}
              >
                Start Exploring
              </button>
            </div>
            <div className="hidden md:block w-32 h-32 rounded-full bg-orange-600 ml-4"></div>
          </div>
        </div>

        <div ref={searchRef} className="text-center py-16 px-4 animate-fade-in">
          <h1 className="text-4xl mb-8 text-orange-400" style={{ fontFamily: '"Rubik Storm", system-ui' }}>
            Explore by passion, share with purpose
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto animate-slide-down">
            <div className="flex items-center border-b-2 border-white/40 focus-within:border-orange-500 transition-colors duration-300">
              <FiSearch className="ml-2 text-gray-300 text-xl" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Resources..."
                className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-lg text-white"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-black/80 border border-gray-700 shadow-md mt-1 rounded z-10 max-h-60 overflow-y-auto animate-fade-in text-left">
                {suggestions.map((sug, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(sug)}
                    className="px-4 py-2 hover:bg-gray-800 cursor-pointer text-white"
                  >
                    {sug}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="mt-10">
            <h2 className="text-2xl text-orange-400" style={{ fontFamily: '"Rubik Storm", system-ui' }}>
              Let's start learning
            </h2>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-in">
            {["Design", "Marketing", "eCommerce", "Python","Ui/Ux"].map((tag, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(tag)}
                className="px-4 py-2 bg-white/10 text-white rounded-full text-sm hover:bg-white/20 transition-transform transform hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <ResourceGrid title="Java Courses" resources={javaResources} loading={loadingJava} seeMoreKeyword="java" />
        <ResourceGrid title="Udemy Courses" resources={udemyResources} loading={loadingUdemy} seeMoreKeyword="udemy" />
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(userData) => {
            setShowLoginModal(false);
            onLoginSuccess(userData); // ✅ Proper callback
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
