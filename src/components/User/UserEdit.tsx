import React, { useEffect, useState, ChangeEvent } from 'react';
import { UserEditProps } from '../../models/UserEditProps';
import { User } from '../../models/User';
import UserService from '../../service/UserService';

export const UserEdit = ({
    open,
    user,
    onClose,
    onSave
}: UserEditProps) => {
    const [updateFormData, setUpdateFormData] = useState<User | null>(null);

    useEffect(() => {
        setUpdateFormData(user);
    }, [user]);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!updateFormData) return;

        const { name, value } = e.target;
        setUpdateFormData((prev) => ({
            ...prev!,
            [name]: value
        }));
    };

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!updateFormData) return;

        const status = await UserService.updateUser(updateFormData);
        if (status === 200) {
            alert("User Details Updated Successfully");
            onSave();
            onClose();
        } else {
            alert("User Details Update Failed");
        }
    };

    if (!open || !updateFormData) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Edit User
                    </h2>
                    <p className="text-sm text-gray-500">
                        Update user information.
                    </p>
                </div>

                <form onSubmit={handleOnSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={updateFormData.firstName}
                            onChange={handleOnChange}
                            placeholder="Enter first name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={updateFormData.lastName}
                            onChange={handleOnChange}
                            placeholder="Enter last name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={updateFormData.email}
                            onChange={handleOnChange}
                            placeholder="Enter email address"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};