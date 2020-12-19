import {expect, use} from 'chai';
import sinon from 'sinon';
import {
    CommandEventData,
    CommandHandler,
    CommandInterface,
    CommandNameRequiredException,
    CommandNotExistException,
    InvalidArgumentsException,
    InvalidCommandException,
    MiddlewareIdentifierException,
    MiddlewareInterface,
    MiddlewareNotExistException
} from '../../src';

import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';


use(chaiAsPromised);
use(sinonChai);

describe('CommandHandler', () =>
{
    let commandHandler: CommandHandler;
    let fakeCommand: sinon.SinonStubbedInstance<CommandInterface>;
    let fakeMiddleware: sinon.SinonStubbedInstance<MiddlewareInterface>;
    let commandEventData: CommandEventData;

    beforeEach(() =>
    {
        commandHandler = new CommandHandler();
        fakeCommand = sinon.stub(new FakeCommand());
        fakeMiddleware = sinon.stub(new FakeMiddleware());
        commandEventData = new CommandEventData();
    });

    afterEach(() =>
    {
        sinon.verifyAndRestore();
    });

    describe('commands', () =>
    {
        it('should exists', () =>
        {
            expect(CommandHandler.prototype).haveOwnProperty('commands');
        });

        it('should returned registered command', () =>
        {
            expect(Object.values(commandHandler.commands)).length(0);
            fakeCommand.identifier.returns('fake-id');
            commandHandler.registerCommand(fakeCommand);
            expect(Object.values(commandHandler.commands)).length(1);
        });
    });

    describe('registerCommand', () =>
    {

        it('should exist', () =>
        {
            expect(CommandHandler.prototype).haveOwnProperty('registerCommand');
        });

        it('should able to register a command', () =>
        {
            fakeCommand.identifier.returns('fake-command');
            commandHandler.registerCommand(fakeCommand);
            expect(commandHandler.commands['fake-command']).to.be.not.undefined;
        });

        it('should throw `CommandNameRequiredException` when `identifier` is falsy', () =>
        {
            fakeCommand.identifier.returns(undefined as unknown as string);
            expect(() =>
            {
                commandHandler.registerCommand(fakeCommand);
            }).throws(CommandNameRequiredException);
        });

        it('should register last instance of command and not duplicate them', () =>
        {
            fakeCommand.identifier.returns('fake-command');
            commandHandler.registerCommand(fakeCommand);

            const anotherCommand = sinon.stub(new FakeCommand());
            anotherCommand.identifier.returns('fake-command');

            commandHandler.registerCommand(anotherCommand);

            expect(commandHandler.commands['fake-command']).to.be.not.undefined;
            expect(Object.values(commandHandler.commands)).length(1);
        });
    });

    describe('unregisterCommand', () =>
    {

        it('should exist', () =>
        {
            expect(CommandHandler.prototype).to.haveOwnProperty('unregisterCommand');
        });


        it('should able to remove a registered command', () =>
        {
            fakeCommand.identifier.returns('fake-command');
            commandHandler.registerCommand(fakeCommand);
            commandHandler.unregisterCommand('fake-command');
            expect(commandHandler.commands['fake-command']).to.be.undefined;
        });


        it('should throw `CommandNotExistException` when `command` is not exist', () =>
        {
            expect(() =>
            {
                commandHandler.unregisterCommand('invalid-command-id');
            }).throws(CommandNotExistException);
        });

    });

    describe('globalMiddlewares', () =>
    {
        it('should exist', () =>
        {
            expect(CommandHandler.prototype).to.haveOwnProperty('globalMiddlewares');
        });

        it('should return registered middlewares', async () =>
        {
            fakeMiddleware.identifier.returns('fake-middleware');
            commandHandler.registerGlobalMiddleware(fakeMiddleware);
            expect(commandHandler.globalMiddlewares['fake-middleware']).not.to.be.undefined;
        });
    });

    describe('registerGlobalMiddleware', () =>
    {
        it('should exist', () =>
        {
            expect(CommandHandler.prototype).to.haveOwnProperty('registerGlobalMiddleware');
        });

        it('should able to register global middleware', () =>
        {
            fakeMiddleware.identifier.returns('fake-middleware');
            commandHandler.registerGlobalMiddleware(fakeMiddleware);
            expect(commandHandler.globalMiddlewares['fake-middleware']).not.to.undefined;
        });

        it('should throw `MiddlewareIdentifierException` when middleware has falsy name', () =>
        {
            fakeMiddleware.identifier.returns(undefined as unknown as string);
            expect(() =>
            {
                commandHandler.registerGlobalMiddleware(fakeMiddleware);
            }).to.throw(MiddlewareIdentifierException);
        });

        it('should register only one middleware if they have duplicate identifier', () =>
        {
            fakeMiddleware.identifier.returns('fake-middleware');
            const anotherFakeMiddleware = sinon.stub(new FakeMiddleware());
            anotherFakeMiddleware.identifier.returns('fake-middleware');
            commandHandler.registerGlobalMiddleware(fakeMiddleware);
            commandHandler.registerGlobalMiddleware(anotherFakeMiddleware);
            expect(Object.values(commandHandler.globalMiddlewares)).length(1);
        });
    });

    describe('unregisterGlobalMiddleware', () =>
    {
        it('should exist', () =>
        {
            expect(CommandHandler.prototype).to.haveOwnProperty('unregisterGlobalMiddleware');
        });

        it('should able to remove the global middleware', () =>
        {
            fakeMiddleware.identifier.returns('fake-middleware');
            commandHandler.registerGlobalMiddleware(fakeMiddleware);
            commandHandler.unregisterGlobalMiddleware('fake-middleware');
            expect(commandHandler.globalMiddlewares['fake-middleware']).to.be.undefined;
        });

        it('should throw when trying to remove unregistered middleware', () =>
        {
            expect(() =>
            {
                commandHandler.unregisterGlobalMiddleware('fake-middleware');
            }).to.throw(MiddlewareNotExistException);
        });

    });

    describe('handle', () =>
    {
        it('should exist', () =>
        {
            expect(CommandHandler.prototype).to.haveOwnProperty('handle');
        });

        describe('global middleware', () =>
        {
            it('should call global middleware', () =>
            {
                fakeMiddleware.identifier.returns('fake-middleware');
                commandHandler.registerGlobalMiddleware(fakeMiddleware);
                commandHandler.handle('cmd-line', commandEventData);
                expect(fakeMiddleware.handle).to.be.calledOnce;
            });

            it('should call global middlewares in order', () =>
            {
                fakeMiddleware.identifier.returns('fake-middleware');

                const anotherFakeMiddleware = sinon.stub(new FakeMiddleware());
                anotherFakeMiddleware.identifier.returns('another-fake-id');

                commandHandler.registerGlobalMiddleware(fakeMiddleware);
                commandHandler.registerGlobalMiddleware(anotherFakeMiddleware);

                commandHandler.handle('cmd-line', commandEventData);
                sinon.assert.callOrder(fakeMiddleware.handle, anotherFakeMiddleware.handle);
            });

            it('should call global middlewares with `HandlerEventData`', () =>
            {
                fakeMiddleware.identifier.returns('fake-middleware');

                commandHandler.registerGlobalMiddleware(fakeMiddleware);


                commandHandler.handle('fake-command', commandEventData);

                expect(fakeMiddleware.handle).calledOnceWith(commandEventData);
            });

            it('should pass the edited `HandlerEventData` to next middleware', () =>
            {
                fakeMiddleware.identifier.returns('fake-middleware');
                fakeMiddleware.handle.callsFake(async (commandEventData: CommandEventData): Promise<void> =>
                {
                    commandEventData.data = 5;
                });
                commandHandler.registerGlobalMiddleware(fakeMiddleware);

                const anotherFakeMiddleware = sinon.stub(new FakeMiddleware());
                anotherFakeMiddleware.identifier.returns('another-fake-middleware');
                commandHandler.registerGlobalMiddleware(anotherFakeMiddleware);

                commandHandler.handle('fake-command', commandEventData);
                expect(anotherFakeMiddleware.handle).calledOnceWith(sinon.match({ data: 5 }));
            });

            it('should pass the argument to middleware', () =>
            {
                fakeMiddleware.identifier.returns('fake-middleware');
                commandHandler.registerGlobalMiddleware(fakeMiddleware);

                commandHandler.handle('fake-command arg', commandEventData);

                expect(fakeMiddleware.handle).to.be.calledOnceWithExactly(sinon.match.any, 'arg');
            });

            it('should pass multiple arguments in order', () =>
            {
                fakeMiddleware.identifier.returns('fake-middleware');
                commandHandler.registerGlobalMiddleware(fakeMiddleware);

                commandHandler.handle('fake-command arg1 arg2', commandEventData);

                expect(fakeMiddleware.handle).to.be.calledOnceWithExactly(sinon.match.any, 'arg1', 'arg2');
            });
        });

        describe('command', () =>
        {
            it('should call command handle with `CommandEventData`', () =>
            {
                fakeCommand.identifier.returns('fake-command');
                commandHandler.registerCommand(fakeCommand);
                commandHandler.handle('fake-command', commandEventData);
                expect(fakeCommand.handle).to.be.calledOnceWith(commandEventData);
            });

            it('should throw `InvalidCommandException` when command is not registered', () =>
            {
                return expect(commandHandler.handle('unknown-command', commandEventData)).to.eventually.rejectedWith(InvalidCommandException);
            });

            it('should throw exception when command arguments is smaller than the required arguments', () =>
            {
                fakeCommand.identifier.returns('fake-command');
                fakeCommand.argumentsCount.returns(1);

                commandHandler.registerCommand(fakeCommand);

                return expect(commandHandler.handle('fake-command', commandEventData))
                    .to.eventually.rejectedWith(InvalidArgumentsException);
            });

            it('should reject when calling handle with empty string', () =>
            {
                return expect(commandHandler.handle('', commandEventData)).to.eventually.rejectedWith(InvalidCommandException);
            });

            it('should pass arguments to command handle', async () =>
            {
                fakeCommand.identifier.returns('fake-command');
                fakeCommand.argumentsCount.returns(1);

                commandHandler.registerCommand(fakeCommand);

                await commandHandler.handle('fake-command arg', commandEventData);
                expect(fakeCommand.handle).to.be.calledOnceWithExactly(sinon.match.any, 'arg');
            });
        });


    });
});


class FakeCommand implements CommandInterface
{
    identifier(): string
    {
        return '';
    }

    handle(): Promise<any>
    {
        return Promise.resolve(undefined);
    }

    argumentsCount(): number
    {
        return 0;
    }

}


class FakeMiddleware implements MiddlewareInterface
{
    identifier(): string
    {
        return '';
    }

    async handle(): Promise<void>
    {

    }
}
