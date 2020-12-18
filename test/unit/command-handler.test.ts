import {expect} from 'chai';
import sinon from 'sinon';
import {CommandHandler, CommandInterface, CommandNameRequiredException, CommandNotExistException, MiddlewareIdentifierException, MiddlewareInterface} from '../../src';


describe('CommandHandler', () =>
{
    let commandHandler: CommandHandler;
    let fakeCommand: sinon.SinonStubbedInstance<CommandInterface>;
    let fakeMiddleware: sinon.SinonStubbedInstance<MiddlewareInterface>;

    beforeEach(() =>
    {
        commandHandler = new CommandHandler();
        fakeCommand = sinon.stub(new FakeCommand());
        fakeMiddleware = sinon.stub(new FakeMiddleware());
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

    describe('unregisterCommand', () =>
    {

        it('should exist', async () =>
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
        it('should exist', async () =>
        {
            expect(CommandHandler.prototype).to.haveOwnProperty('globalMiddlewares');
        });
    });

    describe('registerGlobalMiddleware', () =>
    {
        it('should exist', async () =>
        {
            expect(CommandHandler.prototype).to.haveOwnProperty('registerGlobalMiddleware');
        });

        it('should able to register global middleware', async () =>
        {
            fakeMiddleware.identifier.returns('fake-middleware');
            commandHandler.registerGlobalMiddleware(fakeMiddleware);
            expect(commandHandler.globalMiddlewares['fake-middleware']).not.to.undefined;
        });

        it('should throw `MiddlewareIdentifierException` when middleware has falsy name', async () =>
        {
            fakeMiddleware.identifier.returns(undefined as unknown as string);
            expect(() =>
            {
                commandHandler.registerGlobalMiddleware(fakeMiddleware);
            }).to.throw(MiddlewareIdentifierException);
        });

        it('should register only one middleware if they have duplicate identifier', async () =>
        {
            fakeMiddleware.identifier.returns('fake-middleware');
            const anotherFakeMiddleware = sinon.stub(new FakeMiddleware());
            anotherFakeMiddleware.identifier.returns('fake-middleware');
            commandHandler.registerGlobalMiddleware(fakeMiddleware);
            commandHandler.registerGlobalMiddleware(anotherFakeMiddleware);
            expect(Object.values(commandHandler.globalMiddlewares)).length(1);
        });
    });
});


class FakeCommand implements CommandInterface
{
    identifier(): string
    {
        return '';
    }

}


class FakeMiddleware implements MiddlewareInterface
{
    identifier(): string
    {
        return '';
    }
}
