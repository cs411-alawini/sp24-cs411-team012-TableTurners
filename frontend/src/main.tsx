import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import 'primereact/resources/themes/fluent-light/theme.css';
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
