import {Collections, newHashMap, HashMap} from "../java/javaUtil";
import AbstractModel from "./AbstractModel";
export default class ModelImpl extends AbstractModel {
    constructor() {
        super();
        this.__isSimple = false;
    }

    _enum(value) {
        var _this = this;
        if (Array.isArray(value)) {
            this.__enum = value;
        } else if (typeof value === 'string') {
            this.__enum = [value];
        }
        return this;
    };

    getEnum() {
        return this.___enum;
    };

    setEnum(_enum) {
        this.___enum = _enum;
    };

    discriminator(discriminator) {
        this.setDiscriminator(discriminator);
        return this;
    };

    type(type) {
        this.setType(type);
        return this;
    };

    format(format) {
        this.setFormat(format);
        return this;
    };

    name(name) {
        this.setName(name);
        return this;
    };

    uniqueItems(uniqueItems) {
        this.setUniqueItems(uniqueItems);
        return this;
    };

    allowEmptyValue(allowEmptyValue) {
        this.setAllowEmptyValue(allowEmptyValue);
        return this;
    };

    description(description) {
        this.setDescription(description);
        return this;
    };

    property(key, property) {
        this.addProperty(key, property);
        return this;
    };

    example(example) {
        this.setExample(example);
        return this;
    };

    additionalProperties(additionalProperties) {
        this.setAdditionalProperties(additionalProperties);
        return this;
    };

    required(name) {
        this.addRequired(name);
        return this;
    };

    xml(xml) {
        this.setXml(xml);
        return this;
    };

    minimum(minimum) {
        this.__minimum = minimum;
        return this;
    };

    maximum(maximum) {
        this.__maximum = maximum;
        return this;
    };

    getDiscriminator() {
        return this.__discriminator;
    };

    setDiscriminator(discriminator) {
        this.__discriminator = discriminator;
    };

    getName() {
        return this.__name;
    };

    setName(name) {
        this.__name = name;
    };

    getDescription() {
        return this.__description;
    };

    setDescription(description) {
        this.__description = description;
    };

    isSimple() {
        return this.__isSimple;
    };

    setSimple(isSimple) {
        this.__isSimple = isSimple;
    };

    getAdditionalProperties() {
        return this.__additionalProperties;
    };

    setAdditionalProperties(additionalProperties) {
        this.type(ModelImpl.OBJECT);
        this.__additionalProperties = additionalProperties;
    };

    getAllowEmptyValue() {
        return this.__allowEmptyValue;
    };

    setAllowEmptyValue(allowEmptyValue) {
        if (allowEmptyValue != null) {
            this.__allowEmptyValue = allowEmptyValue;
        }
    };

    getType() {
        return this.__type;
    };

    setType(type) {
        this.__type = type;
    };

    getFormat() {
        return this.__format;
    };

    setFormat(format) {
        this.__format = format;
    };

    addRequired(name) {
        if (this.__required == null) {
            this.__required = []
        }
        this.__required.add(name);
        const p = this.properties.get(name);
        if (p != null) {
            p.setRequired(true);
        }
    };

    getRequired() {
        const output = [];
        if (this.properties != null) {
            for (const [key, prop] of this.properties) {
                if (prop != null && prop.getRequired()) {
                    output.add(key);
                }
            }
        }
        if (output.length == 0)  return null;
        Collections.sort(output);
        return output;
    };

    setRequired(required) {
        this.__required = required;
        if (this.properties != null) {
            for (const s of required) {
                const p = this.properties.get(s);
                if (p != null) {
                    p.setRequired(true);
                }
            }
        }
    };

    addProperty(key, property) {
        if (property == null) {
            return;
        }
        if (this.properties == null) {
            this.properties = newHashMap();
        }
        if (this.__required != null) {
            for (const ek of this.__required) {
                if (key === ek) {
                    property.setRequired(true);
                }
            }
        }
        this.properties.put(key, property);
    };

    getProperties() {
        return this.properties;
    };

    setProperties(properties) {
        if (properties != null) {
            for (const [key, property] of properties) {
                this.addProperty(key, property);
            }
        }
    };

    getExample() {
        if (this.__example == null) {
        }
        return this.__example;
    };

    setExample(example) {
        this.__example = example;
    };

    getXml() {
        return this.__xml;
    };

    setXml(xml) {
        this.__xml = xml;
    };

    getDefaultValue() {
        if (this.defaultValue == null) {
            return null;
        }
        try {
            if (("integer" === this.__type)) {
                return Number(this.defaultValue);
            }
            if (("number" === this.__type)) {
                return parseFloat(this.defaultValue);
            }
        }
        catch (e) {
            return null;
        }
        return this.defaultValue;
    };

    setDefaultValue(defaultValue) {
        this.defaultValue = defaultValue;
    };

    getMinimum() {
        return this.__minimum;
    };

    setMinimum(minimum) {
        this.__minimum = minimum;
    };

    getMaximum() {
        return this.__maximum;
    };

    setMaximum(maximum) {
        this.__maximum = maximum;
    };

    getUniqueItems() {
        return this.__uniqueItems;
    };

    getReadOnly() {
        return this.__readOnly;
    }

    setReadOnly(ro) {
        this.__readOnly = ro;
    }

    setUniqueItems(uniqueItems) {
        this.__uniqueItems = uniqueItems;
    };

    clone() {
        var cloned = new ModelImpl();
        cloned.__type = this.__type;
        cloned.__name = this.__name;
        cloned.__required = this.__required;
        if (this.properties != null)
            cloned.properties = (new HashMap(this.properties));
        cloned.__isSimple = this.__isSimple;
        cloned.__description = this.__description;
        cloned.__example = this.__example;
        cloned.__additionalProperties = this.__additionalProperties;
        cloned.__discriminator = this.__discriminator;
        cloned.__xml = this.__xml;
        cloned.defaultValue = this.defaultValue;
        cloned.__minimum = this.__minimum;
        cloned.__maximum = this.__maximum;
        return cloned;
    };
}
