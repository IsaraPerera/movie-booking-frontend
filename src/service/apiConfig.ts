import { AUTH_TOKEN_KEY } from "./AuthService";

export const getAuthHeader = () => {

    const token =
        localStorage.getItem(AUTH_TOKEN_KEY);

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};