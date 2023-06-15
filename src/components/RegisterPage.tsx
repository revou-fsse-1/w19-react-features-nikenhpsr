import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const history = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('https://mock-api.arikmpt.com/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                setRegistrationSuccess(true);
                setUsername('');
                setPassword('');
            } else {
                console.log('Registration failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogin = () => {
        // Redirect to the login page
        history('/');
    };

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <div>
            <h1>Register Page</h1>
            {registrationSuccess ? (
                <p>Your account has been created!</p>
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
                    <button type="submit">Register</button>
                </form>
            )}
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default RegisterPage;
