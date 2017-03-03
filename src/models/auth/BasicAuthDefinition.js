import AbstractSecuritySchemeDefinition from "./AbstractSecuritySchemeDefinition";
export default class BasicAuthDefinition extends AbstractSecuritySchemeDefinition {

    type = "basic";

    getType() {
        return this.type;
    };

    setType(type) {
        this.type = type;
    };

    toJSON() {
        return Object.extend(super.toJSON(), {type: this.type});
    }
}