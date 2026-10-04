import axios from "axios";
import { Movie } from "../models/Movie";
import { getAuthHeader } from "./apiConfig";

const BASE_URL = "http://localhost:8080/api/v1/api/movies";

const getAllMovies = async (): Promise<Movie[]> => {
    const response = await axios.get<Movie[]>(BASE_URL);
    return response.data;
};

const getMovieById = async (id: string): Promise<Movie> => {
    const response = await axios.get<Movie>(`${BASE_URL}/${id}`);
    return response.data;
};

const createMovie = async (movie: Movie): Promise<Movie> => {
    const response = await axios.post<Movie>(BASE_URL, movie, getAuthHeader());
    return response.data;
};

const updateMovie = async (id: string, movie: Movie): Promise<Movie> => {
    const response = await axios.put<Movie>(`${BASE_URL}/${id}`, movie, getAuthHeader());
    return response.data;
};

const deleteMovie = async (id: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`, getAuthHeader());
};

export default {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};