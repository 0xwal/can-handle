import {CommandEventData, CommandInterface, MiddlewareInterface} from 'can-handle';


export class HelloCommand implements CommandInterface
{
    argumentsCount(): number
    {
        return 1;
    }

    async handle(commandEventData: CommandEventData, name: string): Promise<any>
    {
        return `Hi ${name}`;
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
