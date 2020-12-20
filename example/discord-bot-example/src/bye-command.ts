import {CommandEventData, CommandInterface, MiddlewareInterface} from 'can-handle';
import {MessageEmbed} from 'discord.js';

export class ByeCommand implements CommandInterface
{
    argumentsCount(): number
    {
        return 0;
    }

    async handle(commandEventData: CommandEventData, ...args: string[]): Promise<any>
    {
        const embedMessage = new MessageEmbed();
        embedMessage.addField('have a nice day', 'bye');
        return embedMessage;
    }

    identifier(): string
    {
        return 'bye';
    }

    middlewares(): MiddlewareInterface[]
    {
        return [];
    }

}
