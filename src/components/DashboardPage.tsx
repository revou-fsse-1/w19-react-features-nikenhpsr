import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Category {
    id: string;
    name: string;
}

const DashboardPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const { logout } = useContext(AuthContext);
    const history = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            fetchCategories();
            fetchProfile();
        }
    }, [token]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                'https://mock-api.arikmpt.com/api/category',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCategories(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get(
                'https://mock-api.arikmpt.com/api/user/profile',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setName(response.data.name);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const createCategory = async () => {
        try {
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.post(
                'https://mock-api.arikmpt.com/api/category/create',
                {
                    name: name,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCategories((prevCategories) => [...prevCategories, response.data]);
            setName('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateCategory = async (id: string) => {
        try {
            const response = await axios.put(
                `https://mock-api.arikmpt.com/api/category/update/${id}`,
                {
                    name,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCategories((prevCategories) => {
                const updatedCategories = prevCategories.map((category) =>
                    category.id === id ? response.data : category
                );
                return updatedCategories;
            });
            setName('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            await axios.delete(
                `https://mock-api.arikmpt.com/api/category/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== id)
            );
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem('token');
        // Call the logout function from AuthContext
        logout();
        // Redirect to the login page
        history('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500 p-6">
            <h1 className="text-white text-4xl mb-6">Dashboard Page</h1>
            <h2 className="text-white text-2xl mb-4">Hello, {name}</h2>
            <button
                className="bg-white text-blue-500 px-4 py-2 rounded-md mb-4"
                onClick={handleLogout}
            >
                Logout
            </button>

            <div className="bg-white p-6 rounded-md mb-4">
                <h2 className="text-blue-500 text-2xl mb-2">Create Category</h2>
                <input
                    className="border border-blue-500 rounded-md px-4 py-2 mb-2"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={createCategory}
                >
                    Create
                </button>
            </div>

            <div className="bg-white p-6 rounded-md">
                <h2 className="text-blue-500 text-2xl mb-2">Categories</h2>
                {isLoading ? (
                    <p className="text-gray-500">Loading categories...</p>
                ) : (
                    <table className="w-full">
                        <thead>
                        <tr>
                            <th className="text-left">ID</th>
                            <th className="text-left">Name</th>
                            <th className="text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>
                                    <button
                                        className="text-blue-500 hover:text-blue-600 mr-2"
                                        onClick={() => updateCategory(category.id)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="text-blue-500 hover:text-blue-600"
                                        onClick={() => deleteCategory(category.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
