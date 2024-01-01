import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";

export async function initSciChart() {
    // Call this once before any SciChartSurface is shown.
    // This is equivalent to calling SciChartSurface.configure() with the CDN URL (JSDelivr)
    SciChartSurface.loadWasmFromCDN();
}
initSciChart();
                

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
