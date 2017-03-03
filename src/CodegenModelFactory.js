import {newHashMap} from './java/javaUtil';

export default class CodegenModelFactory {
    static  _typeMapping = newHashMap();

    /**
     * Configure a different implementation class.
     *
     * @param type           the type that shall be replaced
     * @param implementation the implementation class must extend the default class and must provide a public no-arg constructor
     */
    static setTypeMapping = function (type, implementation) {
        if (!(implemenation instanceof type.getDefaultImplementation())) {
            throw new Error(implementation) + " doesn\'t extend " + type
        }

        CodegenModelFactory._typeMapping.put(type, implementation);
    };
    static newInstance = function (type) {
        const classType = CodegenModelFactory._typeMapping.get(type) || type.getDefaultImplementation();
        return new classType;
    }
}
