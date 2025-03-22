import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <Link to="/home" className="mt-6 w-50 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition block text-center">
        Home
    </Link>
  );
}