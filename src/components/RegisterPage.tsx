import React, {useState, ChangeEvent, FormEvent} from 'react';
import {useNavigate} from 'react-router-dom';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const history = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                'https://mock-api.arikmpt.com/api/user/register',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({name, email, password}),
                }
            );

            if (response.ok) {
                setRegistrationSuccess(true);
                setName('');
                setEmail('');
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

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500 p-6">
            <h3 className="text-3xl font-bold text-white mb-4">Join Me Here!</h3>
            {registrationSuccess ? (
                <p className="text-green-500">Your account has been created!</p>
            ) : (
                <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="text-white block mb-2">
                            Name:
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            className="border border-white px-3 py-2 rounded-md w-full"
                        />
                    </div>
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
                        Register
                    </button>
                </form>
            )}
            <p className="text-white mt-4">
                Already have an account?{' '}
                <span
                    className="underline cursor-pointer"
                    onClick={handleLogin}
                >Login here
                </span>
            </p>
        </div>
    );
};

export default RegisterPage;
