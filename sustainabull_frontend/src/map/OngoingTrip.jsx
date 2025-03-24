import { Link } from 'react-router-dom';

export default function OngoingTrip() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Ongoing Trip</h1>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Start Destination</p>
            <p className="text-gray-600">SFU Surrey</p>
          </div>
          <div className='bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md'>
            <p>Map goes here!</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">End Destination</p>
            <p className="text-gray-600">SFU Burnaby</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">750 m Left...</p>
          </div>
        </div>

        <button className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
        Abandon
         {/* We should add a warning to the user that when they click this button, they cannot go back.
                    This is because the cow will lose health if the user abandons trips. (POPUP)
          */}
        </button>
      </div>
        <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
            Home
        </Link>
    </div>
  );
}