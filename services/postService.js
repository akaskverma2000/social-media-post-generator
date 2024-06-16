const axios = require('axios');
const { google } = require('googleapis');

const generatePost = async (req, res) => {
    const prompt = req.body.prompt;
    let sheets;

    try {
        const accessToken = req.cookies.accessToken;
        sheets = google.sheets({ version: 'v4', auth: accessToken });
    } catch (error) {
        console.error('Token failed:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Oops! Something went wrong on our end. Please try again in a few moments.' });
        return;
    }

    try {
        const openaiResponse = await axios.post('https://api.openai.com/v1/completions', {
            model: 'gpt-3.5-turbo',
            prompt: prompt,
            max_tokens: 50,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const post = openaiResponse.data.choices[0].text.trim();
        const timestamp = new Date().toISOString();

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1',
            valueInputOption: 'RAW',
            resource: { values: [[timestamp, prompt, post]] },
        });

        res.json({ post });
    } catch (error) {
        console.error('Chat GPT Failed:', error.response ? error.response.data : error.message);
        await handleTextCortexFallback(req, res, prompt);
    }
};

const handleTextCortexFallback = async (req, res, prompt) => {
    try {
        const url = 'https://api.textcortex.com/v1/texts/social-media-posts';
        const headers = {
            'Authorization': `Bearer ${process.env.TEXTCORTEX_API_KEY}`,
            'Content-Type': 'application/json',
        };
        const data = {
            context: prompt,
            formality: 'prefer_more',
            keywords: [prompt],
            max_tokens: 2048,
            mode: 'twitter',
            model: 'claude-haiku',
            n: 1,
            source_lang: 'en',
            target_lang: 'en',
            temperature: null,
        };

        const response = await axios.post(url, data, { headers });
        const timestamp = new Date().toISOString();
        const summary = response.data.data.outputs[0].text;

        await axios.post(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW`, {
            range: 'Sheet1',
            values: [[timestamp, prompt, summary]],
        }, {
            headers: {
                'Authorization': `Bearer ${req.cookies.accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        res.json({ post: summary });
    } catch (error) {
        console.error('Error generating completion:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'We are experiencing some issues right now. Please try again later.' });
    }
};

const fetchPosts = async (req, res) => {
    // Check if access token is present in the cookie
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        // Redirect user to authenticate if token is not present
        res.redirect('/auth/auth/google'); // Assuming 'res' is the response object
        return;
    }

    // Check if the access token is still valid
    const tokenInfoResponse = await axios.post('https://www.googleapis.com/oauth2/v3/tokeninfo', {
        access_token: accessToken
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const tokenInfo = tokenInfoResponse.data;
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    if (tokenInfo.exp && currentTime >= tokenInfo.exp) {
        // Token has expired, redirect user to authenticate
        res.redirect('/auth/authenticate-user'); // Assuming 'res' is the response object
        return;
    }

    try {
        const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1`, {
            params: { key: process.env.GOOGLE_SHEETS_API_KEY },
        });
        res.json({ values: response.data.values });
    } catch (error) {
        // console.error('Error fetching posts from Google Sheets:', error.response.data);
        res.status(500).json({ error: 'We are unable to fetch posts right now. Please try again later.' });
    }
};

module.exports = {
    generatePost,
    fetchPosts,
};
