import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BC} from "./libs/base/BernieComponent";

// driver()
// Driver.boot()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

class Class extends BC<any, any, any> {}

// <DriverReactBridge />
root.render(
  <React.StrictMode>
    Test
  </React.StrictMode>
);

/**
 * If you want to start measuring performance in your app, pass a function
 * to log results (for example: reportWebVitals(console.log))
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 *
 *
 * import reportWebVitals from './reportWebVitals';
 * reportWebVitals();
 */

