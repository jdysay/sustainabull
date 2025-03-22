import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const pages = [
  {
    title: "Welcome To",
    subtitle: "Sustain-a-Bull",
    icon: "🐄",
    description: "",
  },
  {
    title: "EMISSIONS",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do, " +
      "eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "🚗",
  },
  {
    title: "REASON #2",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do, " +
      "eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "🤍",
  },
  {
    title: "COMMUNITY",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do, " +
      "eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    title: "REASON #4",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do, " +
      "eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    icon: "🤝",
  },
];

export default function Onboarding() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate('/home'); // Redirect to /home after clicking "Start Now"
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    navigate('/home'); // Redirect to /home after skipping
  };

  const { title, subtitle, icon } = pages[currentPage];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-white flex flex-col items-center justify-between px-4 py-6 sm:px-6 md:px-12 lg:px-24">
      {/* Skip Button */}
      <div className="w-full flex justify-end">
        <button
          onClick={handleSkip}
          className="text-sm sm:text-base text-gray-800 border border-gray-300 hover:bg-gray-100 px-4 py-1 rounded transition-colors duration-200"
        >
          Skip
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center text-center flex-grow max-w-2xl w-full">
        {/* Icon */}
        <div className="text-6xl sm:text-7xl md:text-8xl mb-4">{icon}</div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-pixel mb-3">{title}</h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-gray-700 px-2 sm:px-4">
          {subtitle}
        </p>
      </div>

      {/* Dots + Navigation */}
      <div className="w-full flex flex-col items-center gap-4">
        {/* Dots */}
        <div className="flex gap-2 mb-2">
          {pages.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                idx === currentPage ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {/* Back Button (only shown if not on the first page) */}
          {currentPage > 0 && (
            <button
              onClick={handleBack}
              className="bg-gray-500 hover:bg-gray-600 text-white text-sm sm:text-base font-semibold px-6 py-2 rounded shadow transition-colors duration-200"
            >
              Back
            </button>
          )}

          {/* Next / Start Button */}
          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold px-6 py-2 rounded shadow transition-colors duration-200"
          >
            {currentPage === pages.length - 1 ? "Start Now" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}