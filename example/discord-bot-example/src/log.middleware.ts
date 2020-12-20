import {CommandEventData, MiddlewareInterface} from 'can-handle';


export class LogMiddleware implements MiddlewareInterface
{
    async handle(commandEventData: CommandEventData, ...args: string[]): Promise<void>
    {
        console.log('got a message');
    }

    identifier(): string
    {
        return 'logger';
    }

}
