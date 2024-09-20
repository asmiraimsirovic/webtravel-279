import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import 'bootstrap/dist/css/bootstrap.min.css';
import TripManagement from './components/tripmenagment';
import TripHistoryPage from './components/triphistory';
import UserManagement from './components/usermenagment';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/trip-managament" element={<TripManagement />} />
        <Route path="/trip-history" element={<TripHistoryPage />} />
        <Route path="/user-managament" element={<UserManagement />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
