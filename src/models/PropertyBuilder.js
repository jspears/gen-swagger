import {resolve, factory} from "./factory";
import ModelImpl from "./ModelImpl";
import ArrayModel from "./ArrayModel";
import RefModel from "./RefModel";
import {apply} from "../java/beanUtils";
import {ArrayProperty, RefProperty} from "./properties";
import LoggerFactory from "../java/LoggerFactory";
//                var p = PropertyBuilder.build(impl.getType(), impl.getFormat(), null);
function createModel(property) {
    return new ModelImpl().type(property.getType()).format(property.getFormat())
        .description(property.getDescription());
}
const Log = LoggerFactory.getLogger(`PropertyBuilder`);

export default ({
    build(type, format, args){

        const prop = {type, format};
        if (args) {
            for (const [k, v] of args) {
                prop[k] = v;
            }
        }
        const property = factory(prop);
        if (property == null) {
            Log.error(`could not find property for type ${type} ${format}`);
        }
        return property;
    },
    toModel(property){

        const clazz = resolve({type, format});
        const {allowedProps} = clazz;
        let model;
        if (clazz === ArrayProperty) {
            model = new ArrayModel();
        } else if (clazz == RefProperty) {
            model = new RefModel();

        } else {
            model = new ModelImpl();
        }

        apply(model, property, [...allowedProps, "getExternalDocs"]);

        return model;

    }
})
