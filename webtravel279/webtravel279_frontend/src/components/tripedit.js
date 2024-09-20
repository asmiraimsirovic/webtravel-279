import React, { useState } from 'react';

const TripEditModal = ({ trip, onSave, onClose }) => {
    const [title, setTitle] = useState(trip.title);
    const [description, setDescription] = useState(trip.description);

    const handleSubmit = () => {
        onSave(trip._id, { title, description });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Edit Trip</h2>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                <button onClick={handleSubmit}>Save Changes</button>
            </div>
        </div>
    );
};

export default TripEditModal;
