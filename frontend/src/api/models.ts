import type {QuestCategory, ScheduleEntry, ScheduleEntrySplitDate, Stats, UserQuestWithDetails} from "../types.tsx";

export class QuestClass {
    id: number;
    username: string;
    due_date: Date;  // Converted to Date object
    completed: boolean;
    title: string;
    description: string;
    type: QuestCategory;
    occurrence_type: 'daily' | 'monthly' | 'oneTime';
    reward: Stats;

    constructor(data: UserQuestWithDetails) {
        this.id = data.quest_id
        this.username = data.username;
        this.due_date = new Date(data.due_date); // Parse to Date
        this.completed = data.completed;
        this.title = data.title;
        this.description = data.description;
        this.type = data.type;
        this.reward = data.reward;
        this.occurrence_type = data.occurrence_type;
    }
}

export class ScheduleEntryClass implements ScheduleEntry {
    date: Date;
    shifts: { [p: string]: "Day" | "Night" | "Day Off" | "" };

    constructor(data: ScheduleEntry) {
        this.date = new Date(data.date);
        this.shifts = data.shifts;
    }
}

export class ScheduleEntrySplitDateClass {
    day: number;
    month: number;
    year: number;
    user: string;
    shift_type: 'Day' | 'Night' | 'Day Off' | '';

    constructor(data?: ScheduleEntrySplitDate,
                day?: number,
                month?: number,
                year?: number,
                user?: string,
                shift_type?: 'Day' | 'Night' | 'Day Off' | '') {
        if (data) {
            this.day = data.day;
            this.month = data.month;
            this.year = data.year;
            this.user = data.user;
            this.shift_type = data.shift_type;
        } else if (day && month && year && user && shift_type) {
            this.day = day;
            this.month = month;
            this.year = year;
            this.user = user;
            this.shift_type = shift_type;
        } else
            throw "Bad Request";
    };
}

export class CalendarNames {
    user: string;

    constructor(data: CalendarNames) {
        this.user = data.user;
    }
}
