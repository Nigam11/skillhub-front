// src/pages/SearchPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";
import LoginModal from "../components/LoginModal";

const API_BASE_URL = "http://localhost:8080";

const SearchPage = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const platformKeywords = ["udemy", "coursera", "edx", "youtube"];
        const endpoint = platformKeywords.includes(keyword.toLowerCase())
          ? `/api/resources/filter/platform?platform=${encodeURIComponent(keyword)}`
          : `/api/resources/search?title=${encodeURIComponent(keyword)}`;

        const response = await axios.get(`${API_BASE_URL}${endpoint}`);
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        if (!token) return;
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoggedInUserId(res.data.id);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    fetchResources();
    fetchUser();
  }, [keyword]);

  const handleConnect = (resource) => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    if (resource.ownerId === loggedInUserId) {
      navigate("/profile");
    } else {
      navigate(`/user/${resource.ownerId}`);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-orange-400" style={{ fontFamily: '"Rubik Storm", system-ui' }}>
          Search results for: <span className="text-white">"{keyword}"</span>
        </h2>

        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : resources.length === 0 ? (
          <p className="text-gray-300">No resources found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-slide-down">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-md p-6 transition-transform duration-300 hover:scale-[1.02] flex flex-col text-white"
              >
                <img
                  src={res.courseImagePath ? `${API_BASE_URL}${res.courseImagePath}` : defaultAvatar}
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

                <p className="text-sm text-gray-200 mb-2">
                  <strong>Price:</strong> ₹{res.price}
                </p>

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
                  onClick={() => handleConnect(res)}
                  className="bg-transparent border border-orange-500 text-orange-500 rounded px-4 py-2 hover:bg-orange-600 hover:text-white transition"
                >
                  {loggedInUserId === res.ownerId ? "Connect with Owner" : "Connect with Owner"}
                </button>
              </div>
            ))}
          </div>
        )}

        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={() => {
              setShowLoginModal(false);
              window.location.reload();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
