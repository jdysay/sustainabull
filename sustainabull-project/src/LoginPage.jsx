import { useNavigate } from "react-router-dom";
import './App.css'; 

function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-128 bg-gradient-to-b from-custom-blue-dark to-custom-blue-light flex flex-col items-center justify-between relative">
            <h2>Login</h2>
            <input type="text" placeholder="Username" className="mb-2 p-2 border rounded w-64" />
            <input type="password" placeholder="Password" className="mb-4 p-2 border rounded w-64" />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => navigate("/home")}
            >
                Login
            </button>
        </div>
    );
}

export default LoginPage;