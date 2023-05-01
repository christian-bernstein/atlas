import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './fonts.scss';
import {Driver, driver} from "./driver/Driver";
import {DriverReactBridge} from "./driver/components/DriverReactBridge";

driver();

Driver.boot();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <DriverReactBridge />
);

/**
 * If you want to start measuring performance in your app, pass a function
 * to log results (for example: reportWebVitals(console.log))
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 *
 * import reportWebVitals from './reportWebVitals';
 * reportWebVitals();
 */

