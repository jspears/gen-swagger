import {newHashMap} from '../java/javaUtil';
import RefType from './refs/RefType';
import GenericRef from './refs/GenericRef';
import {apply} from '../java/beanUtils';

export class Parameter {
    required = false;
    vendorExtensions = newHashMap()
    isUniqueItems() {
        return this.uniqueItems
    }

    getEnum() {
        return this['enum'];
    }

    setEnum(enm) {
        this['enum'] = enm;
    }

    isExclusiveMinimum() {
        return this.exclusiveMinimum != null;
    }

    isExclusiveMaximum() {
        return this.exclusiveMaximum != null;
    }

    setFormat(format) {
        this.format = format
    }

    getFormat() {
        return this.format
    }

    getIn() {
        return this.in;
    };


    isReadOnly() {
        return this.readOnly;
    };

    setVendorExtension(name, value) {
        if (name.startsWith("-x")) {
            this.vendorExtensions.put(name, value);
        }
    };

    getVendorExtensions() {
        return this.vendorExtensions;
    }

    getDefaultValue() {
        return this.defaultValue;
    }


    setDefaultValue(defaultValue) {
        this.defaultValue = defaultValue;
    }

    getDefault() {
        if (defaultValue == null || defaultValue.length == 0) {
            return null;
        }

        return defaultValue;
    }

    setDefault(defaultValue) {
        this.defaultValue = defaultValue == null ? null : defaultValue.toString();
    }
    copy(){
        const r = new this.constructor;
        return apply(r, this);
    }
}


export class BodyParameter extends Parameter {
    static TYPE = "body";
}
export class CookieParameter extends Parameter {
    static TYPE = "cookie";
}
export class FormParameter extends Parameter {
    static TYPE = "form";

    getDefaultCollectionFormat() {
        return "multi";
    }
}
export class HeaderParameter extends Parameter {
    static TYPE = "header";
}
export class PathParameter extends Parameter {
    static TYPE = "path";
    required = true;
}
export class QueryParameter extends Parameter {
    static TYPE = "query";

    getDefaultCollectionFormat() {
        return "multi";
    }
}

export class RefParameter extends Parameter {
    static TYPE = "ref";

    constructor({$ref}) {
        this.set$ref($ref);
    }

    asDefault(ref) {
        this.set$ref(RefType.PARAMETER.getInternalPrefix() + ref);
        return this;
    }

    set$ref(ref) {
        this.genericRef = new GenericRef(RefType.PARAMETER, ref);
    }

    getRefFormat() {
        return this.genericRef.getFormat();
    }

    getSimpleRef() {
        return this.genericRef.getSimpleRef();
    }

}
const ucFirst = (v) => v && v.length ? v[0].toUpperCase() + v.substring(1) : V;

const $Parameter = Parameter.prototype;
for (const k of ["name", "in", "description", "required", "type", "items", "collectionFormat", "default", "maximum",
    "exclusiveMaximum", "minimum", "exclusiveMinimum", "maxLength", "minLength", "pattern", "maxItems", "minItems",
    "uniqueItems", "multipleOf"]) {
    const get = `get${ucFirst(k)}`, set = `set${ucFirst(k)}`;
    if (!$Parameter[get]) $Parameter[get] = function () {
        return this[k]
    };

    if (!$Parameter[set]) $Parameter[set] = function (v) {
        this[k] = v
    };
}

const TYPES = [BodyParameter, CookieParameter, FormParameter, HeaderParameter, PathParameter, QueryParameter, RefParameter];

export default function (val) {
    for (const ParameterType of TYPES) {
        if (ParameterType.TYPE == val.in) {
            const p = new ParameterType(val);
            Object.keys(val).map(function (key) {
                this[`set${ucFirst(key)}`](val[key]);
            }, p);
            return p;
        }
    }
    throw new Error(`Could not resolve parameter type: ${val.in}`)
}
