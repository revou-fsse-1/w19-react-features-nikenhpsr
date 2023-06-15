import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from "./components/DashboardPage";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={ <LoginPage />} />
                <Route path="/register" element={ <RegisterPage />} />
                <Route path="/dashboard" element={ <DashboardPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
