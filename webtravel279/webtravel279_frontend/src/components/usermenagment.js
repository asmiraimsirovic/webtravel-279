// UserManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, ListGroup, ListGroupItem, Button } from 'react-bootstrap';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = await localStorage.getItem('userToken');
            const response = await axios.get('http://localhost:3000/api/users/users',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const toggleUserActiveStatus = async (userId, isActive) => {
        try {
            const token = await localStorage.getItem('userToken');
            await axios.put(`http://localhost:3000/api/users/deactivate/${userId}`, 
            { isActive: !isActive },
            {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
            });
            fetchUsers(); // Refresh the list after updating
        } catch (error) {
            console.error('Error updating user status', error);
        }
    };

    return (
        <div>
            <h2>User Management</h2>
            
            {users.filter(user => user.role !== 'admin').map(user => (
  <Card key={user._id} className="mb-3">
    <Card.Body>
      <Card.Title>{user.username}</Card.Title>
      <ListGroup className="list-group-flush">
        <ListGroupItem>Email: {user.email}</ListGroupItem>
        <ListGroupItem>Role: {user.role}</ListGroupItem>
        <ListGroupItem>Status: {user.isActive ? 'Active' : 'Inactive'}</ListGroupItem>
      </ListGroup>
      <Button 
        variant={user.isActive ? 'warning' : 'success'}
        onClick={() => toggleUserActiveStatus(user._id, user.isActive)}
      >
        {user.isActive ? 'Deactivate' : 'Activate'}
      </Button>
    </Card.Body>
  </Card>
))}
        </div>
    );
};

export default UserManagement;
