import ModelImpl from "../models/ModelImpl";
import RefModel from "../models/RefModel";
import {Property, ArrayProperty} from "../models/properties";
import {BooleanProperty} from "../models/properties";
import {DateProperty} from "../models/properties";
import {DateTimeProperty} from "../models/properties";
import {IntegerProperty} from "../models/properties";
import {LongProperty} from "../models/properties";
import {RefProperty} from "../models/properties";
import {StringProperty} from "../models/properties";
import StringUtils from '../java/StringUtils';
import {Collections, newHashMap, HashMap, HashSet, LinkedHashMap} from '../java/javaUtil';
import AbstractModel from '../models/AbstractModel';

export default class XmlExampleGenerator {
    constructor(examples) {
        this.examples = examples;
        if (examples == null) {
            this.examples = newHashMap();
        }
    }

    toXml$io_swagger_models_properties_Property(property) {
        return this.toXml(null, property, 0, Collections.emptySet());
    }

    toXml$io_swagger_models_Model$int$java_util_Collection(model, indent, path) {

        if (model != null && model instanceof RefModel) {
            let ref = model;
            let actualModel = this.examples.get(ref.getSimpleRef());
            if (actualModel != null && actualModel instanceof ModelImpl) {
                return this.modelImplToXml(actualModel, indent, path);
            }
        }
        else if (model != null && model instanceof ModelImpl) {
            return this.modelImplToXml(model, indent, path);
        }
        return null;
    }

    modelImplToXml(model, indent, path) {
        let modelName = model.getName();
        if (path.contains(modelName)) {
            return XmlExampleGenerator.EMPTY;
        }
        let selfPath = (new HashSet(path));
        selfPath.add(modelName);
        let sb = new StringBuilder();
        let attributes = (new LinkedHashMap());
        let elements = (new LinkedHashMap());
        let name = modelName;
        let xml = model.getXml();
        if (xml != null) {
            if (xml.getName() != null) {
                name = xml.getName();
            }
        }
        if (model.getProperties() != null) {
            for (const [pName, p] of model.getProperties()) {
                if (p != null && p.getXml() != null && p.getXml().getAttribute() != null && p.getXml().getAttribute()) {
                    attributes.put(pName, p);
                }
                else {
                    elements.put(pName, p);
                }
            }

        }
        sb.append(this.indent(indent)).append(XmlExampleGenerator.TAG_START);
        sb.append(name);
        for (let index202 = attributes.keySet().iterator(); index202.hasNext();) {
            let pName = index202.next();
            {
                let p = attributes.get(pName);
                sb.append(" ").append(pName).append("=").append(this.quote(this.toXml(null, p, 0, selfPath)));
            }
        }
        sb.append(XmlExampleGenerator.CLOSE_TAG);
        sb.append(XmlExampleGenerator.NEWLINE);
        for (let index203 = elements.keySet().iterator(); index203.hasNext();) {
            let pName = index203.next();
            {
                let p = elements.get(pName);
                let asXml = this.toXml(pName, p, indent + 1, selfPath);
                if (StringUtils.isEmpty(asXml)) {
                    continue;
                }
                sb.append(asXml);
                sb.append(XmlExampleGenerator.NEWLINE);
            }
        }
        sb.append(this.indent(indent)).append(XmlExampleGenerator.TAG_END).append(name).append(XmlExampleGenerator.CLOSE_TAG);
        return sb.toString();
    }

    quote(string) {
        return "\"" + string + "\"";
    }

