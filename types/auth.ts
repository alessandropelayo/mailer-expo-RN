export type Role = "USER" | "ADMIN" | "MODERATOR";

export type AccessLevel = "NO_ACCESS" | "BASIC" | "ADVANCED" | "FULL_ACCESS";

export interface User {
    id?: string,
    email?: string,
    password?: string,
    role?: Role,
    accessLevel?: AccessLevel,
    refreshToken?: string | null,
    createdAt?: Date,
    updatedAt?: Date,
}


export interface AuthResponse {
    user?: User;
    accessToken: string;
}