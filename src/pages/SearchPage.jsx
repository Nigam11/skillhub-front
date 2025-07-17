import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoginModal from "../components/LoginModal";

const API_BASE_URL = "http://localhost:8080";

const SearchPage = ({ onConnect }) => {
  const { keyword } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = token ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        let res;
        const platformKeywords = ["udemy", "coursera", "edx", "youtube"];
        if (platformKeywords.includes(keyword.toLowerCase())) {
          res = await axios.get(
            `${API_BASE_URL}/api/resources/filter/platform?platform=${encodeURIComponent(
              keyword
            )}`
          );
        } else {
          res = await axios.get(
            `${API_BASE_URL}/api/resources/search?title=${encodeURIComponent(
              keyword
            )}`
          );
        }

        setResources(res.data);
      } catch (err) {
        console.error("Failed to fetch resources", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [keyword]);

  const handleConnectClick = (ownerId) => {
    if (!token && typeof onConnect === "function") {
      onConnect(ownerId);
    } else {
      if (currentUser && currentUser._id === ownerId) {
        navigate("/profile");
      } else {
        navigate(`/user/${ownerId}`);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">
        Search Results for:{" "}
        <span className="text-blue-600">"{keyword}"</span>
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : resources.length === 0 ? (
        <p className="text-gray-600">No resources found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((res) => (
            <div
              key={res.id}
              className="relative bg-white border rounded-lg shadow-md p-5 hover:shadow-lg transition"
            >
              {/* Course image */}
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
                <p>
                  <strong>Platform:</strong> {res.platform}
                </p>
                <p>
                  <strong>Price:</strong> ₹{res.price}
                </p>
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

              {/* Owner Info */}
              <div className="mt-4 text-sm text-gray-500 border-t pt-3">
                <div className="flex items-center gap-2">
                  <p className="text-gray-600 text-sm font-medium">
                    Shared by:
                  </p>
                  {res.ownerProfilePic && (
                    <img
                      src={`http://localhost:8080${res.ownerProfilePic}`}
                      alt="owner"
                      className="w-7 h-7 rounded-full border"
                    />
                  )}
                  <span className="text-gray-700 text-sm font-medium">
                    {res.ownerName}
                  </span>
                </div>
                <button
                  onClick={() => handleConnectClick(res.ownerId)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  Connect with Owner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(userData) => {
            setShowLoginModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default SearchPage;
