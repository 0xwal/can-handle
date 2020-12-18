export class MiddlewareNotExistException extends Error
{
    constructor(identifier: string)
    {
        super(`Middleware with this id '${identifier}' is not exist`);
    }
}
