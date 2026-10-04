import React, { useEffect, useState } from "react";
import {
    Show,
    ShowStatus
} from "../../models/Show";
import { Movie } from "../../models/Movie";
import { Theatre } from "../../models/Theatre";

import ShowService from "../../service/ShowService";
import MovieService from "../../service/MovieService";
import TheatreService from "../../service/TheatreService";

export const AdminShowView: React.FC = () => {

    const [shows, setShows] = useState<Show[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [theatres, setTheatres] =
        useState<Theatre[]>([]);

    const [loading, setLoading] =
        useState<boolean>(true);

    const [formData, setFormData] = useState({
        movieId: "",
        theatreId: "",
        showDate: "",
        showTime: "18:30",
        ticketPrice: 1200
    });

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {

        try {

            setLoading(true);

            const [
                showData,
                movieData,
                theatreData
            ] = await Promise.all([
                ShowService.getAllShows(),
                MovieService.getAllMovies(),
                TheatreService.getAllTheatres()
            ]);

            setShows(showData || []);
            setMovies(movieData || []);
            setTheatres(theatreData || []);

        } catch (error) {

            console.error(
                "Error loading admin show data:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        if (!formData.movieId) {
            alert("Please select a movie.");
            return;
        }

        if (!formData.theatreId) {
            alert("Please select a theatre.");
            return;
        }

        if (!formData.showDate) {
            alert("Please select a show date.");
            return;
        }

        if (!formData.showTime) {
            alert("Please select a show time.");
            return;
        }

        if (formData.ticketPrice <= 0) {
            alert("Ticket price must be greater than 0.");
            return;
        }

        try {

            const payload: Show = {
                movieId: formData.movieId,
                theatreId: formData.theatreId,
                showDate: formData.showDate,
                showTime: formData.showTime,
                ticketPrice:
                    Number(formData.ticketPrice),
                status: ShowStatus.SCHEDULED
            };

            await ShowService.createShow(
                payload
            );

            alert(
                "Show scheduled successfully!"
            );

            await loadShows();

            setFormData({
                movieId: "",
                theatreId: "",
                showDate: "",
                showTime: "18:30",
                ticketPrice: 1200
            });

        } catch (error: any) {

            console.error(
                "Error scheduling show:",
                error
            );

            const message =
                error.response?.data?.errorDescription ||
                error.response?.data?.message ||
                "Failed to schedule show.";

            alert(message);
        }
    };

    const loadShows = async () => {

        try {

            const data =
                await ShowService.getAllShows();

            setShows(data || []);

        } catch (error) {

            console.error(
                "Failed to refresh shows:",
                error
            );
        }
    };

    if (loading) {

        return (
            <div className="text-center mt-10 text-white">
                Loading show management...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-white">

            <h1 className="text-3xl font-bold mb-6">
                📅 Admin: Schedule Shows
            </h1>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">

                <h2 className="text-xl font-bold mb-4">
                    Schedule New Show
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <select
                        value={formData.movieId}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                movieId:
                                    e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    >

                        <option value="">
                            Select Movie
                        </option>

                        {movies.map((movie) => (

                            <option
                                key={movie.id}
                                value={movie.id}
                            >
                                {movie.title}
                            </option>

                        ))}

                    </select>

                    <select
                        value={formData.theatreId}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                theatreId:
                                    e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    >

                        <option value="">
                            Select Theatre
                        </option>

                        {theatres.map((theatre) => (

                            <option
                                key={theatre.id}
                                value={theatre.id}
                            >
                                {theatre.name}
                            </option>

                        ))}

                    </select>

                    <input
                        type="date"
                        value={formData.showDate}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                showDate:
                                    e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <input
                        type="time"
                        value={formData.showTime}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                showTime:
                                    e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <input
                        type="number"
                        placeholder="Ticket Price (LKR)"
                        value={formData.ticketPrice}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                ticketPrice:
                                    Number(
                                        e.target.value
                                    )
                            })
                        }
                        min="1"
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <button
                        type="submit"
                        className="md:col-span-2 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold transition"
                    >
                        Schedule Show
                    </button>

                </form>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">

                <table className="w-full text-left text-gray-300">

                    <thead className="bg-gray-700 text-xs uppercase">

                        <tr>

                            <th className="p-4">
                                Show ID
                            </th>

                            <th className="p-4">
                                Movie ID
                            </th>

                            <th className="p-4">
                                Theatre ID
                            </th>

                            <th className="p-4">
                                Date
                            </th>

                            <th className="p-4">
                                Time
                            </th>

                            <th className="p-4">
                                Price
                            </th>

                            <th className="p-4">
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {shows.map((show) => (

                            <tr
                                key={show.id}
                                className="border-b border-gray-700"
                            >

                                <td className="p-4 text-xs font-mono">
                                    {show.id}
                                </td>

                                <td className="p-4">
                                    {show.movieId}
                                </td>

                                <td className="p-4">
                                    {show.theatreId}
                                </td>

                                <td className="p-4">
                                    {show.showDate}
                                </td>

                                <td className="p-4">
                                    {show.showTime}
                                </td>

                                <td className="p-4 text-green-400 font-bold">
                                    LKR{" "}
                                    {Number(
                                        show.ticketPrice
                                    ).toFixed(2)}
                                </td>

                                <td className="p-4">
                                    {show.status}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default AdminShowView;