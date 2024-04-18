import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { initializeIcons } from "@fluentui/react";

import "./index.css";

import LoginLayout from "./LoginLayout";
import TestLogin from "./LoginForm";
import SignUpFrom from "./SignupForm";
import NoPage from "../../pages/NoPage";

import { AppStateProvider } from "../../state/AppProvider";

initializeIcons();

export default function App() {
    return (
        <AppStateProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LoginLayout/>}>
                        {/* <Route index element={<Chat />} /> */}
                        <Route index element={<TestLogin />} />
                        <Route path='signup' element={<SignUpFrom/>} />
                        <Route path="*" element={<NoPage />} />
                        
                    </Route>
                   
                </Routes>
            </HashRouter>
        </AppStateProvider>
    );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
