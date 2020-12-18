export class CommandNotExistException extends Error
{
    constructor(identifier: string)
    {
        super(`Command with this id '${identifier}' is not exist.`);
    }
}
