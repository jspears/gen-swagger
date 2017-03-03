import {newHashMap} from "../java/javaUtil";

export default class AbstractModel {
    constructor() {

        this.vendorExtensions = newHashMap();
    }

    getExternalDocs() {
        return this.externalDocs;
    };

    setExternalDocs(value) {
        this.externalDocs = value;
    };

    getTitle() {
        return this.title;
    };

    setTitle(title) {
        this.title = title;
    };

    getVendorExtensions() {
        return this.vendorExtensions;
    };

    setVendorExtension(name, value) {
        if (name instanceof Map) {

            this.vendorExtensions = name;
        } else if (typeof name === 'string' && name.startsWith("x-")) {
            this.vendorExtensions.put(name, value);
        }
    };

    setVendorExtensions(vendorExtensions) {
        this.vendorExtensions = vendorExtensions;
    };


    getReference() {
        return this.reference;
    };

    setReference(reference) {
        this.reference = reference;
    };
}