    toXml(name, property, indent, path) {
        if (((typeof name === 'string') || name === null) && ((property != null && (property["__interfaces"] != null && property["__interfaces"].indexOf("io.swagger.models.properties.Property") >= 0 || property.constructor != null && property.constructor["__interfaces"] != null && property.constructor["__interfaces"].indexOf("io.swagger.models.properties.Property") >= 0)) || property === null) && ((typeof indent === 'number') || indent === null) && ((path != null && (path["__interfaces"] != null && path["__interfaces"].indexOf("java.util.Collection") >= 0 || path.constructor != null && path.constructor["__interfaces"] != null && path.constructor["__interfaces"].indexOf("java.util.Collection") >= 0)) || path === null)) {
            let __args = Array.prototype.slice.call(arguments);
            return (() => {
                if (property == null) {
                    return "";
                }
                let sb = new StringBuilder();
                if (property != null && property instanceof ArrayProperty) {
                    let p = property;
                    let inner = p.getItems();
                    let wrapped = false;
                    if (property.getXml() != null && property.getXml().getWrapped() != null && property.getXml().getWrapped()) {
                        wrapped = true;
                    }
                    if (wrapped) {
                        let prefix = XmlExampleGenerator.EMPTY;
                        if (name != null) {
                            sb.append(this.indent(indent));
                            sb.append(this.openTag(name));
                            prefix = XmlExampleGenerator.NEWLINE;
                        }
                        let asXml = this.toXml(name, inner, indent + 1, path);
                        if (StringUtils.isNotEmpty(asXml)) {
                            sb.append(prefix).append(asXml);
                        }
                        if (name != null) {
                            sb.append(XmlExampleGenerator.NEWLINE);
                            sb.append(this.indent(indent));
                            sb.append(this.closeTag(name));
                        }
                    }
                    else {
                        sb.append(this.toXml(name, inner, indent, path));
                    }
                }
                else if (property != null && property instanceof RefProperty) {
                    let ref = property;
                    let actualModel = this.examples.get(ref.getSimpleRef());
                    sb.append(this.toXml(actualModel, indent, path));
                }
                else {
                    if (name != null) {
                        sb.append(this.indent(indent));
                        sb.append(this.openTag(name));
                    }
                    sb.append(this.getExample(property));
                    if (name != null) {
                        sb.append(this.closeTag(name));
                    }
                }
                return sb.toString();
            })();

        } else if (name instanceof Property) {
            return this.toXml$io_swagger_models_properties_Property(name);
        } else if (name instanceof AbstractModel) {
            return this.toXml$io_swagger_models_Model$int$java_util_Collection(name, property, indent);
        }
        throw new Error(`unknown overload`);
    }

    getExample(property) {
        if (property != null && property instanceof DateTimeProperty) {
            if (property.getExample() != null) {
                return property.getExample().toString();
            }
            else {
                return "2000-01-23T04:56:07.000Z";
            }
        }
        else if (property != null && property instanceof StringProperty) {
            if (property.getExample() != null) {
                return property.getExample().toString();
            }
            else {
                return "string";
            }
        }
        else if (property != null && property instanceof DateProperty) {
            if (property.getExample() != null) {
                return property.getExample().toString();
            }
            else {
                return "2000-01-23T04:56:07.000Z";
            }
        }
        else if (property != null && property instanceof IntegerProperty) {
            if (property.getExample() != null) {
                return property.getExample().toString();
            }
            else {
                return "0";
            }
        }
        else if (property != null && property instanceof BooleanProperty) {
            if (property.getExample() != null) {
                return property.getExample().toString();
            }
            else {
                return "true";
            }
        }
        else if (property != null && property instanceof LongProperty) {
            if (property.getExample() != null) {
                return property.getExample().toString();
            }
            else {
                return "123456";
            }
        }
        return "not implemented " + property;
    }

    openTag(name) {
        return "<" + name + ">";
    }

    closeTag(name) {
        return "</" + name + ">";
    }

    indent(indent) {
        let sb = new java.lang.StringBuffer();
        for (let i = 0; i < indent; i++) {
            sb.append("  ");
        }
        return sb.toString();
    }
}
XmlExampleGenerator.NEWLINE = "\n";
XmlExampleGenerator.TAG_START = "<";
XmlExampleGenerator.CLOSE_TAG = ">";
XmlExampleGenerator.TAG_END = "</";
XmlExampleGenerator.EMPTY = "";
