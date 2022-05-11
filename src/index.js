import React from 'react';
import './index.css';
import {initContract} from "./near-connection/utils";
import ReactDOM from "react-dom/client";
import {
    Routes,
    Route, HashRouter,
} from "react-router-dom";
import {Login} from "./components/Login";
import {MainPage} from "./components/MainPage";
import {ActionPage} from "./components/ActionPage";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));

window.nearInitPromise = initContract()
    .then(() => {
        root.render(
            <React.StrictMode>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/validate" element={<MainPage />} />
                        <Route path="/action" element={<ActionPage />} />
                    </Routes>
                </HashRouter>
            </React.StrictMode>
        )
    })
    .catch((error) => {
        console.error(error)
    })

serviceWorkerRegistration.unregister();
