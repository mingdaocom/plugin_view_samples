import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './style.less';

const root = createRoot(document.querySelector("#app"));
root.render(<App />);
