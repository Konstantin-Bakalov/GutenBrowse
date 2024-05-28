import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import axios from 'axios';
import { config } from './config';

export default axios.create({
  baseURL: config.apiURL,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
