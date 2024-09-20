const Trip = require('../models/Trip');


// (Admin only)
exports.addTrip = async (req, res) => {
  try {
    const { title, destinationImage, description, category, startDate, endDate } = req.body;
    let trip = new Trip({ title, destinationImage, description, category, startDate, endDate });
    await trip.save();
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({}).populate({
      path: 'comments',
      select: 'text user',
      populate: { path: 'user', select: 'username' }
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate({
      path: 'comments',
      select: 'text user',
      populate: { path: 'user', select: 'username' }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Admin only)
exports.updateTrip = async (req, res) => {
  try {
    const { title, destinationImage, description, category, startDate, endDate } = req.body;
    const trip = await Trip.findByIdAndUpdate(req.params.id, { title, destinationImage, description, category, startDate, endDate }, { new: true });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//(Admin only)
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    await Trip.deleteOne({ _id: req.params.id });
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.joinTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Check if user already joined
    if (trip.participants.includes(req.user.userId)) {
      return res.status(400).json({ message: 'You have already joined this trip' });
    }

    trip.participants.push(req.user.userId);
    await trip.save();

    res.json({ message: 'Trip joined successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserPastTrips = async (req, res) => {
  try {
    console.log(req);
    const pastTrips = await Trip.find({
      participants: req.user.userId,
      endDate: { $lt: new Date() }
    });
    res.json(pastTrips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};