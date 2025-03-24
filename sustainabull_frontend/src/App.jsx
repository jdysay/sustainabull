import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import LoadingPage from './LoadingPage';
import PreOnboarding from './pre-onboarding/PreOnboarding'
import Home from './Home'
import TransportationMode from './map/TransportationMode';
import InputDestination from './map/InputDestination';
import OngoingTrip from './map/OngoingTrip';
import Shop from './shop/Shop';
import Leaderboard from './leaderboard/Leaderboard';
import Settings from './settings/Settings';
import Inventory from './inventory/Inventory';
import Map from './map/TransportationMode';
import Farm from './farm/Farm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/loading" element={<LoadingPage/>} />
        <Route path="/pre-onboarding" element={<PreOnboarding/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/transportation-mode" element={<TransportationMode/>} />
        <Route path="/input-destination" element={<InputDestination/>} />
        <Route path="/ongoing-trip" element={<OngoingTrip/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/inventory" element={<Inventory/>} />
        <Route path="/map" element={<Map/>} />
        <Route path="/farm" element={<Farm/>} />
      </Routes>
    </Router>
  );
}

export default App;
