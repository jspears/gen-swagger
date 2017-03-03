import AbstractModel from "./AbstractModel";
import {DEFINITION} from "./refs/RefType";
import GenericRef from "./refs/GenericRef";

export default class RefModel extends AbstractModel {

    constructor(ref) {
        super();
        if (typeof ref === 'string') {
            this.set$ref(ref);
        }
    }

    asDefault(ref) {
        this.set$ref(DEFINITION.getInternalPrefix() + ref);
        return this;
    };

    getTitle() {
        return this.title;
    };

    setTitle(title) {
        this.title = title;
    };

    getDescription() {
        return this.description;
    };

    setDescription(description) {
        this.description = description;
    };

    getProperties() {
        return this.properties;
    };

    setProperties(properties) {
        this.properties = properties;
    };

    getSimpleRef() {
        return this.genericRef.getSimpleRef();
    };

    get$ref() {
        return this.genericRef.getRef();
    };

    set$ref(ref) {
        this.genericRef = new GenericRef(DEFINITION, ref);
    };

    getRefFormat() {
        return this.genericRef.getFormat();
    };

    getExample() {
        return this.example;
    };

    setExample(example) {
        this.example = example;
    };

    getExternalDocs() {
        return this.externalDocs;
    };

    setExternalDocs(value) {
        this.externalDocs = value;
    };

    clone() {
        var cloned = new RefModel();
        cloned.genericRef = this.genericRef;
        cloned.description = this.description;
        cloned.properties = this.properties;
        cloned.example = this.example;
        return cloned;
    };

    getVendorExtensions() {
        return null;
    };

    getReference() {
        return this.genericRef.getRef();
    };

    setReference(reference) {
        this.genericRef = new GenericRef(DEFINITION, reference);
    };
}