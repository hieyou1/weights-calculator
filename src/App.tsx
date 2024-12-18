import React, { useEffect, useState } from "react";

import { Header } from "./Header";
import { CalSelector } from "./CalSelector";
import { CalContainer } from "./CalContainer";
import { PeriodSelector } from "./PeriodSelector";
import { Grade } from "./Grade";
import type { PeriodNum, Schedule } from "./types";

const SCHED_AVAILABLE = {
    "SY2425 Semester 1": "sem1.json",
    "SY2425 Semester 2 (Senior)": "sem2-sr.json",
    "SY2425 Semester 2 (Fr-Jr)": "sem2-non-sr.json"
};

export function App() {
    let [selectedCal, setSelectedCal] = useState('sem1.json');
    let [period, setPeriod] = useState<PeriodNum>("EB");
    let [selected, setSelected] = useState({});

    let [cal, setCal] = useState(undefined);
    useEffect(() => {
        let controller = new AbortController();

        fetch(selectedCal, { signal: controller.signal })
            .then((res) => res.json())
            .then((cal) => {
                setCal(cal);
            })
            .catch((err) => {
                if (err?.name !== "AbortError") console.error(err);
            });
        return () => {
            controller.abort();
        };
    }, [selectedCal]);

    return (<>
        <Header />
        {cal ? <><Grade
            schedule={cal}
            period={period}
            selected={selected} /><br /></> : <></>}
        <CalSelector
            label="Semester"
            calsAvailable={SCHED_AVAILABLE}
            defaultCal={selectedCal}
            onSelect={(cal) => setSelectedCal(cal)}
        />
        <PeriodSelector
            period={period}
            onChange={(period) => setPeriod(period)}
        />
        <br />
        {cal ? <CalContainer
            period={period}
            schedule={cal}
            onUpdate={(date, selType) => {
                selected[date] = selType;
                setSelected((prevSelected) => ({
                    ...prevSelected,
                    [date]: selType
                }));
            }}
            selected={selected}
        /> : <div>Loading...</div>}
    </>);
}