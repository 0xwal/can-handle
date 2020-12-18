import {CommandInterface} from './command.interface';
import {CommandNameRequiredException, CommandNotExistException} from './exceptions';


declare type CommandRegistrar = { [key: string]: CommandInterface };


export class CommandHandler
{
    private _commands: CommandRegistrar = {};

    get commands()
    {
        return this._commands;
    }

    public registerCommand(command: CommandInterface)
    {
        if (!command.identifier())
        {
            throw new CommandNameRequiredException();
        }
        this._commands[command.identifier()] = command;
    }

    public unregisterCommand(identifier: string)
    {
        if (!this._commands[identifier])
        {
            throw new CommandNotExistException(identifier);
        }
        delete this._commands[identifier];
    }
}
