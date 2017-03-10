import StringBuilder from '../java/StringBuilder';
import camelCase from 'lodash/camelCase';
const SORT_CMDS = (a, b) => a.replace(PREFIX, '').localeCompare(b.replace(PREFIX, ''));
const PREFIX = /^-+?/;
export class Command {
    constructor({name, description}, options = []) {
        this.name = name;
        this.description = description;
        this.options = options;
    }
}
export class Help {
    static Usage = new Command({name: "help", description: "This helpful message."}, []);

    constructor(values, command = []) {
        this.globalMeta = values;
        this.commands = command;
    }

    run() {
        const {name, description} = this.globalMeta;
        console.log(`${name} ${description}`);
        for (const cmd of this.commands.sort(SORT_CMDS)) {
            console.log(`\t${cmd}`);
        }
    }
}
class CliError extends Error {
    constructor(message, cmd, opt) {
        super(message);
        this.cmd = cmd;
        this.opt = opt;
    }
}
export class Cli {
    static builder(name) {
        const opts = {name};
        const w = {
            withDescription(description){
                opts.description = description;
                return w;
            },
            withDefaultCommand(command){
                opts.defaultCommand = command;
                return w;
            },
            withCommands(...commands){
                opts.commands = commands;
                return w;
            },
            build(){
                return {
                    async parse(args = []){
                        const values = {};
                        let Command = opts.defaultCommand;
                        for (const c of opts.commands) {
                            if (c.Usage.name === args[0]) {
                                Command = c;
                                break;
                            }
                        }
                        if (!Command) {
                            throw new CliError(args.length ? `Unknown Command  ${args[0]}` : 'No Command given');
                        }
                        let isHelp = args.indexOf('-h') > -1 || args.indexOf("--help") > -1;
                        for (const opt of Command.Usage.options) {
                            let _check;
                            let idx;
                            NAMES: for (const name of opt.name) {
                                idx = args.indexOf(name);
                                if (idx > -1) {
                                    _check = opt;
                                    break NAMES;
                                }
                            }
                            if (_check) {
                                const property = opt.property || camelCase(opt.title);
                                if (_check.hasArg) {
                                    if (idx + 1 > args.length) {
                                        throw new CliError(`${_check.name} requires a value`, Command, opt);
                                    }
                                    values[property] = args[idx + 1];
                                } else {
                                    values[property] = true;
                                }
                            } else {
                                if (opt.required) {
                                    throw new CliError(`${args[0]} requires a option for ${opt.description}`, Command, opt);
                                }
                            }
                        }
                        if (isHelp) {
                            let str = `Command ${Command.Usage.name} has the following options:\n`;
                            for (const opt of Command.Usage.options) {
                                const cname = opt.property || camelCase(values[opt.title]);
                                str = `${str}
\t${opt.required ? '* ' : ''}${pad(opt.name[0], opt.required ? 3 : 5)}   ${pad(opt.name[1], 20)}  ${pad(cname in values ? values[cname] : opt.hasArg ? '<value>' : '', 20)} ${opt.description} `
                            }
                            return str;
                        }
                        return await new Command(values, opts).run();
                    }
                }
            }
        };

        return w;
    }
}


export class Options {
    options = [];
    parser = new BasicParser(this);

    parse(args) {
        return this.parser.parse(args);

    }

    /**  OptionType type() default OptionType.COMMAND;

     String title() default "";

     String[] name();

     String description() default "";

     boolean required() default false;

     int arity() default -2147483648;

     boolean hidden() default false;

     String[] allowedValues() default {};**/
    add({name:[short, long], title, description, has, arg, required, allowedValues}) {
        this.options.push({
            short,
            long,
            title,
            message: description,
            required,
            allowedValues
        })
    }

    addOption(short, long, hasArg = false, message = '') {
        long = long || short;
        this.options.push({short, long, hasArg, message});
    }
}
const pad = (str = '', count = 0, pad = ' ') => {
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
