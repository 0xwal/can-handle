import {CommandEventData} from './command-event-data';


export interface MiddlewareInterface
{
    identifier(): string;

    handle(commandEventData: CommandEventData, ...args: string[]): Promise<void>;
}
