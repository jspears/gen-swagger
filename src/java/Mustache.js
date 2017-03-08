import Mustache from "Mustache";
import Json from "./Json";
import LoggerFactory from "./LoggerFactory";

const Log = LoggerFactory.getLogger('Mustache');
export default ({
    compiler(){
        let defValue;
        let partialProxy;
        const cret = {

            withLoader(_loader){
                const partials = {};
                const handler = {
                    get (target, name){
                        if (name in target) return target[name];
                        return (target[name] = _loader.getTemplate(name));
                    }
                };
                partialProxy = new Proxy(partials, handler);
                return cret;
            },
            defaultValue(def){
                defValue = def;
                return cret;
            },
            compile(template, file){

                return {
                    execute(data){
                        data = JSON.parse(Json.pretty(data));
                        return Mustache.render(template, data, partialProxy)
                    }
                };
            }
        };
        return cret;
    }
})
