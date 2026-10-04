import React, { useEffect, useState } from 'react';
import { Movie, MovieStatus } from '../../models/Movie';
import MovieService from '../../service/MovieService';
import { useNavigate } from 'react-router-dom';

export const MovieView: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        try {
            setLoading(true);
            const data = await MovieService.getAllMovies();
            setMovies(data);
        } catch (err) {
            console.error('Failed to fetch movies', err);
            setError('Failed to load movies. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const filteredMovies = selectedStatus === 'ALL'
        ? movies
        : movies.filter(m => m.status === selectedStatus);

    const getHeadingTitle = () => {
        switch (selectedStatus) {
            case MovieStatus.NOW_SHOWING:
                return "🎬 Currently Showing Movies";
            case MovieStatus.UPCOMING:
                return "🎬 Upcoming Movies";
            default:
                return "🎬 Currently Showing & Upcoming Movies";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-xl text-white font-medium">Loading movies...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-10 text-red-400 font-semibold">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    {getHeadingTitle()}
                </h1>
                
                <div className="flex items-center gap-2">
                    <label htmlFor="status-filter" className="text-sm font-medium text-gray-300 sr-only">
                        Filter by Status
                    </label>
                    <select
                        id="status-filter"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value={MovieStatus.NOW_SHOWING}>Now Showing</option>
                        <option value={MovieStatus.UPCOMING}>Upcoming</option>
                    </select>
                </div>
            </div>

            {/* Empty State */}
            {filteredMovies.length === 0 ? (
                <div className="bg-gray-800/50 rounded-xl p-12 text-center text-gray-400 border border-gray-700">
                    <p className="text-lg">No movies found for the selected status.</p>
                </div>
            ) : (
                /* Movie Card Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMovies.map((movie) => (
                        <div 
                            key={movie.id} 
                            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col justify-between p-5 hover:border-gray-600 transition"
                        >
                            <div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                    movie.status === MovieStatus.NOW_SHOWING 
                                        ? 'bg-green-900/80 text-green-300 border border-green-700' 
                                        : 'bg-blue-900/80 text-blue-300 border border-blue-700'
                                }`}>
                                    {movie.status}
                                </span>
                                <h2 className="text-xl font-bold text-white mt-3 line-clamp-1">{movie.title}</h2>
                                <p className="text-gray-400 text-sm mt-1">{movie.genre} • {movie.duration} mins • {movie.language}</p>
                                <p className="text-gray-300 text-sm mt-3 line-clamp-3">{movie.description}</p>
                            </div>

                            <button
                                onClick={() => navigate(`/shows/movie/${movie.id}`)}
                                disabled={movie.status === MovieStatus.ENDED}
                                className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {movie.status === MovieStatus.NOW_SHOWING ? 'View Shows & Book' : 'View Details'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};