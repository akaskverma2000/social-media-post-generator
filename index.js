const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./middlewares/cors.js');
const authRoutes = require('./api/authRoutes.js');
const postRoutes = require('./api/postRoutes.js');

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
