const { OAuth2Client } = require('google-auth-library');
const { googleClientId, googleClientSecret, googleRedirectUri } = require('../config');

const getOAuth2Client = () => {
    return new OAuth2Client(googleClientId, googleClientSecret, googleRedirectUri);
};

module.exports = {
    getOAuth2Client,
};
