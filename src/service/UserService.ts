import axios from "axios";
import { User } from "../models/User";
import { getAuthHeader } from "./apiConfig";

const baseUrl = "http://localhost:8080/api/v1/api/users";

const getUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(baseUrl, getAuthHeader());
    return response.data;
};

const updateUser = async (user: User): Promise<number> => {
    const response = await axios.put(`${baseUrl}/${user.userId}`, user, getAuthHeader());
    return response.status;
};

const deleteUser = async (userId: string): Promise<number> => {
    const response = await axios.delete(`${baseUrl}/${userId}`, getAuthHeader());
    return response.status;
};

export default { getUsers, updateUser, deleteUser };