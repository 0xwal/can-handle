import {expect} from 'chai';
import sinon from 'sinon';
import {CommandHandler, CommandInterface, CommandNameRequiredException, CommandNotExistException} from '../../src';


describe('CommandHandler', () =>
{
    let commandHandler: CommandHandler;

    beforeEach(() =>
    {
        commandHandler = new CommandHandler();
    });

    describe('registerCommand', () =>
    {
        let fakeCommand: sinon.SinonStubbedInstance<CommandInterface>;
        beforeEach(() =>
        {
            fakeCommand = sinon.stub(new FakeCommand());
        });
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
