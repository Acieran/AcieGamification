import apiClient from './client';
import {QuestClass} from '../api/models'
import type {ApiResponseBase, ApiResponseNew, UserQuestStatsAPI, UserQuestWithDetails} from '../types';

export const getUserQuests = async (username: string = 'Acieran', include_completed: boolean = false): Promise<QuestClass[]> => {
    const response: ApiResponseNew = await apiClient.get(`/${username}/quests`, {
        params: {
            include_completed: include_completed
        }
    });
    const result: QuestClass[] = [];
    if (response.data) {
        const parsedResponse = JSON.parse(response.data);
        for (const item of parsedResponse) {
            result.push(new QuestClass(item));
        }
    }
    return result;
};

// POST (Create) new user
export const createUserQuest = async (username: string, data: UserQuestStatsAPI): Promise<ApiResponseBase> => {
    try {
        await apiClient.post(`/${username}/quests`, data);
        return {success: true};
    } catch {
        return {success: false, message: 'Failed to create user quest'};
    }
};

// PUT (Update) user
export const updateUserQuest = async (
    username: string,
    quest_id: number,
    data: UserQuestWithDetails | null,
    complete: boolean = false
): Promise<ApiResponseBase> => {
    try {
        await apiClient.put(`/${username}/quests/${quest_id}`, data, {
            params: {
                complete: complete
            }
        });
        return {success: true};
    } catch {
        return {success: false, message: 'Failed to update user quest'};
    }
};

// DELETE user
export const deleteUserQuest = async (username: string, quest_id: number): Promise<ApiResponseBase> => {
    try {
        await apiClient.delete(`/${username}/quests/${quest_id}`);
        return {success: true};
    } catch {
        return {success: false, message: 'Failed to delete user'};
    }
};