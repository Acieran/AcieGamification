// ============ Core Types ============
export type QuestCategory = 'nutrition' | 'movement' | 'sleep' | 'water' | 'intellectual';
export type ResourceType = 'health' | 'resource' | 'gold' | 'xp';
export type StatType = 'energy' | 'strength' | 'focus' | 'level' | 'agility' | 'intelligence'; // Changed 'strength' to 'power'
export type Page = 'dashboard' | 'calendar';

// ============ User & Stats Types ============
export interface Stats {
    energy: number;
    strength: number;
    agility: number;
    intelligence: number;
    level: number;
    focus: number;
    health: number;
    resource: number;
    gold: number;
    xp: number;
}

export interface ScheduleEntry {
    date: Date;
    shifts: {
        [employeeName: string]: 'Day' | 'Night' | 'Day Off' | '';
    };
}

export interface ScheduleEntrySplitDate {
    day: number;
    month: number;
    year: number;
    user: string;
    shift_type: 'Day' | 'Night' | 'Day Off' | '';
    order: number;
}

export interface CalendarNames {
    year: number;
    month: number;
    user: string;
    order: number;
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
export interface QuestBase {
    type: QuestCategory;
    occurrence_type: 'daily' | 'monthly' | 'oneTime';
    title: string;
    description: string;

}

export interface Quest extends QuestBase {
    stats_id: number;
}

export interface QuestUpdate extends Quest {
    id: number;
}

export interface UserQuest {
    username: string;
    quest_id: number;
    due_date: string;  // ISO date string
    completed: boolean;
}

export interface UserQuestWithDetails extends UserQuest, Quest {
    reward: Stats;
}

export interface UserQuestStatsAPI extends QuestBase {
    due_date: Date;
    completed: boolean;
    reward: Stats;
}

// ============ API Request/Response Types ============
export type ApiResponseBase = {
    success: boolean;
    message?: string;
};

export type ApiResponseGet = ApiResponseBase & {
    data: UserStats | null;
}

export type ApiResponse = {
    config?: ApiResponseGet;
    headers?: unknown;
    request?: unknown;
    status: number;
    statusText?: string;
}

export type ApiResponseNew = {
    data: string;
}

export type ApiResponseCalendar = ApiResponse & {
    data: ScheduleEntry[];
}

export type CalendarNamesAPI = ApiResponse & {
    data: CalendarNames[];
}

// GET /{username}
export type GetUserStatsResponse = ApiResponseGet & ErrorResponse;

// POST /{username}
export type CreateUserRequest = Stats;

// POST /{username}/quests
export type CreateUserQuestRequest = Omit<UserQuest, 'username' | 'quest_id'> &
    Pick<QuestBase, 'type'> &
    Stats;


export type CreateUserQuestResponse = number; // Returns quest_id

// PUT /{username}/quests/{quest_id}
export type UpdateUserQuestRequest = CreateUserQuestRequest;
export type UpdateUserQuestResponse = number; // Returns quest_id

export interface EmployeeOrdered {
    order: number;
    name: string;
}
