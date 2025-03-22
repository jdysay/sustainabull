import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';
import LoadingPage from './LoadingPage';
import PreOnboarding from './pre-onboarding/PreOnboarding'
import Home from './Home'

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
      </Routes>
    </Router>
  );
}

export default App;
