import {CommandEventData} from './command-event-data';
import {MiddlewareInterface} from './middleware.interface';


export interface CommandInterface
{
    identifier(): string;

    handle(commandEventData: CommandEventData, ...args: string[]): Promise<any>;

    argumentsCount(): number;

    middlewares(): MiddlewareInterface[];
}
