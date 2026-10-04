import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export const NavBar = () => {
    const { isAuthenticated, userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/sign-in');
    };

    // Check if the authenticated user has the ADMIN role
    const isAdmin = isAuthenticated && (userRole === 'ROLE_ADMIN' || userRole === 'ADMIN');

    return (
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <Link to="/movies" className="text-xl font-bold text-indigo-400">
                🎬 Movie Booking
            </Link>

            <div className="flex items-center space-x-6">
                {/* General Links */}
                <Link to="/movies" className="hover:text-indigo-400">Movies</Link>
                <Link to="/theatres" className="hover:text-indigo-400">Theatres</Link>
                <Link to="/shows" className="hover:text-indigo-400">Shows</Link>

                {/* Customer-only Links */}
                {isAuthenticated && !isAdmin && (
                    <Link to="/my-bookings" className="hover:text-indigo-400">My Bookings</Link>
                )}

                {/* Admin-only Links — Hidden from customers and unauthenticated users */}
                {isAdmin && (
                    <div className="flex items-center space-x-4 border-l border-gray-600 pl-4">
                        <span className="text-xs font-bold text-yellow-400 uppercase bg-yellow-900/40 px-2 py-1 rounded">
                            Admin
                        </span>
                        <Link to="/admin/movies" className="text-sm font-semibold hover:text-indigo-400">Manage Movies</Link>
                        <Link to="/admin/shows" className="text-sm font-semibold hover:text-indigo-400">Manage Shows</Link>
                        <Link to="/admin/theatres" className="text-sm font-semibold hover:text-indigo-400">Manage Theatres</Link>
                        <Link to="/users" className="text-sm font-semibold hover:text-indigo-400">Users</Link>
                    </div>
                )}

                {/* Auth Controls */}
                {isAuthenticated ? (
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded font-semibold text-sm"
                    >
                        Logout
                    </button>
                ) : (
                    <div className="flex items-center space-x-3">
                        <Link 
                            to="/sign-in" 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded font-semibold text-sm"
                        >
                            Sign In
                        </Link>
                        <Link 
                            to="/sign-up" 
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded font-semibold text-sm"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};