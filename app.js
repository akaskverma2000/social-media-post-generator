const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./middlewares/cors.js');
const authRoutes = require('./routes/authRoutes.js');
const postRoutes = require('./routes/postRoutes.js');

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.get('/home', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
