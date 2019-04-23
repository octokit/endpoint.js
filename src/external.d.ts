declare module "universal-user-agent" {
    export = getUserAgentNode;

    function getUserAgentNode(): string
}
declare module "is-plain-object" {
    export = isPlainObject;

    function isPlainObject(o: any): boolean;
}
