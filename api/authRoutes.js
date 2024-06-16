const express = require('express');
const router = express.Router();
const { authenticateUser, googleCallback, googleAuth } = require('../services/authService.js');

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
router.get('/auth/google', googleAuth);

module.exports = router;
