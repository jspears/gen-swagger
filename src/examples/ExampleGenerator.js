import {XmlExampleGenerator} from "./XmlExampleGenerator";
import ModelImpl from "../models/ModelImpl";
import {
    ArrayProperty,
    BooleanProperty,
    DateProperty,
    DateTimeProperty,
    DecimalProperty,
    DoubleProperty,
    FileProperty,
    FloatProperty,
    IntegerProperty,
    LongProperty,
    MapProperty,
    ObjectProperty,
    RefProperty,
    StringProperty,
    UUIDProperty
} from "../models/properties";
import Json from "../java/Json";
import {Arrays, HashMap, HashSet, newHashMap} from "../java/javaUtil";

export default class ExampleGenerator {
    constructor(examples) {
        this.examples = examples;
    }

    generate(examples, mediaTypes, property) {
        let output = [];
        let processedModels = (new HashSet());
        if (examples == null) {
            if (mediaTypes == null) {
                mediaTypes = Arrays.asList("application/json");
            }
            for (let index198 = mediaTypes.iterator(); index198.hasNext();) {
                let mediaType = index198.next();
                {
                    let kv = new HashMap(["contentType", mediaType]);
                    if (property != null && ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(mediaType, "application/json")) {
                        let example = Json.pretty(this.resolvePropertyToExample(mediaType, property, processedModels));
                        if (example != null) {
                            kv.put("example", example);
                            output.add(kv);
                        }
                    }
                    else if (property != null && ((str, searchString, position = 0) => str.substr(position, searchString.length) === searchString)(mediaType, "application/xml")) {
                        let example = new XmlExampleGenerator(this.examples).toXml(property);
                        if (example != null) {
                            kv.put("example", example);
                            output.add(kv);
                        }
                    }
                }
            }
        }
        else {
            for (const [contentType, example] of examples) {
                output.add(newHashMap(["contentType", contentType], ["example", Json.pretty(example)]));
            }
        }
        if (output.isEmpty()) {
            output.add(newHashMap(["output", "none"]));
        }
        return output;
    }

    resolvePropertyToExample(mediaType, property, processedModels) {
        if (property.getExample() != null) {
            return property.getExample();
        }
        else if (property != null && property instanceof StringProperty) {
            return "aeiou";
        }
        else if (property != null && property instanceof BooleanProperty) {
            return 'true';
        }
        else if (property != null && property instanceof ArrayProperty) {
            let innerType = property.getItems();
            if (innerType != null) {
                return [this.resolvePropertyToExample(mediaType, innerType, processedModels)];
            }
        }
        else if (property != null && property instanceof DateProperty) {
            return "2000-01-23T04:56:07.000+00:00";
        }
        else if (property != null && property instanceof DateTimeProperty) {
            return "2000-01-23T04:56:07.000+00:00";
        }
        else if (property != null && property instanceof DecimalProperty) {
            return new BigDecimal(1.3579);
        }
        else if (property != null && property instanceof DoubleProperty) {
            return new Number(3.149);
        }
        else if (property != null && property instanceof FileProperty) {
            return "";
        }
        else if (property != null && property instanceof FloatProperty) {
            return new Number(1.23);
        }
        else if (property != null && property instanceof IntegerProperty) {
            return new Number(123);
        }
        else if (property != null && property instanceof LongProperty) {
            return new Number(123456789);
        }
        else if (property != null && property instanceof MapProperty) {
            let mp = (new HashMap());
            if (property.getName() != null) {
                mp.put(property.getName(), this.resolvePropertyToExample(mediaType, property.getAdditionalProperties(), processedModels));
            }
            else {
                mp.put("key", this.resolvePropertyToExample(mediaType, property.getAdditionalProperties(), processedModels));
            }
            return mp;
        }
        else if (property != null && property instanceof ObjectProperty) {
            return "{}";
        }
        else if (property != null && property instanceof RefProperty) {
            let simpleName = property.getSimpleRef();
            let model = this.examples.get(simpleName);
            if (model != null) {
                return this.resolveModelToExample(simpleName, mediaType, model, processedModels);
            }
        }
        else if (property != null && property instanceof UUIDProperty) {
            return "046b6c7f-0b8a-43b9-b35d-6489e6daee91";
        }
        return "";
    }

    resolveModelToExample(name, mediaType, model, processedModels) {
        if (processedModels.contains(name)) {
            return "";
        }
        if (model != null && model instanceof ModelImpl) {
            processedModels.add(name);
            let impl = model;
            let values = (new HashMap());
            if (impl.getProperties() != null) {
                for (let index200 = impl.getProperties().keySet().iterator(); index200.hasNext();) {
                    let propertyName = index200.next();
                    {
                        let property = impl.getProperties().get(propertyName);
                        values.put(propertyName, this.resolvePropertyToExample(mediaType, property, processedModels));
                    }
                }
            }
            return values;
        }
        return "";
    }
}
