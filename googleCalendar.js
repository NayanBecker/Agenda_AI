const { google } = require('googleapis');
const { authorize } = require('./googleOAuth');

async function addEventToCalendar(eventData) {
    return new Promise((resolve, reject) => {
        authorize(async (auth) => {
            const calendar = google.calendar({ version: 'v3', auth });

            let event = {};

            if (eventData.eventType === 'default') {
                event = {
                    summary: eventData.summary,
                    description: eventData.description || '',
                    start: eventData.start,
                    end: eventData.end,
                };
            } else if (eventData.eventType === 'birthday') {
                event = {
                    summary: eventData.summary,
                    start: eventData.start,
                    end: eventData.end,
                    recurrence: eventData.recurrence || ["RRULE:FREQ=YEARLY"],
                    transparency: eventData.transparency || "transparent",
                    visibility: eventData.visibility || "private",
                };
            } else {
                return reject(new Error(`Tipo de evento não suportado: ${eventData.eventType}`));
            }

            try {
                const res = await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: event,
                });
                resolve(res.data);
            } catch (err) {
                reject(err);
            }
        });
    });
}

module.exports = { addEventToCalendar };
