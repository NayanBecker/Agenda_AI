const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const configuration = new GoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
});
const googleAI = new GoogleGenerativeAI(configuration);


module.exports = { googleAI };
