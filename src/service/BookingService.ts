import axios from "axios";
import { Theatre } from "../models/Theatre";
import { getAuthHeader } from "./apiConfig";

const BASE_URL = "http://localhost:8080/api/v1/api/theatres";

// The backend (TheatreDTO) already returns { id, name, location, capacity, status },
// which is exactly the frontend Theatre shape, so no conversion is needed.

const getAllTheatres = async (): Promise<Theatre[]> => {
    const response = await axios.get<Theatre[]>(BASE_URL);
    return response.data;
};

const getTheatreById = async (id: string): Promise<Theatre> => {
    const response = await axios.get<Theatre>(`${BASE_URL}/${id}`);
    return response.data;
};

const createTheatre = async (theatre: Theatre): Promise<Theatre> => {
    const payload = {
        name: theatre.name,
        location: theatre.location,
        capacity: theatre.capacity,
        status: theatre.status
    };

    const response = await axios.post<Theatre>(BASE_URL, payload, getAuthHeader());
    return response.data;
};

const updateTheatre = async (id: string, theatre: Theatre): Promise<Theatre> => {
    const payload = {
        name: theatre.name,
        location: theatre.location,
        capacity: theatre.capacity,
        status: theatre.status
    };

    const response = await axios.put<Theatre>(`${BASE_URL}/${id}`, payload, getAuthHeader());
    return response.data;
};

const deleteTheatre = async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`, getAuthHeader());
};

export default {
    getAllTheatres,
    getTheatreById,
    createTheatre,
    updateTheatre,
    deleteTheatre
};