import axios from "axios";
import { User } from "../models/User";
import { SignIn } from "../models/SignIn";

const BASE_URL = "http://localhost:8080/api/v1/auth";

export const AUTH_TOKEN_KEY = "movieBookingToken";

const signUp = async (user: User): Promise<string> => {
    const response = await axios.post(`${BASE_URL}/signup`, user);

    const token = response.data.token;

    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    return token;
};

const signIn = async (credentials: SignIn): Promise<string> => {
    const response = await axios.post(`${BASE_URL}/signin`, credentials);

    const token = response.data.token;

    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    return token;
};

export default {
    signUp,
    signIn
};