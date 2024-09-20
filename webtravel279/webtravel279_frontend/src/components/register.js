import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import './register.css'

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/users/register', { username, email, password });
      history('/');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className='wrapper' >
      <div className="container mt-3">
        <div className="register-container">
          <Card className="register-card">
            <Card.Body>
              <Card.Title className="text-center mb-4">Register</Card.Title>
              {error && <div className="alert alert-danger">{error}</div>}
              <Form onSubmit={handleRegister}>
                <Form.Group className='input-wrapper'>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className='input-wrapper'>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className='input-wrapper'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>

                <Button className='mt-3 w-100 p-2' variant="primary" type="submit">Register</Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
