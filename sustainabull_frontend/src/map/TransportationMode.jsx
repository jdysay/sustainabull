import { Link } from 'react-router-dom';

export default function TransportationMode() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Transportation Mode</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Form of Transportation</h2>
        <div className="space-y-4">
          {['Walk', 'Bike', 'Transit', 'Drive'].map((mode) => (
            <button
              key={mode}
              className="w-full bg-blue-100 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              {mode}
            </button>
          ))}
        </div>
        <Link to="/input-destination" className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition block text-center">
          Next
        </Link>
      </div>
    </div>
  );
}