import Class from './java/Class';
import {load} from './java/ServiceLoader'

export default  {
    /**
     * Tries to load config class with SPI first, then with class name directly from classpath
     *
     * @param name name of config, or full qualified class name in classpath
     * @return config class
     */
    forName(name) {
        let loader = load("io.swagger.codegen.CodegenConfig");
        let availableConfigs = new StringBuilder();
        for (const config of loader) {
            if ((config.getName() === name)) {
                return config;
            }
            availableConfigs.append(config.getName()).append("\n");
        }
        try {
            return Class.forName(name).newInstance();
        }
        catch (e) {
            throw new Error("Can\'t load config class with name ".concat(name) + " Available: " + availableConfigs.toString(), e);
        }
    }
}
