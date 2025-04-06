import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function TransportationMode() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const [distance, setDistance] = useState('');
  const [showDistanceInput, setShowDistanceInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  
  // Map the UI transport modes to backend transport types
  const transportModeMapping = {
    'Walk': 'walk',
    'Bike': 'bike',
    'Transit': 'transit',
    'Drive (electric vehicle)': 'vehicle', // Treated same as vehicle in backend
    'Drive': 'vehicle'
  };
  
  const handleSelectMode = mode => {
    setSelectedMode(mode);
  };
  
  const handleNext = () => {
    if (selectedMode) {
      setShowDistanceInput(true);
    }
  };
  
  const handleTravel = async (e) => {
    e.preventDefault();
    
    if (!selectedMode || !distance || isNaN(distance) || distance <= 0) {
      setError('Please select a transportation mode and enter a valid distance');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You need to be logged in');
        setLoading(false);
        return;
      }
      
      // Map the selected mode to backend transport type
      const transportType = transportModeMapping[selectedMode];
      
      const response = await axios.post(
        'http://localhost:8000/api/shop/travel/',
        {
          distance_meters: parseInt(distance),
          transport_type: transportType
        },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setResult(response.data);
      
    } catch (error) {
      console.error('Error recording travel:', error);
      setError(error.response?.data?.error || error.message || 'Failed to record travel');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to get icon for transportation mode
  const getTransportIcon = (mode) => {
    switch(mode) {
      case 'Walk': return '🚶‍♂️';
      case 'Bike': return '🚲';
      case 'Transit': return '🚌';
      case 'Drive (electric vehicle)': return '⚡🚗';
      case 'Drive': return '🚗';
      default: return '🚶‍♂️';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-8">Transportation Mode</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 w-full max-w-md">
          {error}
        </div>
      )}
      
      {result ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Travel Results</h2>
          
          <div className="bg-green-100 p-4 rounded mb-4">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{getTransportIcon(selectedMode)}</span>
              <span className="font-semibold">{selectedMode}</span>
            </div>
            <p><span className="font-bold">Distance:</span> {result.travel_result.distance_traveled}m</p>
            <p><span className="font-bold">XP Gained:</span> {result.travel_result.xp_gained}</p>
            <p><span className="font-bold">Gold Earned:</span> {result.travel_result.gold_gained}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded">
              <p className="font-semibold">Mood</p>
              <p className="text-sm">Change: {result.travel_result.mood_change}%</p>
              <p className="text-sm">Current: {result.cow.mood}%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded">
              <p className="font-semibold">Hunger</p>
              <p className="text-sm">Change: {result.travel_result.hunger_change}%</p>
              <p className="text-sm">Current: {result.cow.hunger}%</p>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <p className="font-semibold">CO2</p>
              <p className="text-sm">Change: {result.travel_result.co2_change}%</p>
              <p className="text-sm">Current: {result.cow.co2_emissions}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <p className="font-semibold">Exercise</p>
              <p className="text-sm">Change: {result.travel_result.exercise_change}%</p>
              <p className="text-sm">Current: {result.cow.exercise}%</p>
            </div>
          </div>
          
          {result.travel_result.leveled_up && (
            <div className="bg-yellow-200 p-4 rounded text-center mb-4">
              <h3 className="font-bold">Level Up!</h3>
              <p>Your cow is now level {result.travel_result.new_level}! 🎉</p>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setResult(null);
                setShowDistanceInput(false);
                setSelectedMode(null);
              }}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              New Travel
            </button>
            <Link
              to="/home"
              className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center"
            >
              Home
            </Link>
          </div>
        </div>
      ) : showDistanceInput ? (
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Enter Distance</h2>
          
          <div className="flex items-center mb-4 bg-blue-100 p-3 rounded">
            <span className="text-2xl mr-2">{getTransportIcon(selectedMode)}</span>
            <span className="font-semibold">{selectedMode}</span>
          </div>
          
          <form onSubmit={handleTravel}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="distance">
                Distance (meters)
              </label>
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter distance in meters"
                min="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                1km = 1000m, 1 mile ≈ 1609m
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setShowDistanceInput(false)}
                className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 bg-custom-orange text-white rounded-lg hover:bg-orange-600"
              >
                {loading ? 'Recording...' : 'Record Travel'}
              </button>
            </div>
          </form>
        </div>
      ) : (
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
          <button
            onClick={handleNext}
            className={`mt-6 w-full py-2 px-4 rounded-lg transition block text-center ${
              selectedMode ? 'bg-blue-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!selectedMode}
          >
            Next
          </button>
        </div>
      )}

      <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
        Home
      </Link>
    </div>
  );
}