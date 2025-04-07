import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import cow from './assets/images/cow.png';
import HungerIcon from "./assets/images/hunger.png";
import MoodIcon from "./assets/images/mood.png";
import PoopIcon from "./assets/images/poop.png";
import WalkIcon from "./assets/images/walk.png";

// Import navigation icons
import InventoryIcon from "./assets/images/inventory.png";
import MapIcon from "./assets/images/map.png";
import FarmIcon from "./assets/images/farm.png";
import ShopIcon from "./assets/images/shop.png";
import FAQIcon from "./assets/images/faq.png";

export default function Home() {
//   const linkedButtons = ['Shop', 'Leaderboard', 'Inventory', 'Map', 'Farm', 'FAQ'];

//   // SVG Icons for each button
//   const buttonIcons = {
//     Shop: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//       </svg>
//     ),
//     Leaderboard: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//       </svg>
//     ),
//     Inventory: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//       </svg>
//     ),
//     Map: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
//       </svg>
//     ),
//     Farm: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//       </svg>
//     ),
//     FAQ: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     Mood: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     Hunger: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//       </svg>
//     ),
//     Poop: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//       </svg>
//     ),
//     Walk: (
//       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//       </svg>
//     )
//   };
  const { user } = useAuth();
  const [cowData, setCowData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const linkedButtons = ['Shop', 'FAQ', 'Inventory', 'Map', 'Farm'];

  // Navigation icons mapping - add Shop and Leaderboard
  const navIcons = {
    'Inventory': InventoryIcon,
    'Map': MapIcon,
    'Farm': FarmIcon,
    'Shop': ShopIcon,
    'FAQ': FAQIcon
  };

//       {/* Top Nav */}
//       <div className="flex justify-around bg-blue-900 text-black py-4 text-sm font-bold">
//         {['Level', 'Coins', 'Shop', 'Leaderboard', 'FAQ'].map((nav) =>
//           nav === 'Level' || nav === 'Coins' ? (
//             <button key={nav} className="px-4 py-2 hover:bg-blue-800 hover:text-white rounded">
//               {nav}
//             </button>
//           ) : (
//             <Link
//               key={nav}
//               to={`/${nav.toLowerCase()}`}
//               className="px-4 py-2 hover:bg-blue-800 hover:text-white rounded flex items-center gap-2"
//             >
//               {buttonIcons[nav]}
//               {nav}
//             </Link>
//           )
//         )}
  // Global font style to apply to all text
  const globalFontStyle = {
    fontFamily: "'Micro5', 'Press Start 2P', monospace"
  };
  
  // Cow name style - now just controls the size
  const cowNameStyle = {
    ...globalFontStyle,
    fontSize: '24px'
  };

  // Fetch cow data when component mounts
  useEffect(() => {
    const fetchCowData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

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
        setCowData(response.data);
      } catch (error) {
        console.error('Error fetching cow data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCowData();
  }, [user]);

  // Updated StatIndicator with larger icon and Micro5 font
  const StatIndicator = ({ icon, value, color, label }) => (
    <div className="flex flex-col items-center mx-3">
      {/* Rectangle with larger icon */}
      <div className="relative w-20 h-16 bg-white rounded-lg overflow-hidden border-2 border-gray-300">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img 
            src={icon} 
            alt={label} 
            className="w-12 h-12 object-contain opacity-80"
          />
        </div>
        
        <div 
          className="absolute bottom-0 left-0 right-0 z-0"
          style={{ 
            height: `${value}%`,
            backgroundColor: color,
            transition: 'height 0.5s ease-in-out'
          }}
        ></div>
      </div>
      
      {/* Percentage with colored background matching the stat */}
      <div 
        className="px-2 py-0.5 rounded-full text-xs font-bold text-white mt-1"
        style={{ backgroundColor: color, ...globalFontStyle }}
      >
        {value}%
      </div>
      
      {/* Label */}
      <span className="text-xs font-bold mt-1 text-gray-700" style={globalFontStyle}>{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-blue-200" style={globalFontStyle}>
      {/* Top Nav - updated with right-aligned navigation */}
      <div className="flex items-center bg-[#3774AD] text-white py-4 px-6">
        {/* Left: Level display with XP */}
        {!loading && cowData && (
          <div className="flex items-center">
            <div className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold mr-2" style={globalFontStyle}>
              Level {cowData.cow_level || 1}
            </div>
            
            {cowData.next_level_xp && (
              <div className="flex flex-col w-24">
                <div className="flex justify-between text-xs text-white mb-1">
                  <span style={globalFontStyle}>{cowData.experience_points}/{cowData.next_level_xp} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-yellow-400 h-1.5 rounded-full" 
                    style={{ width: `${(cowData.experience_points / cowData.next_level_xp) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Right-aligned container for navigation and gold */}
        <div className="flex items-center ml-auto space-x-4">
          {/* Navigation buttons with icons */}
          {['Shop', 'FAQ'].map((nav) =>
            linkedButtons.includes(nav) ? (
              <Link
                key={nav}
                to={`/${nav.toLowerCase()}`}
                className="flex flex-col items-center hover:opacity-80 transition-opacity"
              >
                {/* Add circular frame for icons */}
                <div className="bg-white p-1.5 rounded-full">
                  <img 
                    src={navIcons[nav]} 
                    alt={nav} 
                    className="w-9 h-9"
                  />
                </div>
                <span className="text-white font-bold mt-1" style={globalFontStyle}>
                  {nav}
                </span>
              </Link>
            ) : (
              <button 
                key={nav} 
                className="flex flex-col items-center hover:opacity-80 transition-opacity"
              >
                {/* Add circular frame for icons */}
                <div className="bg-white p-1.5 rounded-full">
                  <img 
                    src={navIcons[nav]} 
                    alt={nav} 
                    className="w-9 h-9"
                  />
                </div>
                <span className="text-sm font-bold mt-1" style={globalFontStyle}>
                  {nav}
                </span>
              </button>
            )
          )}
          
          {/* Gold display */}
          <span className="bg-yellow-400 text-black font-bold px-3 py-1 rounded-full ml-2" style={globalFontStyle}>
            {user && user.gold !== undefined ? user.gold : 0} Gold
          </span>
        </div>
      </div>

      {/* Main content - Cow Image and Stats */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        {/* Cow name with updated blue frame matching the nav bars */}
        {!loading && cowData && (
          <div className="text-center mb-4">
            <div className="inline-block bg-white border-2 border-[#3774AD] rounded-lg px-4 py-2">
              <div className="text-[#3774AD] font-bold" style={cowNameStyle}>
                {cowData.cow_name}
              </div>
            </div>
          </div>
        )}
        
        {/* Cow image */}
        <img src={cow} alt="Cow" className="my-6" />
        
        {/* Stat Indicators with increased spacing */}
        {!loading && cowData && (
          <div className="flex justify-center items-center mt-6 flex-wrap gap-6">
            <StatIndicator 
              icon={HungerIcon}
              value={cowData.hunger || 50}
              color="#FDDB3A" /* Yellow */
              label="Hunger"
            />
            <StatIndicator 
              icon={MoodIcon}
              value={cowData.mood || 50}
              color="#FF6B6B" /* Pink */
              label="Mood"
            />
            <StatIndicator 
              icon={PoopIcon}
              value={cowData.co2_emissions || 50}
              color="#8B4513" /* Brown */
              label="CO2"
            />
            <StatIndicator 
              icon={WalkIcon}
              value={cowData.exercise || 50}
              color="#4ECDC4" /* Teal */
              label="Walk"
            />
          </div>
        )}
      </div>

      {/* Bottom Nav - updated background color */}
      <div className="flex justify-around bg-[#3774AD] text-white py-4 px-6 text-sm font-bold">
        {['Inventory', 'Map', 'Farm'].map((nav) =>
          linkedButtons.includes(nav) ? (
            <Link
              key={nav}
              to={`/${nav.toLowerCase()}`}
              className="flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src={navIcons[nav]} 
                alt={nav} 
                className="w-10 h-10 mb-1"
              />
              <span className="text-white" style={globalFontStyle}>{nav}</span>
            </Link>
          ) : (
            <button 
              key={nav} 
              className="flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              <img 
                src={navIcons[nav]} 
                alt={nav} 
                className="w-10 h-10 mb-1"
              />
              <span className="text-xs" style={globalFontStyle}>{nav}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}