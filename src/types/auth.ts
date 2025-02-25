export interface User {
    email: string;
    fullName: string;
    roles: string[];
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    fullName: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: "Bearer";
    email: string;
    fullName: string;
    roles: string[] | string;
}