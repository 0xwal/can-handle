import {Client, Message} from 'discord.js';
import secret from '../.secret.json';
import {CommandEventData, CommandHandler} from 'can-handle';
import {HelloCommand} from './hello.command';
import {ByeCommand} from './bye.command';
import {LogMiddleware} from './log.middleware';


const client = new Client();
const commandHandler = new CommandHandler();


//register commands so identifier can be used in Discord chat
//also you can register as many as you want.
commandHandler.registerCommand(new HelloCommand());
commandHandler.registerCommand(new ByeCommand());

//register global middlewares that will run on all registered commands
//you can register as many as you want
commandHandler.registerGlobalMiddleware(new LogMiddleware());

client.on('message', async (message: Message) =>
{
    let content = message.content;
    if (message.author.bot || (content[0] !== '^')) {
        return;
    }

    content = content.substr(1);

    try {

        const result = await commandHandler.handle(content, new CommandEventData());

        await message.reply(result);

    } catch (e) {

        await message.reply(e.message);

    }

});

client.login(secret.bot_token);
