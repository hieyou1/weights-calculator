import React from "react";

import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import type { PeriodNum } from "./types";

function Period({ num }: { num: PeriodNum }) {
    return <FormControlLabel value={num} control={<Radio />} label={num} labelPlacement="bottom"></FormControlLabel>;
}

export function PeriodSelector({ period, onChange }: { period: PeriodNum, onChange: (period: PeriodNum) => void }) {
    let periods: React.JSX.Element[] = [<Period key="EB" num={"EB"} />];

    for (let i = 1; i <= 8; ++i) periods.push(<Period key={i.toString() as PeriodNum} num={i.toString() as PeriodNum} />);

    return (
        <Container style={{
            "textAlign": "center"
        }}>
            <FormControl>
                <FormLabel>Period</FormLabel>
                <RadioGroup row value={period} onChange={(e) => onChange(e.target.value as PeriodNum)}>
                    {...periods}
                </RadioGroup>
            </FormControl>
        </Container>
    );
}