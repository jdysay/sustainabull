import './App.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage"
import LoginPage from './LoginPage';
import SignUpPage from './SignUpPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
