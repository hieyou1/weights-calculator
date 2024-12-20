import React from "react";

import "./css/grade.scss";

import { PeriodNum, Schedule, SelectionType } from "./types";
import { doesPdMeet, getScheduleStartEnd, pctToGrade } from "./utils";

export function Grade({ schedule, period, selected, makeups }: { schedule: Schedule, period: PeriodNum, selected: Record<string, SelectionType>, makeups: number }) {
    let totalAttendancePoints = 0;
    let totalHrPoints = 0;
    let earnedAttendancePoints = makeups;
    let earnedHrPoints = 0;
    let { start, end } = getScheduleStartEnd(schedule);
    let curDate = start;

    while (curDate <= end) {
        if (doesPdMeet(schedule, period, curDate)) {
            totalAttendancePoints += 5;
            totalHrPoints += 1;

            let date = curDate.toDateString();
            if (date in selected) {
                switch (selected[date]) {
                    case SelectionType.Attending: {
                        earnedAttendancePoints += 5;
                        earnedHrPoints += 1;
                        break;
                    }
                    case SelectionType.NoHR: {
                        earnedAttendancePoints += 5;
                        break;
                    }
                    case SelectionType.NotAttending: {
                        break;
                    }
                }
            } else {
                earnedAttendancePoints += 5;
                earnedHrPoints += 1;
            }
        }
        curDate.setDate(curDate.getDate() + 1);
    }

    let pct = Math.round((((earnedAttendancePoints / totalAttendancePoints) * .7 + (earnedHrPoints / totalHrPoints) * .3) * 10000)) / 100;
    console.log(earnedAttendancePoints, totalAttendancePoints, earnedHrPoints, totalHrPoints);

    return (<div className="grade">
        <span className="label">Grade: </span>
        <span className="letter">{pctToGrade(pct)}</span>
        <span> </span>
        <span className="percent">({pct}%)</span>
    </div>);
}