const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../authMiddleware');

router.post('/add', auth.authenticate, auth.isAdmin, tripController.addTrip);
router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.put('/:id', auth.authenticate, auth.isAdmin, tripController.updateTrip);
router.delete('/:id', auth.authenticate, auth.isAdmin, tripController.deleteTrip);
router.post('/join/:id', auth.authenticate, tripController.joinTrip);
router.get('/past/trips', auth.authenticate, tripController.getUserPastTrips);


module.exports = router;