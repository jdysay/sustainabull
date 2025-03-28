// Leaderboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const players = [
    { id: 1, name: 'Player 1', score: 1000, rank: 1 },
    { id: 2, name: 'Player 2', score: 900, rank: 2 },
    { id: 3, name: 'Player 3', score: 800, rank: 3 },
    { id: 4, name: 'Player 4', score: 700, rank: 4 },
    { id: 5, name: 'Player 5', score: 600, rank: 5 },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">LEADERBOARD</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b text-center">Rank</th>
              <th className="py-3 px-4 border-b text-center">Player</th>
              <th className="py-3 px-4 border-b text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{player.rank}</td>
                <td className="py-3 px-4 border-b font-medium">{player.name}</td>
                <td className="py-3 px-4 border-b">{player.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <div className="flex justify-around mt-8 pt-4 border-t border-gray-200">
            <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
                Home
            </Link>
        </div>
    </div>
  );
};

export default Leaderboard;