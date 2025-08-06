const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function processMessageToEvent(message) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  function getCurrentDateTimeFormatted(offset = '-03:00') {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:00${offset}`;
  }

  const prompt = `
A partir da mensagem abaixo, extraia os dados para criar um evento no Google Calendar. 
Use sempre a data atual: ${getCurrentDateTimeFormatted()} como referência para o início e fim do evento, a menos que a mensagem indique uma data específica.

Gere o JSON com base nos seguintes formatos:

Para eventos com hora:
{
  "eventType": "default",
  "summary": "",
  "description": "",
  "start": { "dateTime": "YYYY-MM-DDTHH:mm:00-03:00" },
  "end": { "dateTime": "YYYY-MM-DDTHH:mm:00-03:00" }
}

Para aniversários:
{
  "eventType": "birthday",
  "summary": "",
  "start": { "date": "YYYY-MM-DD" },
  "end": { "date": "YYYY-MM-DD" },
  "recurrence": ["RRULE:FREQ=YEARLY"],
  "transparency": "transparent",
  "visibility": "private"
}

Mensagem:
"${message}"
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('❌ Erro ao interpretar JSON:', e.message);
    return null;
  }
}

module.exports = { processMessageToEvent };