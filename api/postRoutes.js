const express = require('express');
const router = express.Router();
const { generatePost, fetchPosts } = require('../services/postService.js');

router.post('/generate-post', generatePost);
router.get('/fetch-posts', fetchPosts);

module.exports = router;
