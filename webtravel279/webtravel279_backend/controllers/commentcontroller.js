const Comment = require('../models/Comment');
const Trip = require('../models/Trip');

// Add a comment to a trip
exports.addComment = async (req, res) => {
  try {
    const { tripId, text } = req.body;
    const userId = req.user.userId;

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const comment = new Comment({ text, user: userId, trip: tripId });
    await comment.save();

    trip.comments.push(comment._id);
    await trip.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment (Admin only)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await Comment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
