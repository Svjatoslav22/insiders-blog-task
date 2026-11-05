"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiRequest } from "../lib/api";
import type { AuthResponse, User } from "../types";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            setIsLoading(false);
            return;
        }

        setToken(storedToken);

        apiRequest<{ user: User }>("/auth/me", { token: storedToken })
            .then((res) => {
                setUser(res.user);
            })
            .catch(() => {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const handleAuthSuccess = (res: AuthResponse): void => {
        localStorage.setItem("token", res.token);
        setToken(res.token);
        setUser(res.user);
    };

    const login = async (email: string, password: string): Promise<void> => {
        const res = await apiRequest<AuthResponse>("/auth/login", {
            method: "POST",
            body: { email, password },
        });
        handleAuthSuccess(res);
    };

    const register = async (email: string, password: string, name?: string): Promise<void> => {
        const res = await apiRequest<AuthResponse>("/auth/register", {
            method: "POST",
            body: { email, password, name: name?.trim() ? name.trim() : undefined },
        });
        handleAuthSuccess(res);
    };

    const logout = (): void => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}