import { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const ShareResourceModal = ({ onClose }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    platform: "",
    price: "",
    courseLink: "",
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    const formData = new FormData();
    formData.append("resource", new Blob([JSON.stringify(form)], { type: "application/json" }));
    if (image) formData.append("image", image);

    try {
      await axios.post(`${API_BASE_URL}/api/resources`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("✅ Resource shared successfully!");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("❌ Error sharing resource", err);
      setMessage("❌ Failed to share resource. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Share a Resource</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
          />
          <textarea
            name="description"
            placeholder="Course Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded resize-none focus:outline-blue-500"
          />
          <input
            type="text"
            name="platform"
            placeholder="Platform (e.g. Udemy, YouTube)"
            value={form.platform}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
          />
          <input
            type="url"
            name="courseLink"
            placeholder="Course Link (https://...)"
            value={form.courseLink}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting ? "Sharing..." : "Share Resource"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ShareResourceModal;
