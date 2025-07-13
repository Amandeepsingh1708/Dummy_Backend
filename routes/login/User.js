const express = require("express")
const { login, signup, getAllUsers } = require('../../controllers/login/Users');
const router = express.Router();


router.post('/signup', signup); // User registration
router.post('/login', login);   // Login (admin or user)
router.get('/users', getAllUsers); // 👈 Add this

module.exports = router;
