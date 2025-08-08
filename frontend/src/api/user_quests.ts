import apiClient from './client';
import type {ApiResponse, GetUserQuestsResponse, UserQuestWithDetails} from '../types';

export const getUserQuests = async (username: string = 'Acieran'): Promise<GetUserQuestsResponse> => {
    const response = await apiClient.get(`/${username}/quests`);
    return response.data;
};

// POST (Create) new user
export const createUserQuest = async (username: string, data: UserQuestWithDetails): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post(`/${username}/quests`, data);
        return {success: true, data: response.data};
    } catch {
        return {success: false, message: 'Failed to create user quest'};
    }
};

// PUT (Update) user
export const updateUserQuest = async (username: string, quest_id: number, data: UserQuestWithDetails): Promise<ApiResponse> => {
    try {
        await apiClient.put(`/${username}/quests/${quest_id}`, data);
        return {success: true};
    } catch {
        return {success: false, message: 'Failed to update user quest'};
    }
};

// DELETE user
export const deleteUserQuest = async (username: string, quest_id: number): Promise<ApiResponse> => {
    try {
        await apiClient.delete(`/${username}/quests/${quest_id}`);
        return {success: true};
    } catch {
        return {success: false, message: 'Failed to delete user'};
    }
};