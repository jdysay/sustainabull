import cow from './assets/images/cow.png';
import { Link } from 'react-router-dom';

export default function Home() {
  // Define which buttons should link to another page
  const linkedButtons = ['Shop', 'Leaderboard', 'Settings', 'Inventory', 'Map', 'Farm'];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 font-mono">

      {/* Top Nav */}
      <div className="flex justify-around bg-blue-900 text-black py-3 text-sm font-bold">
        {['Level', 'Coins', 'Shop', 'Leaderboard', 'Settings'].map((nav) =>
          linkedButtons.includes(nav) ? (
            <Link
              key={nav}
              to={`/${nav.toLowerCase()}`} // Link to the corresponding page
              className="hover:underline"
            >
              {nav}
            </Link>
          ) : (
            <button key={nav} className="hover:bg-gray-300">
              {nav}
            </button>
          )
        )}
      </div>

      {/* Cow Image */}
      <div className="flex-1 flex justify-center items-center">
        <img
          src={cow}
          alt="Cow"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-around py-4">
        {['Mood', 'Hunger', 'Poop', 'Walk'].map((action) =>
          linkedButtons.includes(action) ? (
            <Link
              key={action}
              to={`/${action.toLowerCase()}`} // Link to the corresponding page
              className="bg-green-500 text-white px-6 py-2 rounded-xl shadow-md hover:bg-green-600 transition"
            >
              {action}
            </Link>
          ) : (
            <button
              key={action}
              className="bg-green-500 text-white px-8 py-8 rounded-xl shadow-md hover:bg-green-600 transition"
            >
              {action}
            </button>
          )
        )}
      </div>

      {/* Bottom Nav */}
      <div className="flex justify-around bg-blue-900 text-black py-3 text-sm font-bold">
        {['Inventory', 'Map', 'Farm'].map((nav) =>
          linkedButtons.includes(nav) ? (
            <Link
              key={nav}
              to={`/${nav.toLowerCase()}`} // Link to the corresponding page
              className="hover:underline"
            >
              {nav}
            </Link>
          ) : (
            <button key={nav} className="hover:underline">
              {nav}
            </button>
          )
        )}
      </div>
    </div>
  );
}