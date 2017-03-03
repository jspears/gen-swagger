import AbstractModel from './AbstractModel';

export default class ArrayModel extends AbstractModel {

    constructor() {
        super();
        this.type = "array";
    }

    description(description) {
        this.setDescription(description);
        return this;
    };

    items(items) {
        this.setItems(items);
        return this;
    };

    minItems(minItems) {
        this.setMinItems(minItems);
        return this;
    };

    maxItems(maxItems) {
        this.setMaxItems(maxItems);
        return this;
    };

    getType() {
        return this.type;
    };

    setType(type) {
        this.type = type;
    };

    getDescription() {
        return this.__description;
    };

    setDescription(description) {
        this.__description = description;
    };

    getItems() {
        return this.__items;
    };

    setItems(items) {
        this.__items = items;
    };

    getProperties() {
        return this.properties;
    };

    setProperties(properties) {
        this.properties = properties;
    };

    getExample() {
        return this.example;
    };

    setExample(example) {
        this.example = example;
    };

    getMinItems() {
        return this.__minItems;
    };

    setMinItems(minItems) {
        this.__minItems = minItems;
    };

    getMaxItems() {
        return this.__maxItems;
    };

    setMaxItems(maxItems) {
        this.__maxItems = maxItems;
    };


    clone() {
        var cloned = new ArrayModel();
        cloned.properties = this.properties;
        cloned.type = this.type;
        cloned.__description = this.__description;
        cloned.__items = this.__items;
        cloned.example = this.example;
        return cloned;
    };

}