// src/pages/EditResourcePage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const EditResourcePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/resources/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResource(res.data);
      } catch (err) {
        console.error("Failed to load resource:", err);
        alert("❌ Failed to load resource.");
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResource((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/resources/${id}`, resource, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Resource updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Failed to update resource:", err);
      alert("❌ Failed to update resource.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-300 animate-pulse text-lg">Loading resource...</p>
      </div>
    );
  }

  if (!resource) {
    return <p className="text-center text-gray-400">Resource not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 rounded-xl border border-white bg-white/5 backdrop-blur-md shadow-lg animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-white">Edit Resource</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Title</label>
          <input
            type="text"
            name="title"
            value={resource.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-white/40 bg-transparent rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Description</label>
          <textarea
            name="description"
            value={resource.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-white/40 bg-transparent rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Platform</label>
          <input
            type="text"
            name="platform"
            value={resource.platform}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-white/40 bg-transparent rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Price</label>
          <input
            type="number"
            name="price"
            value={resource.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-white/40 bg-transparent rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Course Link</label>
          <input
            type="text"
            name="courseLink"
            value={resource.courseLink}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-white/40 bg-transparent rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditResourcePage;
