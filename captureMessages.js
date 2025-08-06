
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({ authStrategy: new LocalAuth() });

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ WhatsApp conectado.'));

function listenToMessages(callback) {
    client.on('message', async msg => {
        const chat = await msg.getChat();
        const sender = chat.name || chat.id.user;
        console.log('🆔 ID do chat:', chat.id._serialized);


        callback(msg, sender);
    });
    client.initialize();
}

module.exports = { listenToMessages };
