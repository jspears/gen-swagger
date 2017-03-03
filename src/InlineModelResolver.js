import ArrayModel from "./models/ArrayModel";
import ModelImpl from "./models//ModelImpl";
import RefModel from "./models/RefModel";
import {BodyParameter} from "./models/parameters"; //= io.swagger.models.parameters.BodyParameter;
import {ArrayProperty, MapProperty, ObjectProperty, RefProperty} from "./models/properties";
import Json from "./java/Json";
import {newHashMap} from "./java/javaUtil";
import LoggerFactory from "./java/LoggerFactory";


export default class InlineModelResolver {
    addedModels = newHashMap();
    generatedSignature = newHashMap();
    skipMatches = false;

    flatten(swagger) {
        this.swagger = swagger;
        if (swagger.getDefinitions() == null) {
            swagger.setDefinitions(newHashMap());
        }
        let paths = swagger.getPaths();
        let models = swagger.getDefinitions();
        if (paths != null) {
            for (const path of paths) {
                const pathname = path.path;
                for (const operation of path.getOperations()) {

                    let parameters = operation.getParameters();
                    if (parameters != null) {
                        for (const parameter of parameters) {

                            if (parameter != null && parameter instanceof BodyParameter) {
                                let bp = parameter;
                                if (bp.getSchema() != null) {
                                    let model = bp.getSchema();
                                    if (model != null && model instanceof ModelImpl) {
                                        let obj = model;
                                        if (obj.getType() == null || ("object" === obj.getType())) {
                                            if (obj.getProperties() != null && obj.getProperties().size() > 0) {
                                                this.flattenProperties(obj.getProperties(), pathname);
                                                let modelName = this.resolveModelName(obj.getTitle(), bp.getName());
                                                bp.setSchema(new RefModel(modelName));
                                                this.addGenerated(modelName, model);
                                                swagger.addDefinition(modelName, model);
                                            }
                                        }
                                    }
                                    else if (model != null && model instanceof ArrayModel) {
                                        let am = model;
                                        let inner = am.getItems();
                                        if (inner != null && inner instanceof ObjectProperty) {
                                            let op = inner;
                                            if (op.getProperties() != null && op.getProperties().size() > 0) {
                                                this.flattenProperties(op.getProperties(), pathname);
                                                let modelName = this.resolveModelName(op.getTitle(), bp.getName());
                                                let innerModel = this.modelFromProperty(op, modelName);
                                                let existing = this.matchGenerated(innerModel);
                                                if (existing != null) {
                                                    am.setItems(new RefProperty(existing));
                                                }
                                                else {
                                                    am.setItems(new RefProperty(modelName));
                                                    this.addGenerated(modelName, innerModel);
                                                    swagger.addDefinition(modelName, innerModel);
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                    }
                    let responses = operation.getResponses();
                    if (responses != null) {
                        for (let index207 = responses.keySet().iterator(); index207.hasNext();) {
                            let key = index207.next();
                            {
                                let response = responses.get(key);
                                if (response.getSchema() != null) {
                                    let property = response.getSchema();
                                    if (property != null && property instanceof ObjectProperty) {
                                        let op = property;
                                        if (!(op.getProperties() == null || op.getProperties().isEmpty())) {
                                            let modelName = this.resolveModelName(op.getTitle(), "inline_response_" + key);
                                            let model = this.modelFromProperty(op, modelName);
                                            let existing = this.matchGenerated(model);
                                            if (existing != null) {
                                                response.setSchema(new RefProperty(existing));
                                            }
                                            else {
                                                response.setSchema(new RefProperty(modelName));
                                                this.addGenerated(modelName, model);
                                                swagger.addDefinition(modelName, model);
                                            }
                                        }
                                    }
                                    else if (property != null && property instanceof ArrayProperty) {
                                        let ap = property;
                                        let inner = ap.getItems();
                                        if (inner != null && inner instanceof ObjectProperty) {
                                            let op = inner;
                                            if ((!op.getProperties() == null || op.getProperties().isEmpty())) {
                                                this.flattenProperties(op.getProperties(), pathname);
                                                let modelName = this.resolveModelName(op.getTitle(), "inline_response_" + key);
                                                let innerModel = this.modelFromProperty(op, modelName);
                                                let existing = this.matchGenerated(innerModel);
                                                if (existing != null) {
                                                    ap.setItems(new RefProperty(existing));
                                                }
                                                else {
                                                    ap.setItems(new RefProperty(modelName));
                                                    this.addGenerated(modelName, innerModel);
                                                    swagger.addDefinition(modelName, innerModel);
                                                }
                                            }
                                        }
                                    }
                                    else if (property != null && property instanceof MapProperty) {
                                        let mp = property;
                                        let innerProperty = mp.getAdditionalProperties();
                                        if (innerProperty != null && innerProperty instanceof ObjectProperty) {
                                            let op = innerProperty;
                                            if (op.getProperties() != null && op.getProperties().size() > 0) {
                                                this.flattenProperties(op.getProperties(), pathname);
                                                let modelName = this.resolveModelName(op.getTitle(), "inline_response_" + key);
                                                let innerModel = this.modelFromProperty(op, modelName);
                                                let existing = this.matchGenerated(innerModel);
                                                if (existing != null) {
                                                    mp.setAdditionalProperties(new RefProperty(existing));
                                                }
                                                else {
                                                    mp.setAdditionalProperties(new RefProperty(modelName));
                                                    this.addGenerated(modelName, innerModel);
                                                    swagger.addDefinition(modelName, innerModel);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
        if (models != null) {
            let modelNames = Array.from(models.keySet());
            for (const modelName of modelNames) {
                {
                    let model = models.get(modelName);
                    if (model != null && model instanceof ModelImpl) {
                        let m = model;
                        let properties = m.getProperties();
                        this.flattenProperties(properties, modelName);
                    }
                    else if (model != null && model instanceof ArrayModel) {
                        let m = model;
                        let inner = m.getItems();
                        if (inner != null && inner instanceof ObjectProperty) {
                            let op = inner;
                            if (op.getProperties() != null && op.getProperties().size() > 0) {
                                let innerModelName = this.uniqueName(modelName + "_inner");
                                let innerModel = this.modelFromProperty(op, innerModelName);
                                let existing = this.matchGenerated(innerModel);
                                if (existing == null) {
                                    swagger.addDefinition(innerModelName, innerModel);
                                    this.addGenerated(innerModelName, innerModel);
                                    m.setItems(new RefProperty(innerModelName));
                                }
                                else {
                                    m.setItems(new RefProperty(existing));
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    resolveModelName(title, key) {
        if (title == null) {
            return this.uniqueName(key);
        }
        else {
            return this.uniqueName(title);
        }
    }

    matchGenerated(model) {
        if (this.skipMatches) {
            return null;
        }
        let json = Json.pretty(model);
        if (this.generatedSignature.containsKey(json)) {
            return this.generatedSignature.get(json);
        }
        return null;
    }

    addGenerated(name, model) {
        this.generatedSignature.put(Json.pretty(model), name);
    }

    uniqueName(key) {
        let count = 0;
        let done = false;
        key = key.replace(new RegExp("[^a-z_\\.A-Z0-9 ]", 'g'), "");
        while ((!done)) {
            let name = key;
            if (count > 0) {
                name = key + "_" + count;
            }
            if (this.swagger.getDefinitions() == null) {
                return name;
            }
            else if (!this.swagger.getDefinitions().containsKey(name)) {
                return name;
            }
            count += 1;
        }
        ;
        return key;
    }

    flattenProperties(properties, path) {
        if (properties == null) {
            return;
        }
        let propsToUpdate = newHashMap();
        let modelsToAdd = newHashMap();
        for (let index209 = properties.keySet().iterator(); index209.hasNext();) {
            let key = index209.next();
            {
                let property = properties.get(key);
                if ((property != null && property instanceof ObjectProperty) && property.getProperties() != null && property.getProperties().size() > 0) {
                    let modelName = this.uniqueName(path + "_" + key);
                    let op = property;
                    let model = this.modelFromProperty(op, modelName);
                    let existing = this.matchGenerated(model);
                    if (existing != null) {
                        propsToUpdate.put(key, new RefProperty(existing));
                    }
                    else {
                        propsToUpdate.put(key, new RefProperty(modelName));
                        modelsToAdd.put(modelName, model);
                        this.addGenerated(modelName, model);
                        this.swagger.addDefinition(modelName, model);
                    }
                }
                else if (property != null && property instanceof ArrayProperty) {
                    let ap = property;
                    let inner = ap.getItems();
                    if (inner != null && inner instanceof ObjectProperty) {
                        let op = inner;
                        if (!(op.getProperties() == null || op.getProperties().isEmpty())) {
                            this.flattenProperties(op.getProperties(), path);
                            let modelName = this.uniqueName(path + "_" + key);
                            let innerModel = this.modelFromProperty(op, modelName);
                            let existing = this.matchGenerated(innerModel);
                            if (existing != null) {
                                ap.setItems(new RefProperty(existing));
                            }
                            else {
                                ap.setItems(new RefProperty(modelName));
                                this.addGenerated(modelName, innerModel);
                                this.swagger.addDefinition(modelName, innerModel);
                            }
                        }
                    }
                }
                else if (property != null && property instanceof MapProperty) {
                    let mp = property;
                    let inner = mp.getAdditionalProperties();
                    if (inner != null && inner instanceof ObjectProperty) {
                        let op = inner;
                        if (op.getProperties() != null && op.getProperties().size() > 0) {
                            this.flattenProperties(op.getProperties(), path);
                            let modelName = this.uniqueName(path + "_" + key);
                            let innerModel = this.modelFromProperty(op, modelName);
                            let existing = this.matchGenerated(innerModel);
                            if (existing != null) {
                                mp.setAdditionalProperties(new RefProperty(existing));
                            }
                            else {
                                mp.setAdditionalProperties(new RefProperty(modelName));
                                this.addGenerated(modelName, innerModel);
                                this.swagger.addDefinition(modelName, innerModel);
                            }
                        }
                    }
                }
            }
        }
        if (!(propsToUpdate.isEmpty())) {
            for (let index210 = propsToUpdate.keySet().iterator(); index210.hasNext();) {
                let key = index210.next();
                {
                    properties.put(key, propsToUpdate.get(key));
                }
            }
        }
        for (let index211 = modelsToAdd.keySet().iterator(); index211.hasNext();) {
            let key = index211.next();
            {
                this.swagger.addDefinition(key, modelsToAdd.get(key));
                this.addedModels.put(key, modelsToAdd.get(key));
            }
        }
    }

    modelFromProperty(object, path) {
        if (((object != null && object instanceof ArrayProperty) || object === null) && ((typeof path === 'string') || path === null)) {
            let __args = Array.prototype.slice.call(arguments);
            return (() => {
                let description = object.getDescription();
                let example = null;
                let obj = object.getExample();
                if (obj != null) {
                    example = obj.toString();
                }
                let inner = object.getItems();
                if (inner != null && inner instanceof ObjectProperty) {
                    let model = new ArrayModel();
                    model.setDescription(description);
                    model.setExample(example);
                    model.setItems(object.getItems());
                    return model;
                }
                return null;
            })();
        }
        else if (((object != null && object instanceof ObjectProperty) || object === null) && ((typeof path === 'string') || path === null)) {
            return this.modelFromProperty$io_swagger_models_properties_ObjectProperty$java_lang_String(object, path);
        }
        else if (((object != null && object instanceof MapProperty) || object === null) && ((typeof path === 'string') || path === null)) {
            return this.modelFromProperty$io_swagger_models_properties_MapProperty$java_lang_String(object, path);
        }
        else
            throw new Error('invalid overload');
    }

    modelFromProperty$io_swagger_models_properties_ObjectProperty$java_lang_String(object, path) {
        let description = object.getDescription();
        let example = null;
        let obj = object.getExample();
        if (obj != null) {
            example = obj.toString();
        }
        let name = object.getName();
        let xml = object.getXml();
        let properties = object.getProperties();
        let model = new ModelImpl();
        model.setDescription(description);
        model.setExample(example);
        model.setName(name);
        model.setXml(xml);
        if (properties != null) {
            this.flattenProperties(properties, path);
            model.setProperties(properties);
        }
        return model;
    }

    modelFromProperty$io_swagger_models_properties_MapProperty$java_lang_String(object, path) {
        let description = object.getDescription();
        let example = null;
        let obj = object.getExample();
        if (obj != null) {
            example = obj.toString();
        }
        let model = new ArrayModel();
        model.setDescription(description);
        model.setExample(example);
        model.setItems(object.getAdditionalProperties());
        return model;
    }

    isSkipMatches() {
        return this.skipMatches;
    }

    setSkipMatches(skipMatches) {
        this.skipMatches = skipMatches;
    }
}
const Log = LoggerFactory.getLogger(InlineModelResolver);
