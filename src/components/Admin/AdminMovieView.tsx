import React, { useEffect, useState } from "react";
import { Movie, MovieStatus } from "../../models/Movie";
import MovieService from "../../service/MovieService";

export const AdminMovieView: React.FC = () => {

    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

    const [formData, setFormData] = useState<Movie>({
        title: "",
        description: "",
        duration: 120,
        language: "English",
        genre: "Action",
        releaseDate: "",
        status: MovieStatus.NOW_SHOWING
    });

    useEffect(() => {
        loadMovies();
    }, []);

    const loadMovies = async () => {
        try {
            setLoading(true);

            const data = await MovieService.getAllMovies();

            setMovies(data || []);
        } catch (error) {
            console.error("Failed to load movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            if (
                editingMovie &&
                editingMovie.id
            ) {

                await MovieService.updateMovie(
                    editingMovie.id,
                    formData
                );

                alert("Movie updated successfully!");

            } else {

                await MovieService.createMovie(
                    formData
                );

                alert("Movie created successfully!");
            }

            resetForm();
            await loadMovies();

        } catch (error: any) {

            console.error(
                "Movie operation failed:",
                error
            );

            const message =
                error.response?.data?.errorDescription ||
                error.response?.data?.message ||
                "Movie operation failed.";

            alert(message);
        }
    };

    const handleEdit = (movie: Movie) => {

        setEditingMovie(movie);

        setFormData({
            ...movie
        });
    };

    const handleDelete = async (
        id: string
    ) => {

        if (
            !window.confirm(
                "Delete this movie?"
            )
        ) {
            return;
        }

        try {

            await MovieService.deleteMovie(id);

            alert("Movie deleted successfully!");

            await loadMovies();

        } catch (error: any) {

            console.error(
                "Failed to delete movie:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete movie."
            );
        }
    };

    const resetForm = () => {

        setEditingMovie(null);

        setFormData({
            title: "",
            description: "",
            duration: 120,
            language: "English",
            genre: "Action",
            releaseDate: "",
            status: MovieStatus.NOW_SHOWING
        });
    };

    if (loading) {

        return (
            <div className="text-center mt-10 text-white">
                Loading Admin Panel...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-white">

            <h1 className="text-3xl font-bold mb-6">
                🎬 Admin: Manage Movies
            </h1>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">

                <h2 className="text-xl font-bold mb-4">
                    {editingMovie
                        ? "Edit Movie"
                        : "Add New Movie"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                title: e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <input
                        type="text"
                        placeholder="Genre"
                        value={formData.genre}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                genre: e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <input
                        type="text"
                        placeholder="Language"
                        value={formData.language}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                language: e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <input
                        type="number"
                        placeholder="Duration (mins)"
                        value={formData.duration}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                duration:
                                    Number(e.target.value)
                            })
                        }
                        required
                        min="1"
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <input
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                releaseDate:
                                    e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status:
                                    e.target.value as MovieStatus
                            })
                        }
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    >

                        <option value={MovieStatus.NOW_SHOWING}>
                            NOW_SHOWING
                        </option>

                        <option value={MovieStatus.UPCOMING}>
                            UPCOMING
                        </option>

                        <option value={MovieStatus.ENDED}>
                            ENDED
                        </option>

                    </select>

                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description:
                                    e.target.value
                            })
                        }
                        required
                        className="md:col-span-2 bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white h-24"
                    />

                    <div className="md:col-span-2 flex gap-3">

                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold"
                        >
                            {editingMovie
                                ? "Update Movie"
                                : "Save Movie"}
                        </button>

                        {editingMovie && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-600 px-6 py-2 rounded-lg font-bold"
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">

                <table className="w-full text-left text-gray-300">

                    <thead className="bg-gray-700 text-gray-200 text-xs uppercase">

                        <tr>
                            <th className="p-4">
                                ID
                            </th>

                            <th className="p-4">
                                Title
                            </th>

                            <th className="p-4">
                                Genre
                            </th>

                            <th className="p-4">
                                Status
                            </th>

                            <th className="p-4 text-right">
                                Actions
                            </th>
                        </tr>

                    </thead>

                    <tbody>

                        {movies.map((movie) => (

                            <tr
                                key={movie.id}
                                className="border-b border-gray-700"
                            >

                                <td className="p-4 text-xs font-mono">
                                    {movie.id}
                                </td>

                                <td className="p-4 font-bold text-white">
                                    {movie.title}
                                </td>

                                <td className="p-4">
                                    {movie.genre}
                                </td>

                                <td className="p-4">
                                    {movie.status}
                                </td>

                                <td className="p-4 text-right space-x-2">

                                    <button
                                        onClick={() =>
                                            handleEdit(movie)
                                        }
                                        className="bg-yellow-600 text-xs px-3 py-1.5 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(movie.id!)
                                        }
                                        className="bg-red-600 text-xs px-3 py-1.5 rounded"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default AdminMovieView;