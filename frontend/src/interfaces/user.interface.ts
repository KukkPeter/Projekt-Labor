export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    tokenExpiration: number;
}