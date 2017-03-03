import {newHashMap, HashMap} from "./javaUtil";
import factory from "../models/factory";
import Response from "sway/lib/types/response";
import SwaggerApi from "sway/lib/types/api";
import Path from "sway/lib/types/path";
import Operation from "sway/lib/types/operation";
import parameterFactory from "../models/parameters";
import {beanify, beanProxy, apply} from "./beanUtils";
import Sway from "sway";

['get', 'post', 'put', 'head', 'patch', 'delete', 'options'].map(function method(name) {

    Path.prototype[`get${name[0].toUpperCase()}${name.substring(1)}`] = function () {
        const val = this[name];
        if (val == null) return val;

        return beanProxy(Object.assign({}, this[name], {
            getParameters(){
                if (!this._parameters) {
                    this._parameters = this.parameters ? this.parameters.map(parameterFactory) : [];
                }
                return this._parameters;
            },
            getResponses(){
                if (!this._responses)
                    this._responses = new HashMap(Object.keys(this.responses).map(key => {
                        const resp = this.responses[key], ret = Object.assign({}, resp, {
                            getSchema() {
                                if (!ret._schema) {
                                    ret._schema = factory(resp.schema);
                                }
                                return ret._schema;
                            }
                        });
                        return [key, beanProxy(ret)]
                    }));
                return this._responses;
            }
        }));
    }
});

Operation.prototype.getParameters = function () {
    if (!this._parameters) {
        this._parameters = this.parameters ? this.parameters.map(parameterFactory) : [];
    }
    return this._parameters;
};

const _asResponse = (r) => [(r.statusCode || 'default') + '', r];

Operation.prototype.getResponses = function () {
    if (!this._responses) {
        this._responses = new HashMap(this.responseObjects.map(_asResponse));
    }
    return this._responses;
};

Array.prototype.isEmpty = function () {
    return this.length === 0;
};

Response.prototype.getSchema = function () {
    if (!this._schema) {
        this._schema = factory(this.schema);
    }
    return this._schema;
};
Response.prototype.setSchema = function (schema) {
    this._schema = schema;
};

SwaggerApi.prototype.getDefinitions = function () {
    if (!this._definitions) {
        const defs = Object.keys(this.definitions).map(key => {
            const obj = factory(Object.assign({name: key, title: key}, this.definitions[key]));
            return [key, obj]
        });
        this._definitions = new HashMap(defs);
    }
    return this._definitions;
};

SwaggerApi.prototype.addDefinition = function (name, definition) {
    this._definitions.put(name, definition);
};

class Info {
    getContact() {
        return beanProxy(this.info);
    }

    getLicense() {
        return beanProxy(this.license);
    }
}

beanify(Info, ['title', 'description', 'version', 'title', 'termsOfService']);

SwaggerApi.prototype.getInfo = function () {
    if (!this._info) {
        this._info = apply(new Info(), this.info);
    }
};

beanify(SwaggerApi.prototype, ['info', 'host', 'basePath', 'tags', 'schemes', 'produces', 'consumes', 'security', 'paths',
    'securityDefinitions', 'definitions', 'parameters', 'responses', 'externalDocs', ['vendorExtensions', newHashMap]
]);


export default Sway;
