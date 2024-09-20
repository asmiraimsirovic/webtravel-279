// TripManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap';
import TripEditModal from './tripedit';
const TripManagement = () => {
    const initialTripState = {
        title: '',
        description: '',
    };
    const [trips, setTrips] = useState([]);
    const [editingTrip, setEditingTrip] = useState(null);
    const [newTrip, setNewTrip] = useState({
        title: '',
        destinationImage: '',
        description: '',
        category: '',
        startDate: '',
        endDate: ''
    });
    const userRole = localStorage.getItem('userRole');
    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/trips');
            setTrips(response.data);
        } catch (error) {
            console.error('Error fetching trips', error);
        }
    };
    const handleEdit = (trip) => {
        setEditingTrip(trip);
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTrip({ ...newTrip, [name]: value });
    };
    const saveTrip = async (tripId, updatedTrip) => {
        try {
            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            await axios.put(`http://localhost:3000/api/trips/${tripId}`, updatedTrip, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
            });
            setEditingTrip(null);
            fetchTrips(); // Refresh the list after update
        } catch (error) {
            console.error('Error updating trip', error);
        }
    };
    const deleteTrip = async (tripId) => {
        try {
            const token = await localStorage.getItem('userToken');
            await axios.delete(`http://localhost:3000/api/trips/${tripId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchTrips(); 
        } catch (error) {
            console.error('Error deleting trip', error);
        }
    };
    const addNewTrip = async () => {
        try {
            const token = await localStorage.getItem('userToken');
            await axios.post('http://localhost:3000/api/trips/add', newTrip, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setNewTrip(initialTripState);
            fetchTrips(); // Refresh the list
        } catch (error) {
            console.error('Error adding new trip', error);
        }
    };
    // Placeholder function for edit functionality
    const editTrip = (tripId) => {
        console.log('Edit trip with ID:', tripId);
    };

    return (
        <div>
        <h2>Trip Management</h2>
        
        {/* Form for adding a new trip */}
        <div>
        <Card className="my-4">
            <Card.Body>
                <Card.Title>Add New Trip</Card.Title>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="title" 
                            value={newTrip.title} 
                            onChange={handleInputChange} 
                            placeholder="Enter title" 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Destination Image URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="destinationImage" 
                            value={newTrip.destinationImage} 
                            onChange={handleInputChange} 
                            placeholder="Enter image URL" 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            name="description" 
                            value={newTrip.description} 
                            onChange={handleInputChange} 
                            placeholder="Enter description" 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="category" 
                            value={newTrip.category} 
                            onChange={handleInputChange}
                        >
                            <option value="">Select Category</option>
                            <option value="Africa">Africa</option>
                            <option value="Antarctica">Antarctica</option>
                            <option value="Asia">Asia</option>
                            <option value="Europe">Europe</option>
                            <option value="North America">North America</option>
                            <option value="Oceania">Oceania</option>
                            <option value="South America">South America</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control 
                            type="date" 
                            name="startDate" 
                            value={newTrip.startDate} 
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control 
                            type="date" 
                            name="endDate" 
                            value={newTrip.endDate} 
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={addNewTrip}>Add New Trip</Button>
                </Form>
            </Card.Body>
        </Card>
    </div>

    <div className="container">
    <div className="row">
        {trips.map(trip => (
            <div key={trip._id} className="col-lg-4 col-md-6 col-12 mb-4">
                <div className="card">
                    <img src={trip.destinationImage} alt={trip.title} className="card-img-top" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                    <div className="card-body">
                        <h5 className="card-title">{trip.title}</h5>
                        <p className="card-text">{trip.description}</p>
                        <p className="card-text"><small className="text-muted">Category: {trip.category}</small></p>
                        <p className="card-text">Start Date: {new Date(trip.startDate).toLocaleDateString()}</p>
                        <p className="card-text">End Date: {new Date(trip.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary mr-2" onClick={() => handleEdit(trip._id)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => deleteTrip(trip._id)}>Delete</button>
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>

{editingTrip && (
    <TripEditModal
        trip={editingTrip}
        onSave={saveTrip}
        onClose={() => setEditingTrip(null)}
    />
)}

        </div>
    );
};

export default TripManagement;
