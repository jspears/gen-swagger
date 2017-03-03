import AbstractSecuritySchemeDefinition from "./AbstractSecuritySchemeDefinition";

export default class ApiKeyAuthDefinition extends AbstractSecuritySchemeDefinition {
    type = "apiKey";

    constructor(name, __in) {
        if (arguments.length == 3) {

            this.setName(name);
            this.setIn(__in);
        }
    }

    name(name) {
        this.setName(name);
        return this;
    };

    in(__in) {
        this.setIn(__in);
        return this;
    };

    getName() {
        return this.__name;
    };

    setName(name) {
        this.__name = name;
    };

    getIn() {
        return this.__in;
    };

    setIn(__in) {
        this.__in = __in;
    };

    getType() {
        return this.type;
    };

    setType(type) {
        this.type = type;
    };

    toJSON() {
        return {
            type: this.type,
            name: this.__name,
            in: this.__in
        }
    }
}
