import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Category {
    id: string;
    name: string;
    description: string;
}

const DashboardPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [username, setUsername] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchUsername();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://mock-api.arikmpt.com/api/category');
            setCategories(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchCategoryById = async (id: string) => {
        try {
            const response = await axios.get(`https://mock-api.arikmpt.com/api/category/${id}`);
            console.log('Category:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const createCategory = async () => {
        try {
            const response = await axios.post('https://mock-api.arikmpt.com/api/category/create', {
                name,
                description,
            });
            setCategories((prevCategories) => [...prevCategories, response.data]);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateCategory = async (id: string) => {
        try {
            const response = await axios.put(`https://mock-api.arikmpt.com/api/category/update/${id}`, {
                name,
                description,
            });
            setCategories((prevCategories) => {
                const updatedCategories = prevCategories.map((category) =>
                    category.id === id ? response.data : category
                );
                return updatedCategories;
            });
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            await axios.delete(`https://mock-api.arikmpt.com/api/category/${id}`);
            setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchUsername = async () => {
        try {
            const response = await axios.get('https://mock-api.arikmpt.com/api/user/username');
            setUsername(response.data.username);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Dashboard Page</h1>
            <h2>Hello, {username}</h2>
            <h2>Create Category</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <button onClick={() => fetchCategoryById(category.id)}>Get by ID</button>
                                <button onClick={() => updateCategory(category.id)}>Update</button>
                                <button onClick={() => deleteCategory(category.id)}>Delete</button>
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