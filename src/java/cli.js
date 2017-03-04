export class Options {
    options = [];
    parser = new BasicParser(this);

    parse(args) {
        return this.parser.parse(args);

    }


    addOption(short, long, hasArg = false, message = '') {
        long = long || short;
        this.options.push({short, long, hasArg, message});
    }
}
const pad = (str, count, pad = ' ') => {
    let d = count - str.length;
    while (pad.length < d) {
        pad += pad;
    }
    return str + pad;
};

export class HelpFormatter {
    formatHelp(help, options = {options: []}) {
        help = help.split('.\n').join('\n');

        help += '\n';
        for (const {short = '', long = '', hasArg = false, message = ''} of options.options) {
            const pshort = pad(short ? `-${short}` : '', 3);
            const plong = pad(long ? `--${long}` : '', 12);
            const parg = pad(hasArg ? `[${long}]` : '', 20);
            help += `\t\v${pshort}\t${plong}\t${parg}\t${message}\n`;
        }
        return help;
    }

    printHelp(message, options) {
        console.error(this.formatHelp(message, options));
    }
}

export class BasicParser {
    values = {};
    formatter = new HelpFormatter();

    constructor(Options) {
        this.options = Options;
    }

    usage() {
        this.formatter.printHelp("MetaGenerator. Generator for creating a new template set and configuration for Codegen.  The output will be based on the language you specify, and includes default templates to include.", this.options);
    }

    parse(args) {
        for (const {short, long, hasArg, message} of this.options.options) {
            let idx = args.indexOf(`-${short}`);
            if (idx < 0) idx = args.indexOf(`--${long}`);
            if (idx < 0) continue;
            let val = true;
            if (hasArg) {
                if (idx + 1 > args.length) {
                    throw new Error(`${long} needs an argument: ${message}`)
                }
                val = args[idx + 1];
            }

            this.values[long] = this.values[short] = val;
        }
        return this;
    }

    static parse(options, args) {
        return new BasicParser(options).parse(args);
    }

    getOptionValue(k) {
        return this.values[k];
    }

    hasOption(short) {
        return (short in this.values)
    }

}
