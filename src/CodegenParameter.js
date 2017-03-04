import {HashMap, newHashMap} from "./java/javaUtil";
export default class CodegenParameter {
    constructor() {
        this._vendorExtensions = newHashMap();
        this.isEnum = false;
    }

    get vendorExtensions() {
        return this._vendorExtensions;
    }

    set vendorExtensions(vendorExtensions) {
        this._vendorExtensions = vendorExtensions;
    }

    copy() {
        let output = new CodegenParameter();
        output.isFile = this.isFile;
        output.notFile = this.notFile;
        output.hasMore = this.hasMore;
        output.isContainer = this.isContainer;
        output.secondaryParam = this.secondaryParam;
        output.baseName = this.baseName;
        output.paramName = this.paramName;
        output.dataType = this.dataType;
        output.datatypeWithEnum = this.datatypeWithEnum;
        output.dataFormat = this.dataFormat;
        output.collectionFormat = this.collectionFormat;
        output.isCollectionFormatMulti = this.isCollectionFormatMulti;
        output.description = this.description;
        output.baseType = this.baseType;
        output.isFormParam = this.isFormParam;
        output.isQueryParam = this.isQueryParam;
        output.isPathParam = this.isPathParam;
        output.isHeaderParam = this.isHeaderParam;
        output.isCookieParam = this.isCookieParam;
        output.isBodyParam = this.isBodyParam;
        output.required = this.required;
        output.maximum = this.maximum;
        output.exclusiveMaximum = this.exclusiveMaximum;
        output.minimum = this.minimum;
        output.exclusiveMinimum = this.exclusiveMinimum;
        output.maxLength = this.maxLength;
        output.minLength = this.minLength;
        output.pattern = this.pattern;
        output.maxItems = this.maxItems;
        output.minItems = this.minItems;
        output.uniqueItems = this.uniqueItems;
        output.multipleOf = this.multipleOf;
        output.jsonSchema = this.jsonSchema;
        output.defaultValue = this.defaultValue;
        output.example = this.example;
        output.isEnum = this.isEnum;
        if (this._enum != null) {
            output._enum = this._enum.concat();
        }
        if (this.allowableValues != null) {
            output.allowableValues = (new HashMap(this.allowableValues));
        }
        if (this.items != null) {
            output.items = this.items;
        }
        output.vendorExtensions = this.vendorExtensions;
        output.hasValidation = this.hasValidation;
        output.isBinary = this.isBinary;
        output.isByteArray = this.isByteArray;
        output.isString = this.isString;
        output.isInteger = this.isInteger;
        output.isLong = this.isLong;
        output.isDouble = this.isDouble;
        output.isFloat = this.isFloat;
        output.isBoolean = this.isBoolean;
        output.isDate = this.isDate;
        output.isDateTime = this.isDateTime;
        output.isListContainer = this.isListContainer;
        output.isMapContainer = this.isMapContainer;
        return output;
    }

    toString() {
        return `${this.baseName}(${this.dataType})`
    }
}
