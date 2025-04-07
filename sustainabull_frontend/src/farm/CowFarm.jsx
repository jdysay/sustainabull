import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CowImage from "../assets/images/cow.png";

const CowFarm = () => {
  const { user } = useAuth();
  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [cowName, setCowName] = useState('');

  const globalFontStyle = {
    fontFamily: "'Micro5', 'Press Start 2P', monospace"
  };
  
  const cowNameStyle = {
    ...globalFontStyle,
    fontSize: '24px'
  };

  useEffect(() => {
    fetchCow();
  }, [user]);

  const fetchCow = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:8000/api/shop/cows/my_cow/',
        {
          headers: {
            'Authorization': `Token ${token}`
          }
        }
      );

      setCow(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching cow:', error);
      if (error.response?.status === 404) {
        // No cow exists yet
        setShowCreateForm(true);
      } else {
        setError('Failed to load your cow. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createCow = async (e) => {
    e.preventDefault();
    if (!cowName.trim()) {
      setError('Please enter a name for your cow');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/api/shop/cows/',
        { cow_name: cowName },
        {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setCow(response.data);
      setShowCreateForm(false);
      setError('');
    } catch (error) {
      console.error('Error creating cow:', error);
      setError('Failed to create your cow. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-100">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-300" style={globalFontStyle}>
      <div className="max-w-4xl mx-auto p-6 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-center">MY COW</h1>
          <div className="flex items-center gap-3">
            <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full">
              {user ? user.gold : 0} Gold
            </span>
            <Link to="/home" className="text-blue-500 hover:text-blue-700">
              Home
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showCreateForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Create Your Cow</h2>
            <form onSubmit={createCow}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="cowName">
                  Cow Name:
                </label>
                <input
                  type="text"
                  id="cowName"
                  value={cowName}
                  onChange={(e) => setCowName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter a name for your cow"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Create Cow
              </button>
            </form>
          </div>
        ) : cow ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 flex justify-center mb-6 md:mb-0 md:mr-6">
                <img
                  src={CowImage}
                  alt={cow.cow_name}
                  className="h-48 w-48 object-contain"
                />
              </div>
              <div className="flex-grow">
                {/* Styled cow name in a box, matching Home.jsx */}
                <div className="text-center mb-4">
                  <div className="inline-block bg-white border-2 border-[#3774AD] rounded-lg px-4 py-2">
                    <div className="text-[#3774AD] font-bold" style={cowNameStyle}>
                      {cow.cow_name}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-700">Level: {cow.cow_level}</p>
                    <p className="text-gray-700">XP: {cow.experience_points}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Hunger stat - updated to match Home.jsx exactly */}
                  <div className="flex items-center">
                    <div className="w-20 text-center mr-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Hunger</div>
                      <div className="px-2 py-0.5 rounded-full text-xs font-bold text-white inline-block"
                        style={{ backgroundColor: "#FDDB3A", ...globalFontStyle }}>
                        {cow.hunger || 50}%
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-[#FDDB3A] h-4 rounded-full" 
                          style={{ width: `${cow.hunger || 50}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Mood stat - updated to match Home.jsx exactly */}
                  <div className="flex items-center">
                    <div className="w-20 text-center mr-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Mood</div>
                      <div className="px-2 py-0.5 rounded-full text-xs font-bold text-white inline-block"
                        style={{ backgroundColor: "#FF6B6B", ...globalFontStyle }}>
                        {cow.mood || 50}%
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-[#FF6B6B] h-4 rounded-full" 
                          style={{ width: `${cow.mood || 50}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Poop (CO2 Emissions) stat - updated to match Home.jsx exactly */}
                  <div className="flex items-center">
                    <div className="w-20 text-center mr-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Poop</div>
                      <div className="px-2 py-0.5 rounded-full text-xs font-bold text-white inline-block"
                        style={{ backgroundColor: "#8B4513", ...globalFontStyle }}>
                        {cow.co2_emissions || 50}%
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-[#8B4513] h-4 rounded-full" 
                          style={{ width: `${cow.co2_emissions || 50}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Exercise stat - updated to match Home.jsx exactly */}
                  <div className="flex items-center">
                    <div className="w-20 text-center mr-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">Walk</div>
                      <div className="px-2 py-0.5 rounded-full text-xs font-bold text-white inline-block"
                        style={{ backgroundColor: "#4ECDC4", ...globalFontStyle }}>
                        {cow.exercise || 50}%
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="bg-[#4ECDC4] h-4 rounded-full" 
                          style={{ width: `${cow.exercise || 50}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
            <p>Something went wrong. Please refresh the page.</p>
          </div>
        )}

        <div className="flex justify-around mt-6">
          <Link to="/home" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
            Home
          </Link>
          <Link to="/inventory" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md">
            Feed Cow
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CowFarm;