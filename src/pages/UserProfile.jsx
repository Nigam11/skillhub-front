// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import defaultAvatar from "../assets/images/default-avatar.png";

const API_BASE_URL = "http://localhost:8080";

const UserProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/${id}/profile`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 animate-pulse">
        Loading...
      </div>
    );
  }

  const {
    name,
    bio,
    gender,
    whatsapp,
    instagram,
    profilePic,
    resources = [],
  } = profile;

  return (
    <div className="flex flex-col min-h-screen text-white">
      <main className="flex-grow px-4 py-10 max-w-6xl mx-auto animate-fade-in w-full">
        <div className="w-full bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 space-y-6 border border-white/20">
          {/* Profile Info */}
          <div className="flex flex-col items-center text-center">
            <img
              src={profilePic ? `${API_BASE_URL}${profilePic}` : defaultAvatar}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-white/30 hover:scale-105 transition duration-300"
            />
            <h2 className="text-3xl font-bold mt-4 text-orange-400">{name}</h2>

            <div className="mt-2 space-y-1 text-sm text-white/90">
              {bio && <p>{bio}</p>}
              {gender && <p>{gender}</p>}
            </div>

            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600/20 text-green-300 border border-green-400 rounded hover:bg-green-600/30 hover:scale-105 transition text-sm"
                >
                  Connect on WhatsApp
                </a>
              )}
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-pink-600/20 text-pink-300 border border-pink-400 rounded hover:bg-pink-600/30 hover:scale-105 transition text-sm"
                >
                  Connect on Instagram
                </a>
              )}
            </div>
          </div>

          {/* Shared Resources */}
          <div>
            <h3 className="text-xl font-semibold text-orange-400 mb-4">
              Shared Resources
            </h3>
            {resources.length === 0 ? (
              <p className="text-white/70">No resources shared yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-slide-down">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white/10 backdrop-blur-md rounded-2xl shadow-md p-6 transition-transform duration-300 hover:scale-[1.02] flex flex-col text-white"
                  >
                    <img
                      src={res.courseImagePath ? `${API_BASE_URL}${res.courseImagePath}` : ""}
                      alt={res.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />

                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-orange-400">{res.title}</h4>
                      <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full">
                        {res.platform}
                      </span>
                    </div>

                    <p className="text-white/80 mb-3 line-clamp-3 text-sm">
                      {res.description}
                    </p>

                    <div className="text-sm text-white/70 mb-2">
                      <p><strong>Price:</strong> ₹{res.price}</p>
                    </div>

                    {res.courseLink && (
                      <a
                        href={res.courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-orange-300 hover:underline text-sm"
                      >
                        Visit Course
                      </a>
                    )}
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

export default UserProfile;
