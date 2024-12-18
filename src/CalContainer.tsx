import React, { useState, type ReactElement } from "react";
import "./css/cal.scss";
import { type Schedule, SelectionType, type PeriodNum } from "./types.ts";

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
};

function doesPdMeet(schedule: Schedule, period: PeriodNum, date: Date) {
    let dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return (dateString in schedule) && !(schedule[dateString].includes(period));
}

function Day({ date: dateStr, inMonth, schedule, period, type = SelectionType.Attending, onUpdate }: { date: string, inMonth: boolean, schedule: Schedule, period: PeriodNum, type: SelectionType, onUpdate: (date: string, selType: SelectionType) => void }) {
    let date = new Date(dateStr);
    let [selType, setSelType] = useState(type);
    let style: React.CSSProperties = {};
    if (!inMonth) {
        // style.display = "none";
        style.opacity = 0;
    } else if (!doesPdMeet(schedule, period, date)) {
        style.backgroundColor = "lightgray";
        style.pointerEvents = "none";
    } else {
        style.cursor = "pointer";
        style.userSelect = "none";
        style.backgroundColor = (type == SelectionType.Attending) ? "lightblue" : ((type == SelectionType.NoHR ? "orange" : "beige"));
    }
    return (<td style={style} onClick={(e) => {
        e.preventDefault();
        switch (selType) {
            case SelectionType.Attending: {
                selType = SelectionType.NoHR;
                break;
            }
            case SelectionType.NoHR: {
                selType = SelectionType.NotAttending;
                break;
            }
            case SelectionType.NotAttending: {
                selType = SelectionType.Attending;
                break;
            }
        }
        setSelType(selType);
        style.backgroundColor = (selType == SelectionType.Attending) ? "lightblue" : ((selType == SelectionType.NoHR ? "orange" : "beige"));
        onUpdate(date.toDateString(), selType);
    }}>{date.getDate()}</td>);
}

function Week({ days }: { days: ReactElement[] }) {
    return <tr>{...days}</tr>;
}

function WeekHeader() {
    return (<tr>
        <th>Su</th>
        <th>M</th>
        <th>Tu</th>
        <th>W</th>
        <th>Th</th>
        <th>F</th>
        <th>Sa</th>
    </tr>);
}

function Month({ year, monthIndex, schedule, period, onUpdate, selected }: { year: number, monthIndex: number, schedule: Schedule, period: PeriodNum, onUpdate: (date: string, selType: SelectionType) => void, selected: Record<string, SelectionType> }) {
    let runningDate = new Date(year, monthIndex);
    let weeks: ReactElement[][] = [];

    let firstWeek: ReactElement[] = [];
    console.log(runningDate.getDay());
    for (let i = 0; i < runningDate.getDay(); ++i) firstWeek.push(<Day key={i} date={runningDate.toISOString()} inMonth={false} schedule={schedule} period={period} onUpdate={onUpdate} type={selected[runningDate.toDateString()]} />);

    let currentWeek: ReactElement[] = firstWeek;
    while (runningDate.getMonth() == monthIndex) {
        if (runningDate.getDay() == 0) {
            if (currentWeek.length > 0) weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(<Day date={runningDate.toISOString()} inMonth={true} schedule={schedule} period={period} onUpdate={onUpdate} type={selected[runningDate.toDateString()]} />);
        runningDate.setDate(runningDate.getDate() + 1);
    }
    if (currentWeek.length > 0) {
        while (runningDate.getDay() > 0) {
            currentWeek.push(<Day key={runningDate.getDate()} date={runningDate.toISOString()} inMonth={false} schedule={schedule} period={period} onUpdate={onUpdate} type={selected[runningDate.toDateString()]} />);
            runningDate.setDate(runningDate.getDate() + 1);
        }
        weeks.push(currentWeek);
    }

    let allWeeks: React.JSX.Element[] = [];
    for (let i in weeks) allWeeks.push(<Week key={i} days={weeks[i]} />);

    return (<div className="calendar">
        <h3 className="month-name">{Months[monthIndex]}</h3>
        <table>
            <tbody>
                <WeekHeader />
                {...allWeeks}
            </tbody>
        </table>
    </div>);
}

export function CalContainer({ schedule, onUpdate, selected, period }: { schedule: Schedule, period: PeriodNum, onUpdate: (date: string, selType: SelectionType) => void, selected: Record<string, SelectionType> }) {
    let months: React.JSX.Element[] = [];

    let startDate: Date | null = null;
    let endDate: Date | null = null;
    for (let i of Object.keys(schedule)) {
        let [month, day, year] = i.split("/");
        let date = new Date(parseInt(year), parseInt(month), parseInt(day));
        if (startDate == null || startDate > date) startDate = date;
        if (endDate == null || endDate < date) endDate = date;
    }

    let curDate = startDate;
    (curDate as Date).setDate(0);
    (curDate as Date).setMonth((curDate as Date).getMonth() - 2);
    while ((curDate as Date).getMonth() + ((curDate as Date).getFullYear() * 12) < ((endDate as Date).getMonth()) + ((endDate as Date).getFullYear() * 12)) {
        (curDate as Date).setMonth((curDate as Date).getMonth() + 1);
        months.push(<Month
            key={`${(curDate as Date).getMonth() + 1}/${(curDate as Date).getFullYear()}`}
            year={(curDate as Date).getFullYear()}
            monthIndex={(curDate as Date).getMonth()}
            schedule={schedule}
            period={period}
            selected={selected}
            onUpdate={onUpdate}
        />);
    }

    return (<div className="cal-container">
        {...months}
    </div>);
}