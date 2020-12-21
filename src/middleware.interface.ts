import {CommandEventData} from './command-event-data';
import {CommandInterface} from './command.interface';


export interface MiddlewareInterface
{
    identifier(): string;

    handle(commandEventData: CommandEventData, command: CommandInterface): Promise<void>;
}
