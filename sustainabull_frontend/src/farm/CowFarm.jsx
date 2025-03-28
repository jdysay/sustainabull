import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CowFarm = () => {
  const [sortBy, setSortBy] = useState('dateCreated');
  
  const cows = [
    { 
      id: 1, 
      name: 'Mr. Bobby the Bull', 
      level: 5, 
      dateCreated: '2025-01-15',
      stats: {
        mood: 'Happy',
        health: 'Excellent'
      }
    },
    { 
      id: 2, 
      name: 'Daisy the Cow', 
      level: 3, 
      dateCreated: '2025-03-10',
      stats: {
        mood: 'Content',
        health: 'Good'
      }
    },
    { 
      id: 3, 
      name: 'Spotty', 
      level: 2, 
      dateCreated: '2025-02-20',
      stats: {
        mood: 'Energetic',
        health: 'Good'
      }
    },
    { 
      id: 4, 
      name: 'Milky Way', 
      level: 4, 
      dateCreated: '2025-01-30',
      stats: {
        mood: 'Calm',
        health: 'Very Good'
      }
    },
  ];

  const sortedCows = [...cows].sort((a, b) => {
    if (sortBy === 'dateCreated') return new Date(b.dateCreated) - new Date(a.dateCreated);
    if (sortBy === 'level') return b.level - a.level;
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">COW FARM</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="font-medium">Sort By</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          >
            <option value="dateCreated">Date Created</option>
            <option value="level">Level</option>
          </select>
        </div>
        
        <Link 
          to="/inventory" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          View Inventory
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedCows.map(cow => (
          <Link 
            key={cow.id} 
            to={`/cow/${cow.id}`}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-medium">{cow.name}</h3>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                Lvl {cow.level}
              </span>
            </div>
            <div className="flex flex-col gap-1 text-sm text-gray-600">
              <span>Mood: {cow.stats.mood}</span>
              <span>Health: {cow.stats.health}</span>
              <span>Added: {new Date(cow.dateCreated).toLocaleDateString()}</span>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="flex justify-around mt-8 pt-4 border-t border-gray-200">
        <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
          Home
        </Link>
      </div>
    </div>
  );
};

export default CowFarm;