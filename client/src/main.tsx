import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import axios from 'axios';
import { config } from './config';

export default axios.create({
  baseURL: config.apiURL,
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
