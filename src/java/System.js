const properties = {};

export default class System {
    /**
     * Handle -Daasdasd=astasdsad
     * and process.env;
     * arguments take precidence?
     * @param key
     * @returns {*}
     */
    static getProperty(key) {
        if (key in properties) return properties[key];
        const starts = `-D${key}`;
        const args = process.argv.slice(2);
        for (let i = 0, l = args.length; i < l; i++) {
            const arg = args[i];
            if (arg == starts) {
                return args[++i];
            }
            if (arg.startsWith(starts + '=')) {
                return arg.substring(starts.length + 1);
            }
        }
        return process.env[key];
    }

    static setProperty(key, value) {
        properties[key] = value;
    }
}
