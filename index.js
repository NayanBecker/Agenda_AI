const { listenToMessages } = require('./captureMessages');
const { processMessageToEvent } = require('./aiService');
const { addEventToCalendar } = require('./googleCalendar');

require('dotenv').config();
const TARGET_ID = process.env.WHATSAPP_TARGET_ID;

listenToMessages(async (msg, sender) => {
    const chat = await msg.getChat();

    if (chat.id._serialized !== TARGET_ID) {
        console.log('⏭️ Ignorando mensagem de outro grupo ou contato...');
        return;
    }
    console.log('🧠 Enviando mensagem para a IA...');
    const eventData = await processMessageToEvent(msg.body);

    if (!eventData) {
        console.log('❌ A IA não conseguiu interpretar a mensagem como evento.');
        await msg.reply('❌ Não entendi como transformar essa mensagem em um evento.');
        return;
    }

    console.log('📦 Evento gerado pela IA:', eventData);

    try {
        console.log('📤 Enviando evento para o Google Calendar...');
        const result = await addEventToCalendar(eventData);
        console.log('✅ Evento criado com sucesso no Google Calendar!');
        console.log(`🗓️ ID do evento: ${result.id}`);

        await msg.reply(`✅ Evento agendado com sucesso: ${eventData.summary}\n🔗 ${result.htmlLink}`);

    } catch (err) {
        console.error('❌ Erro ao criar evento na agenda:', err.message);
        await msg.reply('❌ Ocorreu um erro ao tentar agendar o evento.');
    }
});