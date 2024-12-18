export type PeriodNum = "EB" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export enum SelectionType {
    Attending = 0,
    NoHR = 1,
    NotAttending = 2
}

export enum Months {
    January = 0,
    February = 1,
    March = 2,
    April = 3,
    May = 4,
    June = 5,
    July = 6,
    August = 7,
    September = 8,
    October = 9,
    November = 10,
    December = 11
}

export type Schedule = Record<string, PeriodNum[]>