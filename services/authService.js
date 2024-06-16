const { OAuth2Client } = require('google-auth-library');

const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

const authenticateUser = (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET');

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    res.redirect(authUrl);
};

const googleCallback = async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        const accessToken = tokens.access_token;

        res.cookie('accessToken', accessToken, { httpOnly: true });
        res.send('Authorization successful. You can now use the access token.');
    } catch (error) {
        console.error('Failed to get OAuth2 tokens:', error);
        res.status(500).json({ error: 'Failed to get OAuth2 tokens' });
    }
};

const googleAuth = async (req, res) => {
    try {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        res.redirect(authUrl);
    } catch (error) {
        console.error('Failed to generate Google auth URL:', error);
        res.status(500).json({ error: 'Failed to generate Google auth URL' });
    }
};

module.exports = {
    authenticateUser,
    googleCallback,
    googleAuth
};
