import axios from "axios";
import { Show } from "../models/Show";
import { getAuthHeader } from "./apiConfig";

const BASE_URL = "http://localhost:8080/api/v1/api/shows";

const getAllShows = async (): Promise<Show[]> => {
    const response = await axios.get<Show[]>(BASE_URL);
    return response.data;
};

const getShowById = async (id: string): Promise<Show> => {
    const response = await axios.get<Show>(`${BASE_URL}/${id}`);
    return response.data;
};

const getShowsByMovieId = async (movieId: string): Promise<Show[]> => {
    const response = await axios.get<Show[]>(`${BASE_URL}/movie/${movieId}`);
    return response.data;
};

const createShow = async (show: Show): Promise<Show> => {
    const payload = {
        movieId: show.movieId,
        theatreId: show.theatreId,
        showDate: show.showDate,
        showTime: show.showTime,
        ticketPrice: Number(show.ticketPrice),
        status: show.status
    };

    const response = await axios.post<Show>(BASE_URL, payload, getAuthHeader());
    return response.data;
};

export default {
    getAllShows,
    getShowById,
    getShowsByMovieId,
    createShow
};