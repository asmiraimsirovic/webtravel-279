import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Row, Col } from 'react-bootstrap';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            history('/home'); 
        }
      }, [history]);
    const handleLogin = async (e) => {
      
    e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        history('/home'); // Redirect to home page
      }catch (error) {
        const errorMessage = error.response && error.response.data.message 
            ? error.response.data.message 
            : 'Failed to login. Please check your credentials.';
        setError(errorMessage);
    }
    };

  const handleGuest = () => {
    history('/home'); // Redirect to home page
  };
  const handleGoToRegister = () => {
    history('/register');
  };
  return (
    <div className="login-container">
    <Card className="login-card">
      <Card.Body>
        <Card.Title className="text-center mb-4">Login</Card.Title>
        <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="py-2" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="py-2" required />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-2 py-2">Login</Button>
              <Button variant="secondary" onClick={handleGoToRegister} className="w-100 mb-2 py-2">Register</Button>
              <Button variant="outline-primary" onClick={handleGuest} className="w-100 py-2">Continue as Guest</Button>
            </Form>
      </Card.Body>
      {error && <div className="error-message">{error}</div>}
    </Card>
  </div>
  );
};

export default Login;
