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
      </Routes>
    </Router>
  );
}

export default App;
