import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';
import Cloud1Image from "/src/assets/images/cloud1.png";
import Cloud2Image from "/src/assets/images/cloud2.png";
import TopCloudImage1 from "/src/assets/images/top-cloud1.png";
import TopCloudImage2 from "/src/assets/images/top-cloud2.png";
import axios from 'axios';

function SignUpPage() {
    const navigate = useNavigate();

    // State variables for form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        // Basic validation
        if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/accounts/register/', {
                first_name: firstName,
                last_name: lastName,
                email: email,
                username: username,
                password: password,
                password_confirmation: confirmPassword,
            });

            console.log('Signup successful:', response.data);
            setIsLoading(false);
            navigate("/login"); // Redirect to login on success
        } catch (error) {
            setIsLoading(false);
            console.error('Signup error:', error);
            if (error.response && error.response.data) {
                setError(JSON.stringify(error.response.data));
            } else {
                setError("An error occurred during signup.");
            }
        }
    };

    return (
        <div className="min-h-screen w-[400px] flex flex-col items-center justify-center bg-custom-blue-light relative">
            {/* Top Clouds */}
            <div className="absolute top-0 left-0 w-full flex justify-center">
                <img src={TopCloudImage1} alt="Cloud" className="w-64 h-auto absolute left-0 z-10" />
                <img src={TopCloudImage2} alt="Cloud" className="w-64 h-auto absolute right-0 z-20" />
            </div>

            {/* White Login Box */}
            <div className="w-[300px] bg-white p-6 rounded-lg shadow-lg flex flex-col items-center z-30">
                <h1 className="text-4xl font-bold mb-4">Sign Up</h1>
                <form onSubmit={handleSignup} className="flex flex-col items-center w-full">
                    <input
                        type="text"
                        placeholder="First Name"
                        className="bg-transparent text-custom-blue-dark border-b-2 border-custom-grey focus:border-custom-blue focus:outline-none p-2 w-64 mb-4"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="bg-transparent text-custom-blue-dark border-b-2 border-custom-grey focus:border-custom-blue focus:outline-none p-2 w-64 mb-4"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="bg-transparent text-custom-blue-dark border-b-2 border-custom-grey focus:border-custom-blue focus:outline-none p-2 w-64 mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                        className="bg-transparent text-custom-blue-dark border-b-2 border-custom-grey focus:border-custom-blue-dark focus:outline-none p-2 w-64 mt-4 mb-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="bg-transparent text-custom-blue-dark border-b-2 border-custom-grey focus:border-custom-blue-dark focus:outline-none p-2 w-64 mt-4 mb-1"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <button
                        type="submit"
                        className={`bg-custom-blue-light text-white px-4 py-2 rounded w-64 mt-2 hover:bg-custom-blue border-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <div className="flex items-center space-x-1 w-full">
                    <p className="text-custom-grey text-sm">Already have an account?</p>
                    <button className="bg-transparent text-custom-blue text-sm hover:text-custom-blue-light border-none"
                        onClick={() => navigate("/login")}>
                        Login
                    </button>
                </div>
            </div>

            {/* Bottom Clouds */}
            <div className="absolute bottom-40 left-0 w-full flex justify-center">
                <img src={Cloud1Image} alt="Cloud" className="w-64 h-auto absolute left-0 z-10" />
                <img src={Cloud2Image} alt="Cloud" className="w-64 h-auto absolute right-0 z-20" />
            </div>
        </div>
    );
}

export default SignUpPage;
