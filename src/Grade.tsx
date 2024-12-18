import React from "react";

import "./css/grade.scss";

import type { PeriodNum, Schedule, SelectionType } from "./types";

export function Grade({ schedule, period, selected }: { schedule: Schedule, period: PeriodNum, selected: Record<string, SelectionType> }) {
    return (<div className="grade">
        <span className="label">Grade: </span>
        <span className="letter">A</span>
        <span> </span>
        <span className="percent">(99.99%)</span>
    </div>);
}