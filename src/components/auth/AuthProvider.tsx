import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AUTH_TOKEN_KEY } from "../../service/AuthService";

export interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// JWT payloads are base64url (uses - and _), which atob() cannot decode directly.
const decodePayload = (token: string): any | null => {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
        return JSON.parse(atob(padded));
    } catch {
        return null;
    }
};

const getRoleFromToken = (token: string | null): string | null => {
    if (!token) return null;
    const payload = decodePayload(token);
    return payload?.roles || null;
};

const isTokenExpired = (token: string): boolean => {
    const payload = decodePayload(token);
    if (!payload || typeof payload.exp !== "number") return true;
    return payload.exp * 1000 <= Date.now();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            if (isTokenExpired(token)) {
                localStorage.removeItem(AUTH_TOKEN_KEY);
                return;
            }
            setIsAuthenticated(true);
            setUserRole(getRoleFromToken(token));
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        setIsAuthenticated(true);
        setUserRole(getRoleFromToken(token));
    };

    const logout = () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Should use useAuth within the AuthProvider");
    }
    return context;
};