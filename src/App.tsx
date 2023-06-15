import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from "./components/DashboardPage";
import {AuthProvider} from "./components/AuthContext";
import './Style.css'

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/dashboard" element={<DashboardPage/>}/>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
