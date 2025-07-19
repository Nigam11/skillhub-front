// src/pages/AboutUs.jsx
import React from "react";

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <main className="flex-grow max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white/60 shadow-xl rounded-2xl p-10 border border-gray-200 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
            About SkillHub
          </h1>

          <p className="text-gray-800 text-lg leading-relaxed mb-6">
            SkillHub is a platform designed to bring learners and knowledge sharers together. Whether you're looking for quality learning resources or want to share your favorite course with the world — SkillHub is your go-to destination.
          </p>

          <p className="text-gray-800 text-lg leading-relaxed mb-6">
            Our goal is to create a collaborative learning space where people from all walks of life can contribute, explore, and grow their skills. From tech to design to marketing — there's a course here for everyone.
          </p>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-2">🎯 Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Empower learners to access curated, community-shared resources while enabling users to showcase and share the knowledge they've gained.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-2">🌍 Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                Build a global knowledge-sharing hub where students, professionals, and educators connect through a common goal — lifelong learning.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center text-sm text-gray-600">
            <p>Made with ❤️ by <strong>Nigam Chaudhary</strong></p>
            <p className="mt-1">
              skillhub.reset@gmail.com &nbsp;|&nbsp; nigamdangi26@gmail.com
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
