import React, { useEffect, useState } from 'react';
import { User } from '../../models/User';
import UserService from '../../service/UserService';
import { UserEdit } from './UserEdit';

export const UserView = () => {
    const [users, setUser] = useState<User[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const getAllUsers = async () => {
        try {
            const userData = await UserService.getUsers();
            setUser(userData);
        } catch (error) {
            console.error(error);
            alert("Failed to load users.");
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const handleOnEdit = (user: User) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleOnDelete = async (userId: string) => {
        const status = await UserService.deleteUser(userId);
        if (status !== 200) {
            alert("User Delete Fail");
        } else {
            alert("User Deleted Successfully");
            getAllUsers();
        }
    };

    return (
        <div className="max-w-8xl mx-auto mt-8 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                    User Enrollment Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Manage registered users
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                User ID
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                First Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Last Name
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                Role
                            </th>
                            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.userId} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-700">{user.userId}</td>
                                <td className="px-6 py-4 font-medium">{user.firstName}</td>
                                <td className="px-6 py-4 font-medium">{user.lastName}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <button 
                                        onClick={() => handleOnEdit(user)} 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => user.userId && handleOnDelete(user.userId)} 
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <UserEdit
                    open={open}
                    user={selectedUser}
                    onClose={() => setOpen(false)}
                    onSave={getAllUsers}
                />
            </div>
        </div>
    );
};