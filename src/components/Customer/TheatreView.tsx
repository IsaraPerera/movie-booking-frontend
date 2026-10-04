import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Theatre } from '../../models/Theatre';
import TheatreService from '../../service/TheatreService';

export const TheatreView: React.FC = () => {
    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadTheatres();
    }, []);

    const loadTheatres = async () => {
        try {
            setError(null);
            const data = await TheatreService.getAllTheatres();
            setTheatres(data || []);
        } catch (err) {
            console.error('Failed to fetch theatres', err);
            setError('Failed to load theatres. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10 text-white">Loading theatres...</div>;

    if (error) {
        return <div className="text-center mt-10 text-red-400 font-semibold">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">🎬 Partner Theatres</h1>
            </div>

            {theatres.length === 0 ? (
                <div className="text-center text-gray-400 py-16 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    No theatres available.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {theatres.map((theatre) => (
                        <div key={theatre.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 flex flex-col justify-between p-6">
                            <div>
                                <h2 className="text-xl font-bold text-white">{theatre.name}</h2>
                                <p className="text-gray-400 text-sm mt-1">📍 {theatre.location}</p>
                                <p className="text-gray-300 text-sm mt-3">
                                    Capacity: <span className="font-semibold text-white">{theatre.capacity} seats</span>
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/shows/theatre/${theatre.id}`)}
                                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition"
                            >
                                View Shows
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};