import {newHashMap, HashMap} from "./javaUtil";
import factory from "../models/factory";
import Response from "sway/lib/types/response";
import SwaggerApi from "sway/lib/types/api";
import Path from "sway/lib/types/path";
import Operation from "sway/lib/types/operation";
import parameterFactory from "../models/parameters";
import {beanify, beanProxy, apply} from "./beanUtils";
import {Property} from "../models/properties";
import Sway from "sway";

['get', 'post', 'put', 'head', 'patch', 'delete', 'options'].map(function method(name) {
    this[`get${name[0].toUpperCase()}${name.substring(1)}`] = function () {
        return this.getOperation(name);

    }
}, Path.prototype);
Path.prototype.toJSON = function(){
    return this.definition;
};
const _asResponse = (r) => [(r.statusCode || 'default') + '', r];

beanify(Object.assign(Operation.prototype, {
    getVendorExtensions(){
        if (!this._vendorExtensions) {
            this._vendorExtensions = newHashMap();
        }
        return this._vendorExtensions;
    },
    getParameters() {
        if (!this._parameters) {
            this._parameters = this.parameters ? this.parameters.map(parameterFactory) : [];
        }
        return this._parameters;
    },
    getResponses() {
        if (!this._responses) {
            this._responses = new HashMap(this.responseObjects.map(_asResponse));
        }
        return this._responses;
    },
    getSchema(){
        if (!this._schema) {
            this._schema = factory(this.schema);
        }
        return this._schema;
    }
}), ['produces', 'summary', 'tags', 'operationId', 'description', 'externalDocs', 'consumes', 'schemes', 'method', 'securityDefinitions']);


Array.prototype.isEmpty = function () {
    return this.length === 0;
};

beanify(Object.assign(Response.prototype, {
    getSchema () {
        if (!this._schema) {
            this._schema = factory(Object.assign({description: this.definition.description}, this.definition.schema));
        }
        return this._schema;
    },
    setSchema(schema) {
        if (schema instanceof Property)
            this._schema = schema;
        else
            this.schema = schema;
    },
    getCode(){
        return this.statusCode;
    },
    getHeaders(){
        return this.headers && new HashMap(Object.keys(this.headers).map(key => [key, this.headers[key]]));
    },
    toJSON(){
        return this.definition;
    }
}), ['description', 'statusCode', 'examples']);

SwaggerApi.prototype.getDefinitions = function () {
    if (!this._definitions) {
        const defs = Object.keys(this.definitions).map(key => [key, factory(Object.assign({
            name: key
        }, this.definitions[key]))]);
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
