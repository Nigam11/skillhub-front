// src/components/ShareResourceModal.jsx
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
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 p-6 rounded-2xl shadow-2xl w-full max-w-xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white hover:text-red-300 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-orange-300">Share  Resource</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-white/30 bg-transparent px-4 py-2 rounded focus:outline-none placeholder:text-white/70 text-white"
          />
          <textarea
            name="description"
            placeholder="Course Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border border-white/30 bg-transparent px-4 py-2 rounded resize-none focus:outline-none placeholder:text-white/70 text-white"
          />
          <input
            type="text"
            name="platform"
            placeholder="Platform (e.g. Udemy, YouTube)"
            value={form.platform}
            onChange={handleChange}
            required
            className="w-full border border-white/30 bg-transparent px-4 py-2 rounded focus:outline-none placeholder:text-white/70 text-white"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border border-white/30 bg-transparent px-4 py-2 rounded focus:outline-none placeholder:text-white/70 text-white"
          />
          <input
            type="url"
            name="courseLink"
            placeholder="Course Link (https://...)"
            value={form.courseLink}
            onChange={handleChange}
            required
            className="w-full border border-white/30 bg-transparent px-4 py-2 rounded focus:outline-none placeholder:text-white/70 text-white"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-white/30 bg-transparent px-4 py-2 rounded focus:outline-none text-white file:text-white/70 file:bg-transparent"
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
          <p className="mt-4 text-center text-sm text-white/80">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ShareResourceModal;
