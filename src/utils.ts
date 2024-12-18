import { Schedule, PeriodNum, SelectionType } from "./types";

const GRADES_TO_PCT = {
    93: "A",
    90: "A-",
    87: "B+",
    83: "B",
    80: "B-",
    77: "C+",
    73: "C",
    70: "C-",
    67: "D+",
    63: "D",
    60: "D-",
    0: "F"
};

export function pctToGrade(pct: number): string {
    let highest: [string, string] | false = false;
    for (let i of Object.entries(GRADES_TO_PCT)) {
        if (!highest || pct > parseInt(i[0]) && parseInt(i[0]) > parseInt(highest[0])) {
            highest = i;
        }
    }
    return highest[1];
}

export function doesPdMeet(schedule: Schedule, period: PeriodNum, date: Date) {
    let dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return (dateString in schedule) && !(schedule[dateString].includes(period));
}

export function getScheduleStartEnd(schedule: Schedule): { start: Date, end: Date } {
    let start: Date | null = null;
    let end: Date | null = null;

    for (let i of Object.keys(schedule)) {
        let [month, day, year] = i.split("/");
        let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (start == null || start > date) start = date;
        if (end == null || end < date) end = date;
    }

    return { start: start as Date, end: end as Date };
}

export function genBlankSelected(schedule: Schedule, period: PeriodNum): Record<string, SelectionType> {
    let { start, end } = getScheduleStartEnd(schedule);
    let curDate = start;
    let selected: Record<string, SelectionType> = {};

    while (curDate <= end) {
        if (doesPdMeet(schedule, period, curDate)) {
            selected[curDate.toDateString()] = SelectionType.Attending;
        }
        curDate.setDate(curDate.getDate() + 1);
    }

    return selected;
}