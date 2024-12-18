import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React, { StrictMode } from 'react';
import { Container, createRoot } from 'react-dom/client';
import { App } from "./src/App.tsx";

createRoot(document.getElementById("root") as Container).render(<StrictMode><App /></StrictMode>);