import React from "react";
import { Star, Bookmark } from "lucide-react";
import defaultAvatar from "../assets/images/default-avatar.png";

const ResourceCard = ({
  resource,
  isOwner,
  onConnect,
  onRate,
  onSave,
  showSave,
  userRating,
  setUserRating,
}) => {
  const {
    title,
    description,
    platform,
    price,
    courseLink,
    averageRating,
    owner,
  } = resource;

  const handleStarClick = (rating) => {
    if (onRate) {
      onRate(resource.id, rating);
    }
  };

  const handleSaveClick = () => {
    if (onSave) {
      onSave(resource.id);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-5 transition-all duration-300 transform hover:scale-[1.02] fade-in">
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
          {description}
        </p>
      </div>

      <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <span className="font-medium">Platform:</span> {platform}
        </p>
        <p>
          <span className="font-medium">Price:</span> ₹{price}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Avg Rating:
        </span>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={16}
            fill={i <= Math.round(averageRating || 0) ? "gold" : "none"}
            stroke="gold"
          />
        ))}
      </div>

      {onRate && (
        <div className="mb-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Add Your Rating:
          </p>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={20}
                className="cursor-pointer transition-transform hover:scale-110"
                fill={i <= userRating ? "orange" : "none"}
                stroke="orange"
                onClick={() => {
                  setUserRating(i);
                  handleStarClick(i);
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mt-4">
        <a
          href={courseLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Go to Course
        </a>

        <button
          onClick={() => onConnect(resource)}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-all duration-200"
        >
          {isOwner ? "View Your Profile" : "Connect with Owner"}
        </button>
      </div>

      {showSave && (
        <div className="mt-3 text-right">
          <button
            onClick={handleSaveClick}
            className="flex items-center gap-1 text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 transition"
          >
            <Bookmark size={18} />
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
