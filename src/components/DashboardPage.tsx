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
    const { token, logout } = useContext(AuthContext);
    const history = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchProfile();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://mock-api.arikmpt.com/api/category', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get('https://mock-api.arikmpt.com/api/user/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
            await axios.delete(`https://mock-api.arikmpt.com/api/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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
        <div>
            <h1>Dashboard Page</h1>
            <h2>Hello, {name}</h2>
            <button onClick={handleLogout}>Logout</button>

            <h2>Create Category</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={createCategory}>Create</button>

            <h2>Categories</h2>
            {isLoading ? (
                <p>Loading categories...</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <button onClick={() => updateCategory(category.id)}>
                                    Update
                                </button>
                                <button onClick={() => deleteCategory(category.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default DashboardPage;
