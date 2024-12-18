import React, { type ReactElement } from "react";
import "./css/cal.scss";

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

function Day({ year, monthIndex, day, inMonth }: { year: number, monthIndex: number, day: number, inMonth: boolean }) {
    let style: React.CSSProperties = {};
    if (!inMonth) {
        style.backgroundColor = "lightgray";
        style.pointerEvents = "none";
    } else {
        style.cursor = "pointer";
        style.userSelect = "none";
    }
    return <td style={style} onClick={(e) => {
        e.preventDefault();
        console.log(year, monthIndex, day);
    }}>{day}</td>;
}

function Week({ days }: { days: ReactElement[] }) {
    return <tr>{...days}</tr>;
}

function WeekHeader() {
    return <tr>
        <th>Su</th>
        <th>M</th>
        <th>Tu</th>
        <th>W</th>
        <th>Th</th>
        <th>F</th>
        <th>Sa</th>
    </tr>;
}

function Month({ year, monthIndex }: { year: number, monthIndex: number }) {
    let runningDate = new Date(year, monthIndex);
    let weeks: ReactElement[][] = [];

    let firstWeek: ReactElement[] = [];
    for (let i = 0; i < runningDate.getDay(); ++i) firstWeek.push(<Day key={i} year={year} monthIndex={monthIndex} day={runningDate.getDate()} inMonth={false} />);

    let currentWeek: ReactElement[] = firstWeek;
    while (runningDate.getMonth() == monthIndex) {
        if (runningDate.getDay() == 0) {
            if (currentWeek.length > 0) weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(<Day year={year} monthIndex={monthIndex} day={runningDate.getDate()} inMonth={true} />);
        runningDate.setDate(runningDate.getDate() + 1);
    }
    if (currentWeek.length > 0) {
        while (runningDate.getDay() > 0) {
            currentWeek.push(<Day key={runningDate.getDate()} year={year} monthIndex={monthIndex} day={runningDate.getDate()} inMonth={false} />);
            runningDate.setDate(runningDate.getDate() + 1);
        }
        weeks.push(currentWeek);
    }

    let allWeeks: React.JSX.Element[] = [];
    for (let i in weeks) allWeeks.push(<Week key={i} days={weeks[i]} />);

    return <div className="calendar">
        <h3 className="month-name">{Months[monthIndex]}</h3>
        <table>
            <tbody>
                <WeekHeader />
                {...allWeeks}
            </tbody>
        </table>
    </div>;
}

export function CalContainer() {
    return <div className="cal-container">
        <Month
            year={2024}
            monthIndex={11}
        />
    </div>;
}