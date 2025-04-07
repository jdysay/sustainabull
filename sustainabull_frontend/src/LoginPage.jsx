import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import './App.css';
import Cloud1Image from "/src/assets/images/cloud1.png";
import Cloud2Image from "/src/assets/images/cloud2.png";
import TopCloudImage1 from "/src/assets/images/top-cloud1.png";
import TopCloudImage2 from "/src/assets/images/top-cloud2.png";

function LoginPage() {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // If already logged in, redirect away from login page
    useEffect(() => {
        if (user) {
            navigate('/shop');
        }
    }, [user, navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setShowError(false);

        try {
            console.log("Submitting login for:", username);
            
            // Add detailed logging of the request before sending
            console.log("Login request data:", { username, password: "***" });
            
            const result = await login(username, password);
            
            if (result.success) {
                console.log("Login successful, redirecting");
                navigate("/shop");
            } else {
                console.log("Login failed:", result.error);
                // Log more details about the error if available
                if (result.statusCode) {
                    console.log("Status code:", result.statusCode);
                }
                if (result.response) {
                    console.log("Response data:", result.response);
                }
                setErrorMessage(result.error || "Login failed. Please check your credentials.");
                setShowError(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            // Add more detailed error logging
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Status code:', error.response.status);
                setErrorMessage(error.response.data?.detail || 'Server error: ' + error.response.status);
            } else if (error.request) {
                console.error('No response received:', error.request);
                setErrorMessage('No response from server. Please try again later.');
            } else {
                console.error('Error message:', error.message);
                setErrorMessage('An unexpected error occurred: ' + error.message);
            }
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const closeErrorModal = () => {
        setShowError(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 relative">
            {/* Top Clouds */}
            <div className="absolute top-0 left-0 w-full flex justify-center">
                <img src={TopCloudImage1} alt="Cloud" className="w-64 h-auto absolute left-0 z-10" />
                <img src={TopCloudImage2} alt="Cloud" className="w-64 h-auto absolute right-0 z-20" />
            </div>

            {/* White Login Box */}
            <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg flex flex-col items-center z-30">
                <h1 className="text-4xl font-bold mb-4">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col items-center">
                    <input
                        type="text"
                        placeholder="Username"
                        className="bg-transparent text-custom-blue-dark border-b-2 border-custom-grey focus:border-custom-blue focus:outline-none p-2 w-64 mb-4"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="bg-transparent text-custom-blue-dark border-b-2 border-custom-grey focus:border-custom-blue focus:outline-none p-2 w-64 mt-4 mb-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="bg-transparent text-custom-grey w-full text-left text-sm px-2 py-1 hover:text-custom-blue border-none">forget password?
                    </button>

                    <button
                        type="submit"
                        className="bg-custom-blue-light text-white px-4 py-2 rounded w-64 mt-2 hover:bg-custom-blue border-none"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="flex items-center space-x-1 w-full">
                    <p className="text-custom-grey text-sm">Are you new here?</p>
                    <button className="bg-transparent text-custom-blue text-sm hover:text-custom-blue-light border-none"
                        onClick={() => navigate("/signup")}
                    >
                        Sign up
                    </button>
                </div>
            </div>

            {/* Bottom Clouds */}
            <div className="absolute bottom-40 left-0 w-full flex justify-center">
                <img src={Cloud1Image} alt="Cloud" className="w-64 h-auto absolute left-0 z-10" />
                <img src={Cloud2Image} alt="Cloud" className="w-64 h-auto absolute right-0 z-20" />
            </div>

            {/* Error Modal */}
            {showError && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                        <h3 className="text-xl font-bold text-red-500 mb-4">Login Failed</h3>
                        <p className="text-gray-700 mb-6">{errorMessage}</p>
                        <div className="flex justify-center">
                            <button 
                                onClick={closeErrorModal}
                                className="bg-custom-blue-light text-white px-4 py-2 rounded hover:bg-custom-blue"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoginPage;