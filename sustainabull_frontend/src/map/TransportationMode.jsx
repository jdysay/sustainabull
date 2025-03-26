import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function TransportationMode() {
  const [selectedMode, setSelectedMode] = useState(null);
  
  const handleSelectMode = mode => {
    setSelectedMode(mode);
  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Transportation Mode</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Form of Transportation</h2>
        <div className="space-y-4">
          {['Walk', 'Bike', 'Transit', 'Drive (electric vehicle)', 'Drive'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleSelectMode(mode)}
              className={`w-full py-2 px-4 rounded-lg transition ${
                selectedMode === mode
                  ? 'bg-custom-orange text-white hover: border-none' // Selected state
                  : 'bg-blue-100 text-blue-500 hover:bg-blue-600 border-none'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <Link
          to="/input-destination"
          state={{ selectedMode }}
          className={`mt-6 w-full py-2 px-4 rounded-lg transition block text-center ${
            selectedMode ? 'bg-blue-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </Link>
      </div>

        <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
            Home
        </Link>
    </div>
  );
}