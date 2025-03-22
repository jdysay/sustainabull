import { Link } from 'react-router-dom';

export default function InputDestination() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Input Destination</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Start Destination"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="End Destination"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mt-6 flex justify-between">
            <Link to="/transportation-mode" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Back
            </Link>
            <Link to="/ongoing-trip" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Finish
                {/* We should add a warning to the user that when they click this button, they cannot go back.
                    This is because the cow will lose health if the user abandons trips.
                */}
            </Link>
        </div>
      </div>
        <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
            Home
        </Link>
    </div>
  );
}