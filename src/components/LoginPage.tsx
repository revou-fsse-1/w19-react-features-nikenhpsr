import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const history = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('https://mock-api.arikmpt.com/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('token', token);
                setLoginSuccess(true);
                setUsername('');
                setPassword('');

                // Redirect to the dashboard page after successful login
                history('/dashboard');
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRegister = () => {
        // Redirect to the register page
        history('/register');
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <div>
            <h1>Login Page</h1>
            {loginSuccess ? (
                <p>Login successful!</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={handleUsernameChange} />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input type="password" value={password} onChange={handlePasswordChange} />
                    </label>
                    <br />
                    <button type="submit">Login</button>
                </form>
            )}
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default LoginPage;

