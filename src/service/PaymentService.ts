import axios from "axios";
import { Payment } from "../models/Payment";
import { getAuthHeader } from "./apiConfig";

const BASE_URL = "http://localhost:8080/api/v1/api/payments";

const processPayment = async (payment: Payment): Promise<Payment> => {
    const response = await axios.post(BASE_URL, payment, getAuthHeader());
    return response.data;
};

const getPaymentByBookingId = async (bookingId: string): Promise<Payment> => {
    const response = await axios.get(`${BASE_URL}/${bookingId}`, getAuthHeader());
    return response.data;
};

export default { processPayment, getPaymentByBookingId };