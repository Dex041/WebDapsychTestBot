const restify = require('restify');
const { BotFrameworkAdapter, UserState, MemoryStorage, ConversationState} = require('botbuilder');
const http = require('http');
const path = require('path');
const UserProfileDialog = require("./dialogs/UserProfileDialog.js");
const DialogBot = require("./bots/DialogBot.js");


const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Define state store for your bot.
// See https://aka.ms/about-bot-state to learn more about bot state.
const memoryStorage = new MemoryStorage();

// Create conversation and user state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Create the main dialog.
const dialog = new UserProfileDialog(userState);
const bot = new DialogBot(conversationState, userState, dialog);

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('listening to %s', server.url);
});

server.post('/api/messages',  (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.run(context);
    });
});
