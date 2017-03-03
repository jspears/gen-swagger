class RefType {
    constructor(internalPrefix) {
        this.internalPrefix = internalPrefix;
    }

    getInternalPrefix() {
        return this.internalPrefix;
    }

    ordinal() {
        return ENUMS.indexOf(this);
    }

    values() {
        return ENUMS;
    }

    static forValue(str) {
        str = str.toUpperCase()
        for (const c of RefType.values()) {
            if (c.constructor.name.toUpperCase() == str)
                return c;
        }
    }
}


export const DEFINITION = new RefType("#/definitions/");
export const PARAMETER = new RefType("#/parameters/");
export const PATH = new RefType("#/paths/");
export const RESPONSE = new RefType("#/responses/");

const ENUMS = Object.freeze(DEFINITION, PARAMETER, PATH, RESPONSE);

export default ({DEFINITION, PARAMETER, PATH, RESPONSE});