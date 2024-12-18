import React, { useState } from "react";

import { Header } from "./Header";
import { CalSelector } from "./CalSelector";
import { CalContainer } from "./CalContainer";
import { PeriodSelector } from "./PeriodSelector";
import type { PeriodNum } from "./types";

const CALS_AVAILABLE = {
    "Semester 1": "sem1.json",
    "Semester 2": "sem2.json"
};

export function App() {
    let [selectedCal, setSelectedCal] = useState('sem1.json');
    let [period, setPeriod] = useState<PeriodNum>("EB");

    return (<>
        <Header />
        <CalSelector
            label="Semester"
            calsAvailable={CALS_AVAILABLE}
            defaultCal={selectedCal}
            onSelect={(cal) => setSelectedCal(cal)}
        />
        <PeriodSelector
            period={period}
            onChange={(period) => setPeriod(period)}
        />
        <br />
        <CalContainer />
    </>);
}