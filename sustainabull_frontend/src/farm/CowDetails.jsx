import React from 'react';
import { useParams, Link } from 'react-router-dom';

const allCows = [
  { 
    id: 1, 
    name: 'Mr. Bobby the Bull', 
    level: 5, 
    dateCreated: '2025-01-15',
    description: 'The star of the farm with legendary strength',
    stats: {
      mood: 'Happy',
      health: 'Excellent',
      co2_emissions: '2.4 kg/day',
      exercise: 'High'
    }
  },
  { 
    id: 2, 
    name: 'Daisy the Cow', 
    level: 3, 
    dateCreated: '2025-03-10',
    description: 'Friendly and produces excellent milk',
    stats: {
      mood: 'Content',
      health: 'Good',
      co2_emissions: '2.1 kg/day',
      exercise: 'Medium'
    }
  },
  { 
    id: 3, 
    name: 'Spotty', 
    level: 2, 
    dateCreated: '2025-02-20',
    description: 'Playful and energetic young cow',
    stats: {
      mood: 'Energetic',
      health: 'Good',
      co2_emissions: '1.8 kg/day',
      exercise: 'High'
    }
  },
  { 
    id: 4, 
    name: 'Milky Way', 
    level: 4, 
    dateCreated: '2025-01-30',
    description: 'Consistent high-quality milk producer',
    stats: {
      mood: 'Calm',
      health: 'Very Good',
      co2_emissions: '2.2 kg/day',
      exercise: 'Medium'
    }
  },
];

const CowDetails = () => {
  const { id } = useParams();
  const cow = allCows.find(cow => cow.id === parseInt(id));

  if (!cow) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p>Cow not found!</p>
        <Link to="/farm" className="text-blue-500 hover:text-blue-700">
          Back to Cow Farm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/farm" 
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Farm
        </Link>
        
        <Link 
          to="/inventory" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          View Inventory
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">{cow.name}</h2>
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-800">
              Level {cow.level}
            </span>
          </div>
          
          <p className="text-gray-600 mb-6">{cow.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Level</td>
                    <td className="py-2 text-right">{cow.level}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Date Added</td>
                    <td className="py-2 text-right">
                      {new Date(cow.dateCreated).toLocaleDateString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Health Stats</h3>
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Mood</td>
                    <td className="py-2 text-right">{cow.stats.mood}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Health</td>
                    <td className="py-2 text-right">{cow.stats.health}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">CO₂ Emissions</td>
                    <td className="py-2 text-right">{cow.stats.co2_emissions}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 font-medium">Exercise</td>
                    <td className="py-2 text-right">{cow.stats.exercise}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CowDetails;