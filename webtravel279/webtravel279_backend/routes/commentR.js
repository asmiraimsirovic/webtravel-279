const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../authMiddleware');

router.post('/add', auth.authenticate, commentController.addComment);
router.delete('/:id', auth.authenticate, auth.isAdmin, commentController.deleteComment);

module.exports = router;
