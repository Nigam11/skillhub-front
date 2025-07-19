import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";

const API_BASE_URL = "http://localhost:8080";

const ProfilePage = () => {
  const [form, setForm] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPicOptions, setShowPicOptions] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const picRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data.name) {
          setForm({
            name: data.name || " ",
            bio: data.bio || " ",
            gender: data.gender || " ",
            whatsapp: data.whatsapp || " ",
            instagram: data.instagram || " ",
            profilePic: data.profilePic || "",
          });
          setResources(data.resources || []);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !picRef.current.contains(e.target)
      ) {
        setShowPicOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteProfilePic = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/me/profile-pic`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm((prev) => ({ ...prev, profilePic: "" }));
      setShowPicOptions(false);
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete profile picture:", err);
      alert("❌ Failed to delete profile picture.");
    }
  };

  const handleEditResource = (id) => {
    navigate(`/edit-resource/${id}`);
  };

  const handleDeleteResource = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this resource?");
    if (!confirm) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/resources/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete resource:", err);
      alert("❌ Failed to delete resource.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-orange-300 animate-pulse text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!form) return null;

  const isDefaultAvatar =
    !form.profilePic || form.profilePic.trim() === "" || form.profilePic.endsWith("default-avatar.png");

  return (
    <div className="flex flex-col min-h-screen text-white animate-fade-in">
      <main className="flex-grow max-w-6xl mx-auto px-4 py-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="col-span-1 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow border border-white">
            <div className="flex flex-col items-center text-center">
              <div className="relative" ref={picRef}>
                <img
                  src={
                    form.profilePic && form.profilePic.trim() !== ""
                      ? `${API_BASE_URL}${form.profilePic}`
                      : defaultAvatar
                  }
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-2 border-white cursor-pointer transition hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPicOptions((prev) => !prev);
                  }}
                />
                {showPicOptions && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-36 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white rounded shadow-md p-4 z-10 w-52 text-sm"
                  >
                    {isDefaultAvatar ? (
                      <span className="text-orange-200">No profile picture set</span>
                    ) : (
                      <button
                        className="text-red-400 hover:text-red-200"
                        onClick={() => {
                          handleDeleteProfilePic();
                          setShowPicOptions(false);
                        }}
                      >
                        Delete Profile Picture
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full text-left mt-6 space-y-3">
                <p><strong>Name:</strong> {form.name}</p>
                <p><strong>Bio:</strong> {form.bio}</p>
                <p><strong>Gender:</strong> {form.gender}</p>
                <p><strong>WhatsApp:</strong> {form.whatsapp}</p>
                <p><strong>Instagram:</strong> {form.instagram}</p>
              </div>

              <button
                onClick={() => navigate("/edit-profile", { state: { from: "profile" } })}
                className="mt-6 w-full px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Shared Resources */}
          <div className="col-span-1 md:col-span-2 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow border border-white">
            <h2 className="text-2xl font-semibold mb-4 text-orange-300">My Shared Resources</h2>

            {resources.length === 0 ? (
              <p className="text-orange-200">You haven’t shared any resources yet.</p>
            ) : (
              <div className="space-y-4">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white/10 backdrop-blur-md border border-white rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-4 w-full">
                      {res.courseImagePath && (
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md border border-white">
                          <img
                            src={`${API_BASE_URL}${res.courseImagePath}`}
                            alt={res.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{res.title}</h3>
                        <p className="text-orange-100 text-sm">{res.description}</p>
                        <p className="text-sm text-orange-300 mt-1">
                          <strong>Platform:</strong> {res.platform} | <strong>Price:</strong> ₹{res.price}
                        </p>
                        {res.courseLink && (
                          <a
                            href={res.courseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-400 hover:underline mt-1 inline-block"
                          >
                            Visit Course
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-center">
                      <button
                        className="px-4 py-1 border border-white text-orange-200 rounded hover:bg-orange-500 hover:text-white text-sm transition"
                        onClick={() => handleEditResource(res.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                        onClick={() => handleDeleteResource(res.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
