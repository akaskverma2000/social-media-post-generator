const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const nlp = require('compromise');
const { google } = require('googleapis');

dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const { OAuth2Client } = require('google-auth-library');
const cors = require("cors");

const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// Create an OAuth2 client
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);

// Middleware to handle CORS preflight requests
app.options('/authenicate-user', (req, res) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
});

app.get('/authenicate-user', (req, res) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET');

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        const accessToken = tokens.access_token;

        // Set the access token in a cookie
        res.cookie('accessToken', accessToken, { httpOnly: true });

        // Continue with your logic here
        // For example, you can redirect to another page or render a template
        res.send('Authorization successful. You can now use the access token.');
    } catch (error) {
        console.error('Failed to get OAuth2 tokens:', error);
        res.status(500).json({ error: 'Failed to get OAuth2 tokens' });
    }
});

app.post('/generate-post', async (req, res) => {
    const prompt = req.body.prompt;
    let sheets; // Define the sheets variable outside the try block

    try {
        const accessToken = req.cookies.accessToken;
        // Use the accessToken to authenticate requests to Google Sheets API
        // Initialize the Google Sheets API client
        sheets = google.sheets({
            version: 'v4',
            auth: accessToken, // Assuming this is your OAuth2 access token
        });

    } catch (error) {
        console.error('Token failed:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to initialize Google Sheets API client' });
        return;
    }

    try {
        const openaiResponse = await axios.post('https://api.openai.com/v1/completions', {
            model: 'gpt-3.5-turbo',
            prompt: prompt,
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const post = openaiResponse.data.choices[0].text.trim();
        const timestamp = new Date().toISOString();

        // Save to Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1',
            valueInputOption: 'RAW',
            resource: {
                values: [[timestamp, prompt, post]]
            }
        });

        res.json({ post });

    } catch (error) {
        console.error('Chat GPT Failed:', error.response ? error.response.data : error.message);

        try {
            const { bigram } = await import('n-gram');
            const tokens = bigram(prompt.toLowerCase());
            let generatedText = '';
            for (let i = 0; i < tokens.length; i++) {
                const nextWord = tokens[i + 1] ? tokens[i + 1][0] : '';
                const sentence = `${tokens[i][0]} ${nextWord}`;
                generatedText += nlp(sentence).toTitleCase().out('text') + ' ';
            }

            const timestamp = new Date().toISOString();

            // Save to Google Sheets
            await axios.post(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW`, {
                range: 'Sheet1',
                values: [[timestamp, prompt, generatedText.trim()]]
            }, {
                headers: {
                    'Authorization': `Bearer ${req.cookies.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            res.json({ post: generatedText.trim() });

        } catch (error) {
            console.error('Error generating completion:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: 'Failed to generate post or save to Google Sheets' });
        }
    }
});


// Endpoint to fetch posts from Google Sheets
app.get('/fetch-posts', async (req, res) => {
    try {
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1`, {
            params: {
                key: process.env.GOOGLE_SHEETS_API_KEY
            }
        });
        console.log('Fetched data from Google Sheets:', response.data);
        res.json({ values: response.data.values });
    } catch (error) {
        console.error('Error fetching posts from Google Sheets:', error.response.data);
        res.status(500).json({ error: 'Failed to fetch posts from Google Sheets' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
