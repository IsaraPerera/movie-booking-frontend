import axios from "axios";
import { Booking } from "../models/Booking";
import { getAuthHeader } from "./apiConfig";

const BASE_URL = "http://localhost:8080/api/v1/api/bookings";

const createBooking = async (booking: Booking): Promise<Booking> => {
    const response = await axios.post(BASE_URL, booking, getAuthHeader());
    return response.data;
};

const getMyBookings = async (): Promise<Booking[]> => {
    const response = await axios.get(`${BASE_URL}/my-bookings`, getAuthHeader());
    return response.data;
};

const cancelBooking = async (bookingId: string): Promise<Booking> => {
    const response = await axios.put(`${BASE_URL}/${bookingId}/cancel`, {}, getAuthHeader());
    return response.data;
};

export default { createBooking, getMyBookings, cancelBooking };