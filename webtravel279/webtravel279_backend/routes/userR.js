const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../authMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/users', auth.authenticate, auth.isAdmin, userController.getAllUsers); 
router.put('/user/:id', auth.authenticate, auth.isAdmin, userController.updateUser); 
router.put('/deactivate/:id', auth.authenticate, auth.isAdmin, userController.deactivateUser); 

module.exports = router;
