import React, { useState, useEffect } from 'react';
import './App.css'; 
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import axios from 'axios';
import CowImage from "/src/assets/images/cow.png";
import TitleImage from "/src/assets/images/title.png";
import Cloud1Image from "/src/assets/images/cloud1.png";
import Cloud2Image from "/src/assets/images/cloud2.png";
import HungerIcon from "/src/assets/images/hunger.png"; 

function HomePage() {
    console.log("HomePage function executing");
    const navigate = useNavigate();
    const { user } = useAuth();
    console.log("Auth context user:", user);
    const [cowData, setCowData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("useEffect triggered");
        const fetchCowData = async () => {
            console.log("fetchCowData function executing");
            if (!user) {
                console.log("No user found, skipping cow data fetch");
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                console.log("Fetching cow data with token:", token);
                
                const response = await axios.get(
                    'http://localhost:8000/api/shop/cows/my_cow/',
                    {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    }
                );
                console.log("Cow data received:", response.data);
                setCowData(response.data);
            } catch (error) {
                console.error('Error fetching cow data:', error);
                // The user might not have a cow yet
                console.log("Could not fetch cow data, error:", error.response?.status);
            } finally {
                console.log("Setting loading to false");
                setLoading(false);
            }
        };

        fetchCowData();
    }, [user]);

    console.log("Current state - loading:", loading, "cowData:", cowData);

    // Add a Micro5 font style for the cow name
    const cowNameStyle = {
        fontFamily: "'Micro5', 'Press Start 2P', monospace",
        textShadow: '2px 2px 0 #000',
        marginBottom: '10px'
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-blue-700 to-blue-300 flex flex-col items-center justify-between relative">
            <div className="flex-grow-[1]"></div>
            
            <div className="flex flex-col items-center mb-6 relative">
                <img src={TitleImage} alt="Title" className="w-96 h-auto mb-4" />
                
                {/* Cow name - show only if cow exists */}
                {!loading && cowData && (
                    <div style={cowNameStyle} className="text-2xl text-white mb-4">
                        {cowData.cow_name}
                    </div>
                )}
                
                {/* Show cow regardless of whether cowData exists */}
                <img src={CowImage} alt="Cow" className="w-64 h-auto" />
                
                {/* Show stats only if cow exists */}
                {!loading && cowData && (
                    <div className="mt-4 flex items-center space-x-4">
                        {/* Hunger indicator */}
                        <div className="relative w-12 h-12 bg-white rounded-full overflow-hidden border-2 border-gray-300">
                            <img 
                                src={HungerIcon} 
                                alt="Hunger" 
                                className="absolute inset-0 w-full h-full object-cover z-10 opacity-30"
                            />
                            <div 
                                className="absolute bottom-0 w-full bg-yellow-500 z-0"
                                style={{ 
                                    height: `${cowData.hunger}%`,
                                    transition: 'height 0.5s ease-in-out'
                                }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center z-20 font-bold text-sm">
                                {cowData.hunger}%
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Show create cow message if user is logged in but has no cow */}
                {!loading && user && !cowData && (
                    <div className="mt-4 px-4 py-2 bg-white rounded-lg shadow text-center">
                        <p className="text-blue-500 font-bold">Create your cow in the Farm!</p>
                        <button 
                            onClick={() => navigate('/farm')}
                            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
                        >
                            Go to Farm
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-grow-[1]"></div>

            {!user ? (
                <>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pb-4 relative z-30">
                        <button
                            className="bg-white text-blue-500 px-6 py-2 rounded shadow-lg"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className="bg-white text-blue-500 px-6 py-2 rounded shadow-lg"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4 pb-4 relative z-30">
                        <button
                            className="bg-white text-blue-500 px-4 py-2 rounded shadow-lg"
                            onClick={() => navigate("/farm")}
                        >
                            My Cow
                        </button>
                        <button
                            className="bg-white text-blue-500 px-4 py-2 rounded shadow-lg"
                            onClick={() => navigate("/inventory")}
                        >
                            Inventory
                        </button>
                        <button
                            className="bg-white text-blue-500 px-4 py-2 rounded shadow-lg"
                            onClick={() => navigate("/shop")}
                        >
                            Shop
                        </button>
                        <button
                            className="bg-white text-blue-500 px-4 py-2 rounded shadow-lg"
                            onClick={() => navigate("/leaderboard")}
                        >
                            Leaderboard
                        </button>
                    </div>
                </>
            )}

            {/* Cloud Images - commented out for simplicity
            <img
                src={Cloud1Image}
                alt="Cloud"
                className="w-64 h-auto absolute bottom-0 left-0 z-10"
            />
            <img
                src={Cloud2Image}
                alt="Cloud"
                className="w-64 h-auto absolute bottom-0 left-40 z-20"
            /> */}
        </div>
    );
}

export default HomePage;