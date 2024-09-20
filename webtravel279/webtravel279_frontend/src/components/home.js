// src/components/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Card, Button, Modal, Form, Navbar, Nav, Row, Col, } from 'react-bootstrap';

const Home = () => {
  const history = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('');
  const [commentText, setCommentText] = useState('');

  const token = localStorage.getItem('userToken');
  const userRole = localStorage.getItem('userRole');
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    history('/'); // Redirect to the login page
  };
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/trips');
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips', error);
      }
    };

    fetchTrips();
  }, [token]);
  const fetchTrips = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/trips');
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips', error);
    }
  };
  async function joinTrip(tripId) {
    try {
      const response = await fetch(`http://localhost:3000/api/trips/join/${tripId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`, // Assuming the token is stored in localStorage
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Trip joined successfully');
        // Handle successful join (e.g., update UI or state)
      } else {
        alert(data.message); // Display error message from the server
      }
    } catch (error) {
      console.error('Error joining trip:', error);
      alert('Error joining trip');
    }
  }

  const handleAskQuestion = async () => {
    if (!selectedTrip || !commentText.trim()) return; // Check if there is a selected trip and comment is not empty

    try {
      await axios.post(`http://localhost:3000/api/comments/add`, {
        tripId: selectedTrip._id,
        text: commentText
      }, { headers: { Authorization: `Bearer ${token}` } });

      fetchTrips();
      setCommentText('');
      setShowModal(false);
    } catch (error) {
      console.error('Error posting comment', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3000/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh the comments or trip data
      setShowModal(false);
      fetchTrips();
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  const handleSeeMore = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const filteredTrips = trips.filter(trip => trip.category.includes(filter));

  return (
    <div className="container home">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Travel App</Navbar.Brand>
        <Nav className="ml-auto">
          {userRole === 'user' && <Nav.Link href="/trip-history">Trip History</Nav.Link>}
          {userRole === 'admin' && <><Nav.Link href="/trip-managament">Trip Managament</Nav.Link><Nav.Link href="/user-managament">User Managament</Nav.Link></>}
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
        </Nav>
      </Navbar>
      <Form.Group controlId="continentFilter">
        <h3 className='homepage'>Filter by Continent</h3>
        <Form.Select onChange={e => setFilter(e.target.value)}>
          <option value="">Select Continent</option>
          <option value="Africa">Africa</option>
          <option value="Antarctica">Antarctica</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
          <option value="Oceania">Oceania</option>
          <option value="South America">South America</option>
        </Form.Select>
      </Form.Group>

      <Row>
        {filteredTrips.map(trip => (
          <Col key={trip._id} lg={4} md={6} sm={12} className="mb-4">
            <Card>
              <Card.Img variant="top" src={trip.destinationImage} alt={trip.title} />
              <Card.Body>
                <Card.Title>{trip.title}</Card.Title>
                <Card.Text>{trip.description}</Card.Text>
                <Card.Text>Category: {trip.category}</Card.Text>
                <Card.Text>Start Date: {new Date(trip.startDate).toLocaleDateString()}</Card.Text>
                <Card.Text>End Date: {new Date(trip.endDate).toLocaleDateString()}</Card.Text>
                {/* Conditionally render Join Trip button for 'user' role */}
                {userRole === 'user' && <Button variant="primary" onClick={() => joinTrip(trip._id)}>Join Trip</Button>
                }
                <Button variant="secondary" onClick={() => handleSeeMore(trip)}>See More</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTrip?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedTrip?.description}</p>
          {/* List comments here */}
          {selectedTrip?.comments.map(comment => (
            <div key={comment._id}>
              <strong>Comment:</strong> {comment.user.username + " " + comment.text}
              {userRole === 'admin' && (
                <Button variant="danger" size="sm" onClick={() => handleDeleteComment(comment._id)}>Delete</Button>
              )}
            </div>
          ))}
          {userRole === 'user' && (
            <Form>
              <Form.Group>
                <Form.Label>Ask a Question</Form.Label>
                <Form.Control type="text" placeholder="Enter your question" value={commentText} onChange={(e) => setCommentText(e.target.value)} />
              </Form.Group>
              <Button variant="primary" onClick={handleAskQuestion}>Ask</Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
