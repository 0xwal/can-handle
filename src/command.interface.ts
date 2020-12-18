import {CommandEventData} from './command-event-data';


export interface CommandInterface
{
    identifier(): string;

    handle(commandEventData: CommandEventData): Promise<any>;
}
