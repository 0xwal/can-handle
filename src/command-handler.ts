import {CommandInterface} from './command.interface';
import {CommandNameRequiredException, CommandNotExistException, InvalidArgumentsException, InvalidCommandException, MiddlewareIdentifierException, MiddlewareNotExistException} from './exceptions';
import {MiddlewareInterface} from './middleware.interface';
import {CommandEventData} from './command-event-data';
import {parseLine} from 'parse-line';


declare type CommandsMap = { [key: string]: CommandInterface };
declare type MiddlewaresMap = { [key: string]: MiddlewareInterface };


export class CommandHandler
{
    private _commands: CommandsMap = {};
    private _middlewares: MiddlewaresMap = {};

    public get commands()
    {
        return this._commands;
    }

    public get globalMiddlewares(): MiddlewaresMap
    {
        return this._middlewares;
    }

    public registerCommand(command: CommandInterface)
    {
        if (!command.identifier()) {
            throw new CommandNameRequiredException();
        }
        this._commands[command.identifier()] = command;
    }

    public unregisterCommand(identifier: string)
    {
        if (!this._commands[identifier]) {
            throw new CommandNotExistException(identifier);
        }
        delete this._commands[identifier];
    }

    public registerGlobalMiddleware(middleware: MiddlewareInterface)
    {
        if (!middleware.identifier()) {
            throw new MiddlewareIdentifierException();
        }
        this._middlewares[middleware.identifier()] = middleware;
    }

    public unregisterGlobalMiddleware(identifier: string)
    {
        if (!this._middlewares[identifier]) {
            throw new MiddlewareNotExistException(identifier);
        }
        delete this._middlewares[identifier];
    }

    public async handle(commandLine: string, commandEventData: CommandEventData)
    {
        if (!commandLine) {
            throw new InvalidCommandException();
        }

        const { command, args } = CommandHandler.parseCommandLine(commandLine);

        this.invokeGlobalMiddlewares(commandEventData);

        const commandObject = this._commands[command];

        if (!commandObject) {
            throw new InvalidCommandException();
        }

        if (commandObject.argumentsCount() > args.length) {
            throw new InvalidArgumentsException();
        }

        const middlewares = commandObject.middlewares();

        if (middlewares) {
            await CommandHandler.callCommandMiddlewares(middlewares, commandEventData);
        }

        return commandObject.handle(commandEventData, ...args);
    }

    private static async callCommandMiddlewares(middlewares: MiddlewareInterface[], commandEventData: CommandEventData)
    {
        for (const middleware of middlewares) {
            await middleware.handle(commandEventData);
        }
    }

    private async invokeGlobalMiddlewares(commandEventData: CommandEventData)
    {
        //todo: we need to make sure middlewares are called in order even with long operation
        for (const middleware in this._middlewares) {
            if (!this._middlewares.hasOwnProperty(middleware)) {
                continue;
            }
            await this._middlewares[middleware].handle(commandEventData);
        }
    }

    private static parseCommandLine(commandLine: string)
    {
        const args = parseLine(commandLine);
        const [command] = args.splice(0, 1);
        return { command, args };
    }
}
