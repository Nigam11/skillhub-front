// src/components/Footer.jsx
import { FaInstagram, FaWhatsapp, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* SkillHub Info (left-most column, always first) */}
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-3">SkillHub</h2>
          <p className="text-sm text-gray-400">
            SkillHub is your platform to share and explore top-rated learning resources curated by real users. Empower your learning journey.
          </p>
          <div className="flex gap-4 mt-4 text-xl">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="https://wa.me" target="_blank" rel="noreferrer" className="hover:text-green-400 transition">
              <FaWhatsapp />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-gray-300 transition">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Wrapper for mobile 2x2 layout (Product + Resources, More + Company) */}
        <div className="grid grid-cols-2 gap-6 md:hidden">
          {/* Product */}
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Java Courses</li>
              <li>Udemy Resources</li>
              <li>AI Tools</li>
              <li>Pricing</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Community</li>
              <li>Forum</li>
              <li>Blog</li>
              <li>Partner Program</li>
            </ul>
          </div>

          {/* More from SkillHub */}
          <div>
            <h4 className="font-semibold mb-3">More from SkillHub</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Explore</li>
              <li>Categories</li>
              <li>Top Picks</li>
              <li>Start Sharing</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/about" className="hover:underline">About</Link>
              </li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Careers</li>
            </ul>
          </div>
        </div>

        {/* Desktop layout (unchanged) */}
        <div className="hidden md:block">
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Java Courses</li>
            <li>Udemy Resources</li>
            <li>AI Tools</li>
            <li>Pricing</li>
          </ul>
        </div>

        <div className="hidden md:block">
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Community</li>
            <li>Forum</li>
            <li>Blog</li>
            <li>Partner Program</li>
          </ul>
        </div>

        <div className="hidden md:block">
          <h4 className="font-semibold mb-3">More from SkillHub</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>Explore</li>
            <li>Categories</li>
            <li>Top Picks</li>
            <li>Start Sharing</li>
          </ul>
        </div>

        <div className="hidden md:block">
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link to="/about" className="hover:underline">About</Link>
            </li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-12 text-center text-gray-500 text-sm space-y-1 px-4">
        <div>© {new Date().getFullYear()} SkillHub. All rights reserved.</div>
        <div>Developed by <span className="text-gray-400">Nigam Chaudhary</span></div>
        <div className="text-gray-400 text-xs">
          Contact: <a href="mailto:skillhub.reset@gmail.com" className="hover:underline">skillhub.reset@gmail.com</a> |{" "}
          <a href="mailto:nigamdangi26@gmail.com" className="hover:underline">nigamdangi26@gmail.com</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
