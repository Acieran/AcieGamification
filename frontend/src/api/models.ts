import type {
    CalendarNames,
    QuestCategory,
    ScheduleEntry,
    ScheduleEntrySplitDate,
    Stats,
    UserQuestWithDetails
} from "../types.tsx";

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
    order: number;

    constructor(data?: ScheduleEntrySplitDate,
                day?: number,
                month?: number,
                year?: number,
                user?: string,
                shift_type?: 'Day' | 'Night' | 'Day Off' | '',
                order?: number,
                ) {
        if (data) {
            this.day = data.day;
            this.month = data.month;
            this.year = data.year;
            this.user = data.user;
            this.shift_type = data.shift_type;
            this.order = data.order
        } else if (
            day != undefined &&
            month != undefined &&
            year != undefined &&
            user != undefined &&
            shift_type != undefined &&
            order != undefined)
        {
            this.day = day;
            this.month = month;
            this.year = year;
            this.user = user;
            this.shift_type = shift_type;
            this.order = order;
        } else
            throw "Bad Request";
    };
}

export class CalendarUsersAPI implements CalendarNames{
    user: string;
    order: number;
    month: number;
    year: number;

    constructor(data?: CalendarNames, user?: string, order?: number, month?: number, year?: number) {
        if (data) {
            this.user = data.user;
            this.order = data.order;
            this.month = data.month;
            this.year = data.year;
        } else if (user != undefined && order != undefined && month != undefined && year != undefined) {
            this.user = user;
            this.order = order;
            this.month = month;
            this.year = year;
        } else
            throw "Bad Request";
    }


}
