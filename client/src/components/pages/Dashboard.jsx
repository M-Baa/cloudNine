// components/pages/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch all users when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/users/all');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="Dashboard">
            <h1>All Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        Username: {user.username}, Email: {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
