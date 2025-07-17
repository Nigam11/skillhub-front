// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const Dashboard = ({ onConnect, onSeeMore }) => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [javaResources, setJavaResources] = useState([]);
  const [udemyResources, setUdemyResources] = useState([]);
  const [loadingJava, setLoadingJava] = useState(true);
  const [loadingUdemy, setLoadingUdemy] = useState(true);
  const navigate = useNavigate();
  const searchRef = useRef(null);

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
    } catch (err) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    fetchJavaResources();
    fetchUdemyResources();
  }, []);

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
    <div className="max-w-6xl mx-auto px-4 mt-16 animate-fade-in">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : resources.length === 0 ? (
        <p className="text-gray-600">No resources found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-slide-down">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white border rounded-lg shadow-md p-5 hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-300 animate-fade-in"
              >
                {res.courseImagePath ? (
                  <img
                    src={`http://localhost:8080${res.courseImagePath}`}
                    alt={res.title}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded mb-4 text-gray-400 text-sm">
                    No Image Available
                  </div>
                )}

                <h3 className="text-xl font-bold mb-2">{res.title}</h3>
                <p className="text-gray-700 mb-2 text-sm">{res.description}</p>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Platform:</strong> {res.platform}</p>
                  <p><strong>Price:</strong> ₹{res.price}</p>
                </div>

                {res.courseLink && (
                  <a
                    href={res.courseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 mt-2 hover:underline"
                  >
                    Visit Course
                  </a>
                )}

                <div className="mt-4 text-sm text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600 text-sm font-medium">Shared by:</p>
                    {res.ownerProfilePic && (
                      <img
                        src={`http://localhost:8080${res.ownerProfilePic}`}
                        alt="owner"
                        className="w-7 h-7 rounded-full border"
                      />
                    )}
                    <span className="text-gray-700 text-sm font-medium">{res.ownerName}</span>
                  </div>
                  <button
                    onClick={() => onConnect(res)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-transform transform hover:scale-105"
                  >
                    {res.isOwner ? "View Your Profile" : "Connect with Owner"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onSeeMore(seeMoreKeyword)}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-transform transform hover:scale-105"
            >
              See More {title}
            </button>
          </div>
        </>
      )}
    </div>
  );

  const user = (() => {
    try {
      const stored = localStorage.getItem("user");
      return stored && stored !== "undefined" ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-grow">
        <div className="bg-white py-10 px-4 max-w-6xl mx-auto animate-fade-in">
          {user && (
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
              Welcome back, {user.name}
            </h2>
          )}
          <div className="bg-blue-100 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between shadow-sm animate-slide-down">
            <div className="max-w-md text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-2">
                Access curated learning resources shared by real users
              </h3>
              <p className="text-gray-700 mb-3 text-sm">
                Start learning with handpicked courses across tech, design, business, and more.
              </p>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-transform transform hover:scale-105"
                onClick={() => searchRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Start Exploring
              </button>
            </div>
            <div className="hidden md:block w-32 h-32 rounded-full bg-purple-300 ml-4"></div>
          </div>
        </div>

        {/* Search UI */}
        <div ref={searchRef} className="text-center py-16 px-4 animate-fade-in">
          <h1 className="text-4xl font-semibold mb-8">Explore by passion, share with purpose</h1>

          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto animate-slide-down">
            <div className="flex items-center border-b-2 border-gray-300 focus-within:border-blue-500 transition-colors duration-300">
              <FiSearch className="ml-2 text-gray-400 text-xl" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Resources..."
                className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-lg"
              />
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border shadow-md mt-1 rounded z-10 max-h-60 overflow-y-auto animate-fade-in">
                {suggestions.map((sug, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(sug)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {sug}
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800">Let's start learning</h2>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-in">
            {["Top picks", "Design", "Marketing", "eCommerce", "Python"].map((tag, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(tag)}
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-transform transform hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Sections */}
        <ResourceGrid title="Java Courses" resources={javaResources} loading={loadingJava} seeMoreKeyword="java" />
        <ResourceGrid title="Udemy Courses" resources={udemyResources} loading={loadingUdemy} seeMoreKeyword="udemy" />
      </div>

      <div className="w-full py-4 bg-gray-100 text-center text-sm text-gray-500">
        {/* Sticky Footer Area */}
      </div>
    </div>
  );
};

export default Dashboard;
