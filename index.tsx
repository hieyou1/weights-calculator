import React, { StrictMode } from 'react';
import { Container, createRoot } from 'react-dom/client';
import { App } from "./App.tsx";

createRoot(document.getElementById("root") as Container).render(<StrictMode><App /></StrictMode>);