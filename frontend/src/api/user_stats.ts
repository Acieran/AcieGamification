import apiClient from './client';
import type {ApiResponse, Stats, UserStats} from '../types';

export const getUserWithStats = async (username: string = 'Acieran'): Promise<UserStats[]> => {
    const response = await apiClient.get(`/${username}`);
    return response.data;
};

// POST (Create) new user
export const createUserWithStats = async (username: string, stats: Stats): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post(`/${username}`, stats);
        return {success: true, message: response.data};
    } catch {
        return {success: false, message: 'Failed to create user'};
    }
};

// PUT (Update) user
export const updateUserStats = async (username: string, stats: Stats): Promise<ApiResponse> => {
    try {
        await apiClient.put(`/${username}`, stats);
        return {success: true};
    } catch {
        return {success: false, message: 'Failed to update user'};
    }
};

// DELETE user
// export const deleteUser = async (id: number): Promise<ApiResponse> => {
//     try {
//         await apiClient.delete(`/users/${id}`);
//         return { success: true };
//     } catch {
//         return { success: false, message: 'Failed to delete user' };
//     }
// };