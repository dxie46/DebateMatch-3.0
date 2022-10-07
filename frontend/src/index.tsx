import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ToastContainer, toast } from 'react-toastify';

ReactDOM.render(
    <>
        <ToastContainer />
        <App />
    </>,
    document.getElementById('root')
);