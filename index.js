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

// Route for serving the index.html file for the '/' route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.use('/css', (req, res, next) => {
    res.setHeader('Content-Type', 'text/css');
    next();
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
