import type {ApiResponse, ApiResponseCalendar, CalendarNamesAPI, ScheduleEntry,} from "../types.tsx";
import {CalendarUsersAPI, ScheduleEntryClass, ScheduleEntrySplitDateClass} from "./models.ts";
import apiClient from "./client.ts";

export const getCalendar = async (
    year: number = new Date().getFullYear(),
    month: number = new Date().getMonth() + 1,
): Promise<ScheduleEntryClass[]> => {
    const response: ApiResponseCalendar = await apiClient.get(`/calendar`, {
        params: {
            year: year,
            month: month
        }
    });
    const result: ScheduleEntry[] = [];
    if (response.data) {
        const parsedResponse = response.data;
        for (const item of parsedResponse) {
            result.push(new ScheduleEntryClass(item));
        }
    }
    return result;
}

export const getCalendarNames = async (
    year: number = new Date().getFullYear(),
    month: number = new Date().getMonth() + 1,
): Promise<string[]> => {
    const response: CalendarNamesAPI = await apiClient.get(`/calendar/names`, {
        params: {
            year: year,
            month: month,
            order_by: true
        }
    })
    const result: string[] = []
    if (response.data) {
        const parsedResponse = response.data;
        for (const item of parsedResponse) {
            result.push(item.user)
        }
    }
    return result
}

export const setCalendar = async (
    data: ScheduleEntrySplitDateClass
): Promise<boolean> => {
    const response: ApiResponse = await apiClient.post(`/calendar`, data)
    return response && response.status === 200;
}

export const setCalendarNames = async (
    data?: CalendarUsersAPI[] | CalendarUsersAPI,
    year?: number,
    month?: number,
    user?: string,
    order?: number,
): Promise<boolean> => {
    if (data == undefined && year != undefined && month != undefined && user != undefined && order != undefined)
    {
        data = new CalendarUsersAPI(undefined, user, order, month, year)
    }
    const response: ApiResponse = await apiClient.post(`/calendar/names`, data)
    return response && response.status === 200;
}

export const deleteCalendarName = async (
    year: number = new Date().getFullYear(),
    month: number = new Date().getMonth() + 1,
    user: string,
): Promise<boolean> => {
    const response: ApiResponse = await apiClient.delete(`/calendar/names`, {
        params: {
            year: year,
            month: month,
            user: user
        }
    })
    return response && response.status === 201;
}
