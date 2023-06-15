import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Category {
    id: string;
    name: string;
    is_active: boolean;
}

const DashboardPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState('');
    const [categoryIdToUpdate, setCategoryIdToUpdate] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'inactive'
    const [deletedCategoryName, setDeletedCategoryName] = useState('');
    const { logout } = useContext(AuthContext);
    const history = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            // If the user is not logged in, redirect to the login page
            history('/');
        } else {
            fetchCategories();
        }
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://mock-api.arikmpt.com/api/category/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const categoriesData = response.data.data; // Extract the 'data' array
            setCategories(categoriesData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const openDialog = (categoryId: string) => {
        const categoryToUpdate = categories.find((category) => category.id === categoryId);
        if (categoryToUpdate) {
            setCategoryIdToUpdate(categoryId);
            setName(categoryToUpdate.name);
            setIsActive(categoryToUpdate.is_active);
            setIsDialogOpen(true);
        }
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setName('');
        setCategoryIdToUpdate('');
    };

    const createCategory = async () => {
        try {
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.post(
                'https://mock-api.arikmpt.com/api/category/create/',
                {
                    name: name,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const newCategory = response.data.data; // Extract the newly created category object
            setCategories((prevCategories) => [...prevCategories, newCategory]); // Add the new category to the state
            setName('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateCategory = async () => {
        try {
            await axios.put(
                `https://mock-api.arikmpt.com/api/category/update`,
                {
                    id: categoryIdToUpdate,
                    name,
                    is_active: isActive,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCategories((prevCategories) => {
                const updatedCategories = prevCategories.map((category) =>
                    category.id === categoryIdToUpdate ? { ...category, name: name, is_active: isActive } : category
                );
                return updatedCategories;
            });
            closeDialog();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteCategory = async (id: string, categoryName: string) => {
        try {
            await axios.delete(`https://mock-api.arikmpt.com/api/category/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category.id !== id)
            );
            setDeletedCategoryName(categoryName);
            setTimeout(() => {
                setDeletedCategoryName('');
            }, 1000);
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

    const filteredCategories = categories.filter((category) => {
        if (filter === 'all') {
            return true;
        } else if (filter === 'active') {
            return category.is_active;
        } else if (filter === 'inactive') {
            return !category.is_active;
        }
        return true;
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500 p-6">
            <h2 className="text-white text-4xl mb-6">Dashboard</h2>
            <button
                className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
                onClick={handleLogout}
            >
                Logout
            </button>

            <div className="w-full md:w-1/2 bg-white p-6 rounded-md mb-4">
                <h2 className="text-blue-500 text-2xl mb-2">Create Category</h2>
                <input
                    className="border border-blue-500 rounded-md px-4 py-2 mb-2 w-full"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                    onClick={createCategory}
                >
                    Create
                </button>
            </div>

            <div className="w-full md:w-1/2 bg-white p-6 rounded-md">
                <h2 className="text-blue-500 text-2xl mb-2">Categories</h2>
                {isLoading ? (
                    <p className="text-gray-500">Loading categories...</p>
                ) : (
                    <>
                        <div className="mb-4">
                            <label htmlFor="filter" className="mr-2">
                                Filter:
                            </label>
                            <select
                                id="filter"
                                className="border border-blue-500 rounded-md px-4 py-2"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th className="text-left">ID</th>
                                <th className="text-left">Name</th>
                                <th className="text-left">Active</th>
                                <th className="text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category.id} className="border-b">
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>{category.is_active ? 'Yes' : 'No'}</td>
                                    <td className="flex gap-2">
                                        <button
                                            className="text-blue-500 hover:text-blue-600"
                                            onClick={() => openDialog(category.id)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-600"
                                            onClick={() => deleteCategory(category.id, category.name)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {isDialogOpen && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md">
                        <h2 className="text-blue-500 text-2xl mb-2">Edit Category</h2>
                        <input
                            className="border border-blue-500 rounded-md px-4 py-2 mb-2 w-full"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                            <label htmlFor="isActive" className="ml-2">
                                Active
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                                onClick={updateCategory}
                            >
                                Update
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                                onClick={closeDialog}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deletedCategoryName && (
                <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-blue-200 bg-opacity-50">
                    <p className="text-black text-xl">
                        <span className="text-red-400">{deletedCategoryName}</span> has been deleted.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;