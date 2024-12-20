import React, { useEffect, useState } from "react";

import { Header } from "./Header";
import { CalSelector } from "./CalSelector";
import { CalContainer } from "./CalContainer";
import { PeriodSelector } from "./PeriodSelector";
import { Grade } from "./Grade";
import { Makeups } from "./Makeups";
import { Disclaimer } from "./Disclaimer";

import type { PeriodNum, SelectionType } from "./types";
import { genBlankSelected } from "./utils";

const SCHED_AVAILABLE = {
    "SY2425 Semester 1": "sem1.json",
    "SY2425 Semester 2 (Senior)": "sem2-sr.json",
    "SY2425 Semester 2 (Fr-Jr)": "sem2-non-sr.json"
};

export function App() {
    let [selectedCal, setSelectedCal] = useState('sem1.json');
    let [period, setPeriod] = useState<PeriodNum>("EB");
    let [makeups, setMakeups] = useState(0);

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

    let [selected, setSelected] = useState<Record<string, SelectionType>>({});

    if (cal && period && JSON.stringify(selected) == "{}") setSelected((_) => genBlankSelected(cal, period));

    return (<>
        <Header />
        {cal ? <><Grade
            schedule={cal}
            period={period}
            selected={selected}
            makeups={makeups} /><br /></> : <></>}
        <CalSelector
            label="Semester"
            calsAvailable={SCHED_AVAILABLE}
            defaultCal={selectedCal}
            onSelect={(cal) => setSelectedCal(cal)}
        />
        <br />
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
                console.log(JSON.stringify(selected));
            }}
            selected={selected}
        /> : <div>Loading...</div>}
        <br />
        <Makeups
            value={makeups}
            onChange={setMakeups}></Makeups>
        <br />
        <Disclaimer />
    </>);
}