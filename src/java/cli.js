export class Options {
    options = [];

    addOption(short, long, hasArg = false, message = '') {
        long = long || short;
        options.push({short, long, hasArg, message});
    }
}
export class BasicParser {
    values = {};

    parse(options, args) {
        for (const {short, long, hasArg, message} of options.options) {
            let idx = args.indexOf(short);
            if (idx < 0) idx = args.indexOf(long);
            if (idx < 0) continue;
            let val = true;
            if (hasArg) {
                if (i + 1 > args.length) {
                    throw new Error(`${long} needs an argument: ${message}`)
                }
                val = args[i + 1];
            } else {
                this.values[long]
            }
            this.values[long] = this.values[short] = val;
        }
    }

    getOptionValue(k) {
        return this.values[k];
    }

    hasOption(short) {
        return (short in this.values)
    }

}
