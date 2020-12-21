const canHandle = require('can-handle');

function LogMiddleware()
{
    this.identifier = () => 'logger-middleware';
    this.handle = function (commandEventData, command)
    {
        console.log('logger: ', command.identifier());
    }
    return this;
}

function HelloCommand()
{
    this.identifier = () => 'hello';
    this.handle = async function(commandEventData)
    {
       return 'Hello';
    }
    this.argumentsCount = () => 0;
    this.middlewares = () => [];
}
const commandHandler = new canHandle.CommandHandler();
commandHandler.registerGlobalMiddleware(new LogMiddleware());
commandHandler.registerCommand(new HelloCommand());

commandHandler.handle(process.argv[2], new canHandle.CommandEventData())
    .catch(console.error);
