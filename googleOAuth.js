const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = process.env.TOKEN_PATH;

function authorize(callback) {
    const { GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_CLIENT_SECRET, GOOGLE_CALENDAR_REDIRECT_URI } = process.env;

    const oAuth2Client = new google.auth.OAuth2(
        GOOGLE_CALENDAR_CLIENT_ID,
        GOOGLE_CALENDAR_CLIENT_SECRET,
        GOOGLE_CALENDAR_REDIRECT_URI
    );

    if (fs.existsSync(TOKEN_PATH)) {
        const token = fs.readFileSync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    } else {
        getAccessToken(oAuth2Client, callback);
    }
}

function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('🔗 Autorize este app acessando o link:');
    console.log(authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('\nDigite o código de autorização aqui: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Erro ao recuperar token de acesso', err);
            oAuth2Client.setCredentials(token);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log('✅ Token salvo em', TOKEN_PATH);
            callback(oAuth2Client);
        });
    });
}

module.exports = { authorize };
