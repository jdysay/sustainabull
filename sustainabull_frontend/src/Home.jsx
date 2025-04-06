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