![can-handle](https://github.com/0xWaleed/can-handle/workflows/can-handle/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/can-handle?logo=npm)
![npm](https://img.shields.io/npm/v/can-handle?logo=npm)

# can-handle

A minimal package and easy to use command handler. Works perfectly with Discord bot, command line app, etc.



## Installation

##### npm:

`npm install can-handle`

##### yarn:

`yarn add can-handle`



## Example



###### typescript

```typescript
import {CommandEventData, CommandHandler, CommandEventData, CommandInterface, MiddlewareInterface } from 'can-handle';


class HelloCommand implements CommandInterface
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
      //command specific middlewares
        return [];
    }
}


//middleware example that can be registered as global or specific to command.
class LogMiddleware implements MiddlewareInterface
{
    async handle(commandEventData: CommandEventData): Promise<void>
    {
        console.log('got a message');
    }
    identifier(): string
    {
        return 'logger';
    }
}

//init
const commandHandler = new CommandHandler();

//register multiple commands that can be executed using its identifier
//HelloCommand implements CommandInterface.
commandHandler.registerCommand(new HelloCommand()); 


//register global middlewares that will run on all registered commands above
//LogMiddleware implements MiddlewareInterface
commandHandler.registerGlobalMiddleware(new LogMiddleware());

const commandFromUser = 'hello';
const commandHandlerEvent = new CommandHandlerEvent();
commandHandlerEvent.data = 'whatever value or context you want';
commandHandler.handle(commandFromUser, commandHandlerEvent);
```



more examples can be found here [Examples](https://github.com/0xWaleed/can-handle/tree/master/example)






