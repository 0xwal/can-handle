import {CommandEventData, CommandInterface, MiddlewareInterface} from 'can-handle';


export class LogMiddleware implements MiddlewareInterface
{
    async handle(commandEventData: CommandEventData, command: CommandInterface): Promise<void>
    {
        console.log('got a message', command.identifier());
    }

    identifier(): string
    {
        return 'logger';
    }
}
