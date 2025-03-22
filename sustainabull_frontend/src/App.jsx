import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import LoadingPage from './LoadingPage';
<<<<<<< HEAD
import MapWithDestination from './map/MapWithDesitnation';

=======
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
>>>>>>> 17ad5196441374f41ec266a8ffa25ea94f71c080

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/loading" element={<LoadingPage/>} />
<<<<<<< HEAD
        <Route path="/map/MapWithDestination" element={<MapWithDestination/>} />
=======
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
>>>>>>> 17ad5196441374f41ec266a8ffa25ea94f71c080
      </Routes>
    </Router>
  );
}

export default App;
