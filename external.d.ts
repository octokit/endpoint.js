declare module "universal-user-agent" {
    function getUserAgentNode(): string
    export = getUserAgentNode;
}
declare module "is-plain-object" {
    export = isPlainObject;

    function isPlainObject(o: any): boolean;

    namespace isPlainObject { }
}
