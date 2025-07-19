import { useEffect, useState } from "react";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";

const API_BASE_URL = "http://localhost:8080";

const EditProfilePage = () => {
  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    instagram: "",
    bio: "",
    gender: "",
    profilePic: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm(res.data);
        const imageUrl = res.data.profilePic
          ? `${API_BASE_URL}${res.data.profilePic}`
          : defaultAvatar;
        setPreviewUrl(imageUrl);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
      });
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.put(`${API_BASE_URL}/api/users/me`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      window.location.href = "/profile";
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = "/profile";
  };

  return (
    <div className="flex flex-col min-h-screen px-4 py-10">
      <div className="max-w-xl mx-auto bg-white/20 dark:bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl rounded-xl p-6 animate-fade-in animate-slide-up transition-all duration-300">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">
           Edit Profile
        </h2>

        <div className="flex justify-center mb-6">
          <label htmlFor="profile-pic" className="cursor-pointer group">
            <img
              src={previewUrl || defaultAvatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white/70 shadow-lg group-hover:opacity-80 transition duration-300"
            />
            <input
              type="file"
              id="profile-pic"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-4 py-2 bg-white/70 dark:bg-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full px-4 py-2 bg-white/70 dark:bg-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/70 dark:bg-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <input
            type="text"
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp Number"
            className="w-full px-4 py-2 bg-white/70 dark:bg-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="Instagram Handle"
            className="w-full px-4 py-2 bg-white/70 dark:bg-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
