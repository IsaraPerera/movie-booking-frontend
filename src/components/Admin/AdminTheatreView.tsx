import React, { useEffect, useState } from "react";
import {
    Theatre,
    TheatreStatus
} from "../../models/Theatre";
import TheatreService from "../../service/TheatreService";

export const AdminTheatreView: React.FC = () => {

    const [theatres, setTheatres] = useState<Theatre[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingTheatre, setEditingTheatre] =
        useState<Theatre | null>(null);

    const [formData, setFormData] =
        useState<Theatre>({
            name: "",
            location: "",
            capacity: 100,
            status: TheatreStatus.ACTIVE
        });

    useEffect(() => {
        loadTheatres();
    }, []);

    const loadTheatres = async () => {

        try {

            setLoading(true);

            const data =
                await TheatreService.getAllTheatres();

            setTheatres(data || []);

        } catch (error) {

            console.error(
                "Failed to load theatres:",
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

        try {

            if (
                editingTheatre &&
                editingTheatre.id
            ) {

                await TheatreService.updateTheatre(
                    editingTheatre.id,
                    formData
                );

                alert(
                    "Theatre updated successfully!"
                );

            } else {

                await TheatreService.createTheatre(
                    formData
                );

                alert(
                    "Theatre created successfully!"
                );
            }

            resetForm();

            await loadTheatres();

        } catch (error: any) {

            console.error(
                "Theatre operation failed:",
                error
            );

            const message =
                error.response?.data?.errorDescription ||
                error.response?.data?.message ||
                "Failed to save theatre.";

            alert(message);
        }
    };

    const handleDelete = async (
        id: string
    ) => {

        if (
            !window.confirm(
                "Delete this theatre?"
            )
        ) {
            return;
        }

        try {

            await TheatreService.deleteTheatre(id);

            alert(
                "Theatre deleted successfully!"
            );

            await loadTheatres();

        } catch (error: any) {

            console.error(
                "Failed to delete theatre:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete theatre."
            );
        }
    };

    const handleEdit = (
        theatre: Theatre
    ) => {

        setEditingTheatre(theatre);

        setFormData({
            ...theatre
        });
    };

    const resetForm = () => {

        setEditingTheatre(null);

        setFormData({
            name: "",
            location: "",
            capacity: 100,
            status: TheatreStatus.ACTIVE
        });
    };

    if (loading) {

        return (
            <div className="text-center mt-10 text-white">
                Loading theatres...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-white">

            <h1 className="text-3xl font-bold mb-6">
                🏛️ Admin: Manage Theatres
            </h1>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">

                <h2 className="text-xl font-bold mb-4">
                    {editingTheatre
                        ? "Edit Theatre"
                        : "Add New Theatre"}
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <input
                        type="text"
                        placeholder="Theatre Name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                name: e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                location:
                                    e.target.value
                            })
                        }
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <input
                        type="number"
                        placeholder="Capacity"
                        value={formData.capacity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                capacity:
                                    Number(e.target.value)
                            })
                        }
                        min="1"
                        required
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    />

                    <select
                        value={formData.status}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                status:
                                    e.target.value as TheatreStatus
                            })
                        }
                        className="bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white"
                    >

                        <option value={TheatreStatus.ACTIVE}>
                            ACTIVE
                        </option>

                        <option value={TheatreStatus.INACTIVE}>
                            INACTIVE
                        </option>

                    </select>

                    <div className="md:col-span-2 flex gap-3">

                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold"
                        >
                            {editingTheatre
                                ? "Update Theatre"
                                : "Save Theatre"}
                        </button>

                        {editingTheatre && (
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

                    <thead className="bg-gray-700 text-xs uppercase">

                        <tr>

                            <th className="p-4">
                                ID
                            </th>

                            <th className="p-4">
                                Name
                            </th>

                            <th className="p-4">
                                Location
                            </th>

                            <th className="p-4">
                                Capacity
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

                        {theatres.map((theatre) => (

                            <tr
                                key={theatre.id}
                                className="border-b border-gray-700"
                            >

                                <td className="p-4 text-xs font-mono">
                                    {theatre.id}
                                </td>

                                <td className="p-4 font-bold text-white">
                                    {theatre.name}
                                </td>

                                <td className="p-4">
                                    {theatre.location}
                                </td>

                                <td className="p-4">
                                    {theatre.capacity}
                                </td>

                                <td className="p-4">
                                    {theatre.status}
                                </td>

                                <td className="p-4 text-right space-x-2">

                                    <button
                                        onClick={() =>
                                            handleEdit(theatre)
                                        }
                                        className="bg-yellow-600 text-xs px-3 py-1.5 rounded"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                theatre.id!
                                            )
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

export default AdminTheatreView;