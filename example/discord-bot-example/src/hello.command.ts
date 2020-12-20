import {CommandEventData, CommandInterface, MiddlewareInterface} from 'can-handle';


export class HelloCommand implements CommandInterface
{
    argumentsCount(): number
    {
        return 0;
    }

    async handle(commandEventData: CommandEventData, ...args: string[]): Promise<any>
    {
        return 'Hi';
    }

    identifier(): string
    {
        return 'hello';
    }

    middlewares(): MiddlewareInterface[]
    {
        return [];
    }

}
