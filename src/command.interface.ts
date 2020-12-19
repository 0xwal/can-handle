import {CommandEventData} from './command-event-data';


export interface CommandInterface
{
    identifier(): string;

    handle(commandEventData: CommandEventData, ...args: string[]): Promise<any>;

    argumentsCount(): number;
}
