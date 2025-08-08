// ============ Core Types ============
export type QuestCategory = 'nutrition' | 'movement' | 'sleep' | 'water';
export type ResourceType = 'health' | 'resource' | 'gold' | 'xp';
export type StatType = 'energy' | 'strength' | 'focus' | 'level'; // Changed 'strength' to 'power'

// ============ User & Stats Types ============
export interface Stats {
    energy: number;
    strength: number;    // Renamed from 'strength'
    level: number;
    focus: number;
    health: number;
    resource: number;
    gold: number;
    xp: number;
}

export interface ErrorResponse {
    status_code?: number;
    detail?: string;
    headers?: unknown;
}

export interface BaseUser {
    username: string;
}

export interface User extends BaseUser {
    stats_id: number;
}

export interface UserStats extends BaseUser, Stats {
}

// ============ Quest Types ============
export interface BaseQuest {
    type: QuestCategory;
    stats_id: number;
}

export interface Quest extends BaseQuest {
    id: number;
}

export interface UserQuest {
    username: string;
    quest_id: number;
    due_date: string;  // ISO date string
    completed: boolean;
}

export interface UserQuestWithDetails extends UserQuest, Quest, Stats {
}

// ============ API Request/Response Types ============
export type ApiResponse = {
    success: boolean;
    data?: unknown;
    message?: string;
};

// GET /{username}
export type GetUserStatsResponse = UserStats & ApiResponse & ErrorResponse;

// POST /{username}
export type CreateUserRequest = Stats;


// GET /{username}/quests
export type GetUserQuestsResponse = UserQuestWithDetails[];

// POST /{username}/quests
export type CreateUserQuestRequest = Omit<UserQuest, 'username' | 'quest_id'> &
    Pick<BaseQuest, 'type'> &
    Stats;


export type CreateUserQuestResponse = number; // Returns quest_id

// PUT /{username}/quests/{quest_id}
export type UpdateUserQuestRequest = CreateUserQuestRequest;
export type UpdateUserQuestResponse = number; // Returns quest_id