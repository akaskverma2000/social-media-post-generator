const express = require('express');
const router = express.Router();
const { authenticateUser, googleCallback } = require('../services/authService.js');
const cors = require('cors');

router.use(cors({
    origin: 'http://127.0.0.1:3000',
    credentials: true
}));

// Middleware to handle CORS preflight requests
router.options('/authenticate-user', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
});

router.get('/authenticate-user', authenticateUser);
router.get('/google/callback', googleCallback);

module.exports = router;
