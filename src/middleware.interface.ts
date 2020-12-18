export interface MiddlewareInterface
{
    identifier(): string;

    handle(): Promise<void>;
}
