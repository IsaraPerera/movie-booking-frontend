import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShowService from '../../service/ShowService';

interface Show {
    id?: string;
    movieId?: string;
    movie?: {
        title: string;
    };
    theatreId?: string;
    theatre?: {
        name: string;
    };
    showDate?: string;
    showTime?: string;
    ticketPrice?: number;
}

export const ShowView: React.FC = () => {
    // Routes: /shows, /shows/movie/:movieId, /shows/theatre/:theatreId
    const { movieId, theatreId } = useParams<{ movieId?: string; theatreId?: string }>();

    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadShows();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movieId, theatreId]);

    const loadShows = async () => {
        try {
            setLoading(true);
            setError(null);

            let data: Show[];
            if (movieId) {
                data = await ShowService.getShowsByMovieId(movieId);
            } else {
                data = await ShowService.getAllShows();
                if (theatreId) {
                    data = data.filter((s: Show) => s.theatreId === theatreId);
                }
            }
            setShows(data || []);
        } catch (err: any) {
            console.error('Failed to fetch shows:', err);
            const serverMessage =
                err.response?.data?.errorDescription ||
                err.message ||
                'Failed to load shows from server.';
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-center text-white text-lg font-medium animate-pulse">
                    Loading available shows...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-16 p-6 bg-red-900/40 border border-red-500/50 rounded-xl text-center text-red-200 shadow-xl backdrop-blur-sm">
                <div className="text-3xl mb-2">⚠️</div>
                <h3 className="text-lg font-semibold text-white mb-2">Error Loading Shows</h3>
                <p className="text-sm text-red-300 mb-4">{error}</p>
                <button
                    onClick={loadShows}
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors shadow-md"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    🎟️ {movieId ? 'Shows for this Movie' : theatreId ? 'Shows at this Theatre' : 'Active Movie Shows'}
                </h1>
            </div>

            {shows.length === 0 ? (
                <div className="text-center text-gray-400 py-16 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <p className="text-lg">No active shows available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {shows.map((show) => {
                        const movieTitle = show.movie?.title || show.movieId || 'Movie Title N/A';
                        const theatreName = show.theatre?.name || show.theatreId || 'Theatre N/A';
                        const timeDisplay = `${show.showDate || ''} ${show.showTime || ''}`.trim() || 'N/A';

                        return (
                            <div
                                key={show.id}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col justify-between p-6 hover:border-gray-600 transition-all duration-200"
                            >
                                <div>
                                    <h2 className="text-xl font-bold text-white truncate" title={movieTitle}>
                                        {movieTitle}
                                    </h2>

                                    <p className="text-gray-400 text-sm mt-1 truncate" title={theatreName}>
                                        🏛️ {theatreName}
                                    </p>

                                    <p className="text-gray-300 text-sm mt-3">
                                        🕒 Time: <span className="text-white font-semibold">{timeDisplay}</span>
                                    </p>

                                    <p className="text-lg font-bold text-green-400 mt-2">
                                        LKR {Number(show.ticketPrice ?? 0).toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate(`/seats/${show.id}`)}
                                    className="mt-6 w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 shadow-md"
                                >
                                    Select Seats & Book
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ShowView;