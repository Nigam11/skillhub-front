import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";

const API_BASE_URL = "http://localhost:8080";

const ProfilePage = () => {
  const [form, setForm] = useState(null);
  const [resources, setResources] = useState([]);
  const [savedResources, setSavedResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPicOptions, setShowPicOptions] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        if (data.name) {
          setForm({
            name: data.name || "",
            bio: data.bio || "",
            gender: data.gender || "",
            whatsapp: data.whatsapp || "",
            instagram: data.instagram || "",
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

    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/resources/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedResources(res.data || []);
      } catch (err) {
        console.error("Failed to load saved resources:", err);
      }
    };

    fetchProfile();
    fetchSaved();
  }, [token]);

  const handleDeleteProfilePic = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/me/profile-pic`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm((prev) => ({ ...prev, profilePic: "" }));
      setShowPicOptions(false);
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

  const handleUnsaveResource = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/api/resources/${id}/unsave`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedResources((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to unsave resource:", err);
      alert("❌ Failed to unsave resource.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 animate-pulse text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!form) return null;

  const isDefaultAvatar =
    !form.profilePic || form.profilePic.endsWith("default-avatar.png");

  return (
    <div className="flex flex-col min-h-screen animate-fade-in bg-gray-50">
      <main className="flex-grow max-w-6xl mx-auto px-4 py-10 space-y-12">
        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 bg-white p-6 rounded-xl shadow border">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={form.profilePic ? `${API_BASE_URL}${form.profilePic}` : defaultAvatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border border-gray-300 cursor-pointer transition hover:scale-105"
                  onClick={() => setShowPicOptions(!showPicOptions)}
                />
                {showPicOptions && (
                  <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-white border rounded shadow-md p-4 z-10 w-52">
                    {isDefaultAvatar ? (
                      <span className="text-sm text-gray-500">prfile logic </span>
                    ) : (
                      <button
                        className="text-gray-500 hover:text-black text-sm"
                        onClick={handleDeleteProfilePic}
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
                onClick={() => navigate("/edit-profile")}
                className="mt-6 w-full px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* Shared Resources */}
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow border">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Shared Resources</h2>

            {resources.length === 0 ? (
              <p className="text-gray-500">You haven’t shared any resources yet.</p>
            ) : (
              <div className="space-y-4">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:shadow transition"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{res.title}</h3>
                      <p className="text-gray-600 text-sm">{res.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <strong>Platform:</strong> {res.platform} | <strong>Price:</strong> ₹{res.price}
                      </p>
                      {res.courseLink && (
                        <a
                          href={res.courseLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                        >
                          Visit Course
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-1 border border-gray-400 text-gray-700 rounded hover:bg-gray-100 text-sm"
                        onClick={() => handleEditResource(res.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition text-sm"
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

        {/* Saved Resources */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Saved Resources</h2>
          {savedResources.length === 0 ? (
            <p className="text-gray-500">You haven’t saved any resources yet.</p>
          ) : (
            <div className="space-y-4">
              {savedResources.map((res) => (
                <div
                  key={res.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:shadow transition"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{res.title}</h3>
                    <p className="text-gray-600 text-sm">{res.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      <strong>Platform:</strong> {res.platform} | <strong>Price:</strong> ₹{res.price}
                    </p>
                    {res.courseLink && (
                      <a
                        href={res.courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-1 inline-block"
                      >
                        Visit Course
                      </a>
                    )}
                  </div>
                  <button
                    className="px-4 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition text-sm"
                    onClick={() => handleUnsaveResource(res.id)}
                  >
                    Unsave
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
