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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow px-4 py-10 max-w-4xl mx-auto animate-fade-in w-full">
        <div className="w-full bg-white bg-opacity-70 backdrop-blur-lg shadow-xl rounded-2xl p-8 space-y-6 border border-gray-200">
          {/* Profile Info */}
          <div className="flex flex-col items-center text-center">
            <img
              src={profilePic ? `${API_BASE_URL}${profilePic}` : defaultAvatar}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 hover:scale-105 transition duration-300"
            />
            <h2 className="text-2xl font-bold mt-4 text-gray-800">{name}</h2>

            <div className="mt-2 text-gray-700 space-y-1 text-sm">
              {bio && <p>{bio}</p>}
              {gender && <p>{gender}</p>}
            </div>

            <div className="flex gap-3 mt-4 flex-wrap justify-center">
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200 hover:scale-105 transition text-sm"
                >
                  Connect on WhatsApp
                </a>
              )}
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-pink-100 text-pink-700 border border-pink-300 rounded hover:bg-pink-200 hover:scale-105 transition text-sm"
                >
                  Connect on Instagram
                </a>
              )}
            </div>
          </div>

          {/* Shared Resources */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Shared Resources</h3>
            {resources.length === 0 ? (
              <p className="text-gray-500">No resources shared yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white/80 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition hover:scale-[1.01]"
                  >
                    {res.courseImagePath ? (
                      <img
                        src={`${API_BASE_URL}${res.courseImagePath}`}
                        alt={res.title}
                        className="w-full h-36 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gray-100 flex items-center justify-center rounded mb-2 text-gray-400 text-sm">
                        No Image Available
                      </div>
                    )}

                    <h4 className="text-lg font-bold text-gray-800">{res.title}</h4>
                    <p className="text-gray-700 text-sm">{res.description}</p>
                    <p className="text-sm text-gray-500 mt-1">Platform: {res.platform}</p>
                    <p className="text-green-700 font-semibold">₹{res.price}</p>
                    {res.courseLink && (
                      <a
                        href={res.courseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline block mt-1"
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
