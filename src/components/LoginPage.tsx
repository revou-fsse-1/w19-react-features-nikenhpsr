import React, { useState, ChangeEvent, FormEvent, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const history = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                'https://mock-api.arikmpt.com/api/user/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                }
            );

            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem('token', token);
                login(token);
                setLoginSuccess(true);
                setEmail('');
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

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500 p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Login Page</h1>
            {loginSuccess ? (
                <p className="text-green-500">Login successful!</p>
            ) : (
                <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="text-white block mb-2">
                            Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="border border-white px-3 py-2 rounded-md w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="text-white block mb-2">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="border border-white px-3 py-2 rounded-md w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-white text-blue-500 px-6 py-2 rounded-md hover:bg-blue-100 block mx-auto"
                    >
                        Login
                    </button>
                </form>
            )}
            <p className="text-white mt-4">
                Doesn't have an account?{' '}
                <span
                    className="underline cursor-pointer"
                    onClick={handleRegister}
                >
          Register here
        </span>
            </p>
        </div>
    );
};

export default LoginPage;
