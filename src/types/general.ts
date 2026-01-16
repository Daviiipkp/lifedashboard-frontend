import type { StreakWidgetProps } from "../components/Streak";

export interface ServerResponse {
    message: string;
    status: number;
    ResponseType: string;
}

export interface UserData {

}

export interface DailyData {
    planning: string;
    dailyInsight: string;
    dailyLogged?: DailyLog;
}

export interface DailyLog {
    wakeUpTime?: number;
    sleepTime?: number;
    workedOut?: boolean;
    meals?: number;
    waterIntake?: number; // in ml's
    detox?: boolean;
    reading?: number;
    studying?: number;
    focusLevel?: number;
    working?: number;
}

export interface HabitsConfig {
    sleepGoal?: number;
    maxWakeUpTime?: number;
    waterIntakeGoal?: number;
    readingGoal?: number;
    studyingGoal?: number;
    mealsPerDayGoal?: number;
    weekTrainingDays?: number;
    detox?: boolean;
}

export interface PertinentData {
    goals: Goal[];
    calendar: CalendarData;
    config: HabitsConfig
}

export interface StreaksData {
    streaks: StreakWidgetProps[];
}

export interface CalendarData {
    month: number;
    year: number;
    daysWithData: number[];
}

export interface CustomHabit {
    name: string;
    repeatEvery: number; // in days
    doneToday: number;
    unit: string;
    hasStreak: boolean;
}

export interface Goal {
    name: string;
    target: string;
    progress: number;
    unit: string;
}



