import React, { useState } from "react";

import Container from "@mui/material/Container";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export function CalSelector({ label, calsAvailable, defaultCal, onSelect }: { label: string, calsAvailable: Record<string, string>, defaultCal: string, onSelect: (cal: string) => any }) {
    return (
        <Container maxWidth="xs">
            <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                    value={defaultCal}
                    onChange={(e: { target: { value: string } }) => onSelect(e.target.value)}>
                    {...Object.entries(calsAvailable).map(([text, value]) =>
                        <MenuItem key={value} value={value}>{text}</MenuItem>
                    )}
                </Select>
            </FormControl>
        </Container>
    );
}