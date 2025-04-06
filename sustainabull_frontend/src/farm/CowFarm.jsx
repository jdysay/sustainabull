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
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 font-mono">
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
                <h2 className="text-2xl font-bold mb-2">{cow.cow_name}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-700">Level: {cow.cow_level}</p>
                    <p className="text-gray-700">XP: {cow.experience_points}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Hunger</span>
                      <span className="text-sm font-medium">{cow.hunger}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${cow.hunger}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Mood</span>
                      <span className="text-sm font-medium">{cow.mood}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-yellow-400 h-2.5 rounded-full" 
                        style={{ width: `${cow.mood}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">CO2 Emissions</span>
                      <span className="text-sm font-medium">{cow.co2_emissions}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${cow.co2_emissions}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Exercise</span>
                      <span className="text-sm font-medium">{cow.exercise}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${cow.exercise}%` }}
                      ></div>
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