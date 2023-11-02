const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const {OpenAI} = require("openai");
require('dotenv').config();
const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    if (msg.body === 'ping') {
        await msg.reply('pong');
    }
});

client.initialize();

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY,
    }
);

client.on('message', message => {
    console.log(message.body);

    if(message.body.startsWith("#")) {
        runCompletion(message.body.substring(1)).then(result => message.reply(result));
    }
});

async function runCompletion(msg) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content:msg }],
      model: 'gpt-3.5-turbo',
    });
  
  return chatCompletion.choices[0].message.content;
  }