/* Generated from Java with JSweet 1.2.0 - http://www.jsweet.org */

export default class AuthorizationValue {
    constructor(keyName, value, type) {
        if (arguments.length == 3) {
            this.setKeyName(keyName);
            this.setValue(value);
            this.setType(type);
        }
    }

    value(value) {
        this.__value = value;
        return this;
    };

    type(type) {
        this.__type = type;
        return this;
    };

    keyName(keyName) {
        this.__keyName = keyName;
        return this;
    };

    getValue() {
        return this.__value;
    };

    setValue(value) {
        this.__value = value;
    };

    getType() {
        return this.__type;
    };

    setType(type) {
        this.__type = type;
    };

    getKeyName() {
        return this.__keyName;
    };

    setKeyName(keyName) {
        this.__keyName = keyName;
    };

}