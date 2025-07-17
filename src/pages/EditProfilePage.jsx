import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";

const API_BASE_URL = "http://localhost:8080";

const EditProfilePage = () => {
  const navigate = useNavigate();
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
        setPreviewUrl(res.data.profilePic || defaultAvatar);
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
      navigate("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-8">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>

        <div className="flex justify-center mb-6">
          <label htmlFor="profile-pic" className="cursor-pointer">
            <img
              src={previewUrl || defaultAvatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 hover:opacity-90"
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
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700"
          />
          <input
            type="text"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700"
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
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700"
          />
          <input
            type="text"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="Instagram Handle"
            className="w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700"
          />
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
