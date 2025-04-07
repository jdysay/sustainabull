import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import all your components
import HomePage from "../HomePage";
import LoginPage from '../LoginPage';
import SignUpPage from '../SignUpPage';
import LoadingPage from '../LoadingPage';
import PreOnboarding from '../pre-onboarding/PreOnboarding';
import Home from '../Home';
import TransportationMode from '../map/TransportationMode';
import InputDestination from '../map/InputDestination';
import OngoingTrip from '../map/OngoingTrip';
import Shop from '../shop/Shop';
import Leaderboard from '../leaderboard/Leaderboard';
import Inventory from '../inventory/Inventory';
import Map from '../map/TransportationMode';
import TripRewards from '../map/TripRewards';
import CowDetails from '../farm/CowDetails';
import CowFarm from '../farm/CowFarm';
import FAQ from '../faq/FAQ'; // Import the FAQ component

// Root route to handle initial navigation
const Root = () => {
  const { user, loading } = useAuth();
  
  console.log("Root route - Auth state:", { user, loading });
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If no user, go to login page
  if (!user) {
    console.log("No authenticated user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // If user exists, go to home
  console.log("User is authenticated, redirecting to home");
  return <Navigate to="/home" replace />;
};

// Protected route wrapper
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  
  console.log("Protected route check:", { user, loading });
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    console.log("Access to protected route denied - redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  console.log("Protected route access granted");
  return <Outlet />;
};

// Auth route wrapper (login/signup pages)
const AuthRoute = () => {
  const { user, loading } = useAuth();
  
  console.log("Auth route check:", { user, loading });
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (user) {
    console.log("User already logged in, redirecting to home");
    return <Navigate to="/home" replace />;
  }
  
  console.log("Auth route access granted (user not logged in)");
  return <Outlet />;
};

const AppRoutes = () => {
  const { loading } = useAuth();
  
  console.log("AppRoutes rendering, loading state:", loading);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      {/* Root path should check auth and redirect appropriately */}
      <Route path="/" element={<Root />} />
      
      {/* Public routes - accessible to everyone */}
      <Route path="/landing" element={<HomePage />} />
      <Route path="/loading" element={<LoadingPage />} />
      
      {/* Auth routes - only when NOT logged in */}
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      
      {/* Protected routes - only when logged in */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/pre-onboarding" element={<PreOnboarding />} />
        <Route path="/transportation-mode" element={<TransportationMode />} />
        <Route path="/input-destination" element={<InputDestination />} />
        <Route path="/ongoing-trip" element={<OngoingTrip />} />
        <Route path="/trip-rewards" element={<TripRewards />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/map" element={<Map />} />
        <Route path="/farm" element={<CowFarm />} />
        <Route path="/cow-details" element={<CowDetails />} />
        <Route path="/cow/:id" element={<CowDetails />} />
        <Route path="/faq" element={<FAQ />} /> {/* Add FAQ route */}
      </Route>
      
      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;