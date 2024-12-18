import React, { useState, type ReactElement } from "react";
import "./css/cal.scss";
import { type Schedule, SelectionType, type PeriodNum, Months } from "./types.ts";
import { doesPdMeet, getScheduleStartEnd } from "./utils.ts";

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

    let { start, end } = getScheduleStartEnd(schedule);
    let curDate = start;
    curDate.setDate(0);
    curDate.setMonth(curDate.getMonth() - 1);
    while (curDate.getMonth() + (curDate.getFullYear() * 12) < (end.getMonth()) + (end.getFullYear() * 12)) {
        curDate.setMonth(curDate.getMonth() + 1);
        months.push(<Month
            key={`${curDate.getMonth() + 1}/${curDate.getFullYear()}`}
            year={curDate.getFullYear()}
            monthIndex={curDate.getMonth()}
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