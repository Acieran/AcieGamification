import React, {useEffect, useState} from 'react';
import '../Styles/WorkScheduleCalendar.css';
import {AxiosError} from "axios";
import type {ScheduleEntry} from "../types.tsx";
import {deleteCalendarName, getCalendar, getCalendarNames, setCalendar, setCalendarNames} from "../api/calendar.ts";
import {CalendarUsersAPI, ScheduleEntrySplitDateClass} from "../api/models.ts";

const Calendar: React.FC = () => {
    const [employees, setEmployees] = useState(['Me', 'Him']);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [currentYear, setCurrentYear] = useState<number>((new Date()).getFullYear());

    const [schedule, setSchedule] = useState<ScheduleEntry[]>(generateSampleData(employees));
    const [hoveredEmployee, setHoveredEmployee] = useState<string | null>(null);
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AxiosError | null>(null);
    const [IsCreate, setIsCreate] = useState<boolean>(false);
    const [createUser_User, setCreateUser_User] = useState<string>('');

    const fetchData = async () => {
        setLoading(true);
        setError(null); // Reset previous errors

        try {
            setSchedule(await getCalendar()); // Update state with fetched data
            setEmployees(await getCalendarNames());
        } catch (err) {
            setError(err as AxiosError); // Handle errors
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to handle changing shifts
    const handleShiftChange = async (
        date: Date, employee: string, shift: 'Day' | 'Night' | 'Day Off' | '', order: number) => {
        const response = setCalendar(
            new ScheduleEntrySplitDateClass(
                undefined, date.getDate(), date.getMonth() + 1, date.getFullYear(), employee, shift, order))
        if (await response) {
            let found = false
            const updatedSchedule = schedule.map(entry => {
                if (entry.date.toDateString() === date.toDateString()) {
                    found = true;
                    return {
                        ...entry,
                        shifts: {
                            ...entry.shifts,
                            [employee]: shift
                        }
                    };
                }
                return entry;
            });
            if (!found) {
                updatedSchedule.push({
                    date: date,
                    shifts: {
                        [employee]: shift
                    }
                });
            }
            setSchedule(updatedSchedule);
        } else
            setError(new AxiosError("Error updating calendar"));
    };

    const handleCreateUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCreateUser_User(event.target.value);
    };

    const sendNewUser = async () => {
        const response = setCalendarNames(
            undefined, currentYear, currentMonth.getMonth()+1, createUser_User, employees.length
        )
        if (await response) {
            employees.push(createUser_User)
            setEmployees(employees);
            setCreateUser_User('')
            setIsCreate(false)
        } else
            setError(new AxiosError("Error creating new calendar user"));
    }



    const updateUser = async (
        data?: CalendarUsersAPI[] | CalendarUsersAPI, user?: string, order?: number) => {
        let response;
        if (data)
        {
            response = setCalendarNames(data)
        }
        else {
            response = setCalendarNames(
                undefined, currentYear, currentMonth.getMonth()+1, user, order
            )
        }
        if (await response) {
            return true;
        }
        else {
            setError(new AxiosError("Error updating user"));
            return false;
        }
    }

    const deleteUser = async (user: string, is_remove_index: boolean = true) => {
        const response = deleteCalendarName(currentYear, currentMonth.getMonth()+1, user);
        if (await response) {
            if (is_remove_index) {
                const indexToRemove: number = employees.indexOf(user);

                if (indexToRemove !== -1) { // Check if the element exists
                    employees.splice(indexToRemove, 1); // Removes 1 element at the found index
                }
                setEmployees(employees);
            }
            return true;
        } else {
            setError(new AxiosError("Error deleting calendar user"));
            return false;
        }
    }

    // Navigation functions
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        if (currentMonth.getMonth() == 0)
            setCurrentYear(currentYear - 1);
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        if (currentMonth.getMonth() == 11)
            setCurrentYear(currentYear + 1);
    };

    // Get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysCount = getDaysInMonth(year, month);
        const days: Date[] = [];

        for (let i = 1; i <= daysCount; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.currentTarget.classList.remove('dragging');
    };

    const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDragLeave = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.currentTarget.classList.remove('drop-target');
    };

    const handleDrop = async (e: React.DragEvent<HTMLTableRowElement>, targetIndex: number) => {
        let fromIndex = Number(e.dataTransfer.getData('text/plain'));
        const updatedRecords = [...employees];
        const [movedItem] = updatedRecords.splice(fromIndex, 1);
        updatedRecords.splice(targetIndex, 0, movedItem);

        if (fromIndex > targetIndex)
        {
            [fromIndex, targetIndex] = [targetIndex, fromIndex];
        }

        const items_to_update = updatedRecords.slice(fromIndex, targetIndex+1);
        const items_to_send: CalendarUsersAPI[] = []

        for (let i = 0; i < items_to_update.length; i++)
        {
            items_to_send.push(new CalendarUsersAPI(undefined, items_to_update[i], i+fromIndex, currentMonth.getMonth()+1, currentYear))
        }
        const response = updateUser(items_to_send);
        if (await response)
            setEmployees(updatedRecords);
        else
            setError(new AxiosError("Error updating calendar user"));
    };

    return (
        <div className="work-schedule-calendar panel">
            <div className="calendar-header">
                <button onClick={goToPreviousMonth} className="nav-button">&lt;</button>
                <h2 className="panel-title">
                    <span className="calendar-icon">📅</span>
                    {currentMonth.toLocaleString('default', {month: 'long', year: 'numeric'})}
                </h2>
                <button onClick={goToNextMonth} className="nav-button">&gt;</button>
            </div>

            <div className="calendar-container">
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {schedule &&
                    <table className="schedule-table transposed">
                        <thead>
                        <tr>
                            <th className="employee-header">Employee</th>
                            {calendarDays.map(day => {
                                // Skip weekends if you want only work days
                                // if (day.getDay() === 0 || day.getDay() === 6) return null;

                                return (
                                    <th
                                        key={day.toISOString()}
                                        className={`date-header ${hoveredDate && day.toDateString() === hoveredDate.toDateString() ? 'highlighted-column' : ''}`}
                                        onMouseEnter={() => setHoveredDate(day)}
                                        onMouseLeave={() => setHoveredDate(null)}
                                    >
                                        {day.getDate()}
                                        <div className="day-of-week">
                                            {day.toLocaleDateString('en-US', {weekday: 'short'})}
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map((employee,index) => (
                            <tr
                                key={employee}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                className={hoveredEmployee === employee ? 'highlighted-row' : ''}
                                onMouseEnter={() => setHoveredEmployee(employee)}
                                onMouseLeave={() => setHoveredEmployee(null)}
                            >
                                <td className={`employee-name ${hoveredEmployee === employee ? 'highlighted-row' : ''}`}>
                                    {employee}
                                    <button onClick={() => deleteUser(employee)} className="user-button delete-button">
                                        -
                                    </button>
                                </td>
                                {calendarDays.map(day => {
                                    // Skip weekends if you want only work days
                                    // if (day.getDay() === 0 || day.getDay() === 6) return null;

                                    const daySchedule = schedule.find(
                                        s => s.date.toDateString() === day.toDateString()
                                    );
                                    const shift = daySchedule?.shifts[employee] || '';

                                    return (
                                        <td
                                            key={`${employee}-${day.toISOString()}`}
                                            className={`shift-cell ${hoveredDate && day.toDateString() === hoveredDate.toDateString() ? 'highlighted-column' : ''}`}
                                            onMouseEnter={() => {
                                                setHoveredEmployee(employee);
                                                setHoveredDate(day);
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredEmployee(null);
                                                setHoveredDate(null);
                                            }}
                                        >
                                            <select
                                                value={shift}
                                                onChange={(e) => handleShiftChange(
                                                    day,
                                                    employee,
                                                    e.target.value as 'Day' | 'Night' | 'Day Off' | '',
                                                    index
                                                )}
                                                className={`shift-select ${shift.toLowerCase()}`}
                                            >
                                                <option value="">-</option>
                                                <option value="Day">Day</option>
                                                <option value="Night">Night</option>
                                                <option value="DayOff">Day Off</option>
                                            </select>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        <tr className="user-management">
                            {IsCreate ? (
                                <td>
                                    <input type="text" onChange={handleCreateUserChange} className="user-input"/>
                                    <button onClick={sendNewUser} className="nav-button">Отправить</button>
                                </td>
                            ) : (
                                <button onClick={() => setIsCreate(true)} className="user-button add-button">
                                    +
                                </button>
                            )}
                        </tr>
                        </tbody>
                    </table>
                }
            </div>
        </div>
    );
};

// Helper function to generate sample data
function generateSampleData(employees: string[]): ScheduleEntry[] {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const schedule: ScheduleEntry[] = [];

    // Shifts for sample data
    const shiftOptions: ('Day' | 'Night' | 'Day Off')[] = ['Day', 'Night', 'Day Off'];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);

        // Skip weekends in sample data
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const shifts: { [key: string]: 'Day' | 'Night' | 'Day Off' | '' } = {};

        employees.forEach(employee => {
            // Randomly assign shifts for sample data
            const randomShift = shiftOptions[Math.floor(Math.random() * shiftOptions.length)];
            shifts[employee] = randomShift;
        });

        schedule.push({date, shifts});
    }

    return schedule;
}

// function get_employees_schedule(employees: string[]):ScheduleEntry[] {
//     const year = new Date().getFullYear();
//     const month = new Date().getMonth();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const schedule: ScheduleEntry[] = [];
//
//     // Shifts for sample data
//     const shiftOptions: ('Day' | 'Night' | 'DayOff')[] = ['Day', 'Night', 'DayOff'];
//
//     for (let day = 1; day <= daysInMonth; day++) {
//         const date = new Date(year, month, day);
//
//         // Skip weekends in sample data
//         if (date.getDay() === 0 || date.getDay() === 6) continue;
//
//         const shifts: { [key: string]: 'Day' | 'Night' | 'DayOff' | '' } = {};
//
//         employees.forEach(employee => {
//             // Randomly assign shifts for sample data
//             const randomShift = shiftOptions[Math.floor(Math.random() * shiftOptions.length)];
//             shifts[employee] = randomShift;
//         });
//
//         schedule.push({date, shifts});
//     }
// }

export default Calendar;
