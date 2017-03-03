function RefType(internalPrefix) {
    return {
        getInternalPrefix(){
            return internalPrefix;
        }
    }
}
export const DEFINITION = RefType("#/definitions/");
export const PARAMETER = RefType("#/parameters/");
export const PATH = RefType("#/paths/");
export const RESPONSE = RefType("#/responses/");

export default [DEFINITION, PARAMETER, PATH, RESPONSE];